import { requireOps,opsError } from "@/lib/content-ops/server";
import { documentSchema, publishErrors } from "@/lib/cms/model";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const { client } = await requireOps();
    const { data, error } = await client
      .from("cms_documents")
      .select("document")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return Response.json(data?.map((r) => r.document) ?? [], {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return Response.json(
      { error: "غير مصرح أو تعذر الاتصال بقاعدة البيانات" },
      { status: 401 },
    );
  }
}
export async function POST(request: Request) {
  try {
    if (request.headers.get("origin") !== new URL(request.url).origin)
      return Response.json({ error: "طلب غير مسموح" }, { status: 403 });
    const { client } = await requireOps();
    const raw = await request.text();
    if (raw.length > 1000000)
      return Response.json({ error: "المقال كبير جدًا" }, { status: 413 });
    const parsed = documentSchema.safeParse(JSON.parse(raw));
    if (!parsed.success)
      return Response.json(
        { error: parsed.error.issues[0]?.message },
        { status: 400 },
      );
    const doc = parsed.data;
    if (["published", "scheduled"].includes(doc.status)) {
      const errors = publishErrors(doc);
      if (errors.length)
        return Response.json({ error: errors.join("، ") }, { status: 422 });
    }
    const { data, error } = await client.rpc("ops_cms_save", {
      payload: doc,
      expected_version: doc.version,
    });
    if (error)
      return Response.json(
        {
          error: error.message.includes("VERSION_CONFLICT")
            ? "تعارض تعديل: أعد تحميل النسخة الأحدث قبل الحفظ"
            : opsError(error).message,
        },
        { status: error.message.includes("VERSION_CONFLICT") ? 409 : 400 },
      );
    return Response.json(data, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return Response.json(
      { error: "تعذر الحفظ أو انتهت جلسة الدخول" },
      { status: 401 },
    );
  }
}
