import { NextResponse, type NextRequest } from "next/server";
import { isOrderAdmin, supabaseRequest } from "@/lib/order-storage";
import { getService, statuses } from "@/lib/service-orders";

const cookieName = "lusail-orders-session";
const columns = "id,service,name,email,answers,status,created_at";
const fail = (status: number, error: string) => NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
const forbidden = () => fail(401, "سجّل الدخول بحساب الإدارة.");
const unavailable = () => fail(503, "تعذّر الوصول إلى الطلبات الآن.");
const isSameOrigin = (request: NextRequest) => request.headers.get("origin") === request.nextUrl.origin;

export async function GET(request: NextRequest) {
  const token = request.cookies.get(cookieName)?.value;
  if (!token) return forbidden();
  const page = Number(request.nextUrl.searchParams.get("page") ?? "0");
  if (!Number.isSafeInteger(page) || page < 0 || page > 10000) return fail(400, "رقم الصفحة غير صالح.");
  const filters = request.nextUrl.searchParams;
  const service = filters.get("service") ?? "";
  const status = filters.get("status") ?? "";
  const query = (filters.get("q") ?? "").trim();
  if ((service && !getService(service)) || (status && !Object.hasOwn(statuses, status)) ||
      query.length > 100 || /[\x00-\x1f\x7f]/.test(query)) return fail(400, "خيارات البحث غير صالحة.");

  const direction = filters.get("sort") === "oldest" ? "asc" : "desc";
  const params = new URLSearchParams({ select: columns, order: `created_at.${direction},id.${direction}`, limit: "26", offset: String(page * 25) });
  if (service) params.set("service", "eq." + service);
  if (status) params.set("status", "eq." + status);
  if (query) {
    const pattern = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const quoted = JSON.stringify(pattern);
    const matches = ["name.imatch." + quoted, "email.imatch." + quoted];
    if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(query)) matches.push("id.eq." + query);
    params.set("or", "(" + matches.join(",") + ")");
  }

  const orderPath = "/rest/v1/service_orders";
  try {
    if (!await isOrderAdmin(token)) return forbidden();
    const [result, counts] = await Promise.all([
      supabaseRequest(`${orderPath}?${params}`, { headers: { Prefer: "count=exact" } }, token),
      Promise.all(Object.keys(statuses).map(async key => {
        try {
          const response = await supabaseRequest(`${orderPath}?select=id&status=eq.${key}`, {
            method: "HEAD", headers: { Prefer: "count=exact" },
          }, token);
          return [key, response.ok ? readCount(response) : null] as const;
        } catch {
          return [key, null] as const;
        }
      })),
    ]);
    if (!result.ok) return unavailable();
    const rows = await result.json();
    return NextResponse.json({
      orders: rows.slice(0, 25), hasNext: rows.length > 25,
      total: readCount(result), counts: Object.fromEntries(counts),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return unavailable();
  }
}

function readCount(response: Response) {
  const value = response.headers.get("content-range")?.match(/\/(\d+)$/)?.[1];
  return value === undefined ? null : Number(value);
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return fail(403, "تعذّر التحقق من مصدر الطلب.");
  try {
    const credentials = await request.json();
    if (typeof credentials?.email !== "string" || credentials.email.length > 254 ||
        typeof credentials?.password !== "string" || !credentials.password || credentials.password.length > 1024) return forbidden();
    const result = await supabaseRequest("/auth/v1/token?grant_type=password", {
      method: "POST", body: JSON.stringify({ email: credentials.email.trim(), password: credentials.password }),
    });
    if (result.status === 429) return fail(429, "انتظر قليلًا ثم حاول تسجيل الدخول مرة أخرى.");
    if (!result.ok) return forbidden();
    const { access_token, expires_in } = await result.json();
    if (typeof access_token !== "string" || !await isOrderAdmin(access_token)) return forbidden();
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(cookieName, access_token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      path: "/api/admin/service-orders", maxAge: Math.min(Number(expires_in) || 3600, 3600),
    });
    return response;
  } catch {
    return unavailable();
  }
}

export async function PATCH(request: NextRequest) {
  if (!isSameOrigin(request)) return fail(403, "تعذّر التحقق من مصدر الطلب.");
  const token = request.cookies.get(cookieName)?.value;
  if (!token) return forbidden();
  try {
    const { id, status } = await request.json();
    if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id) ||
        typeof status !== "string" || !Object.hasOwn(statuses, status)) return fail(400, "حالة الطلب غير صالحة.");
    if (!await isOrderAdmin(token)) return forbidden();
    const result = await supabaseRequest(`/rest/v1/service_orders?id=eq.${id}&select=status`, {
      method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ status }),
    }, token);
    if (!result.ok) return unavailable();
    const rows = await result.json();
    return rows.length ? NextResponse.json({ status: rows[0].status }) : fail(404, "لم يتم العثور على الطلب.");
  } catch {
    return unavailable();
  }
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) return fail(403, "تعذّر التحقق من مصدر الطلب.");
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(cookieName, "", {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
    path: "/api/admin/service-orders", maxAge: 0,
  });
  return response;
}
