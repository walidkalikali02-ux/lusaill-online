import { requireAdmin } from "@/lib/cms/server";
import { parseSearchReport, reportSchema } from "@/lib/cms/reports";
export async function GET() {
  try {
    const { client } = await requireAdmin();
    const { data, error } = await client
      .from("cms_reports")
      .select("report")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw error;
    return Response.json(data?.map((r) => r.report) ?? [], {
      headers: { "Cache-Control": "private,no-store" },
    });
  } catch {
    return Response.json({ error: "تعذر تحميل تقارير البحث" }, { status: 401 });
  }
}
export async function POST(request: Request) {
  try {
    if (request.headers.get("origin") !== new URL(request.url).origin)
      return Response.json({ error: "Forbidden" }, { status: 403 });
    const { client } = await requireAdmin();
    const text = await request.text();
    if (text.length > 3500000)
      return Response.json({ error: "الملف كبير جدًا" }, { status: 413 });
    const input = reportSchema.safeParse(JSON.parse(text));
    if (!input.success)
      return Response.json(
        { error: input.error.issues[0]?.message },
        { status: 400 },
      );
    let report;
    try {
      report = parseSearchReport(input.data);
    } catch (e) {
      return Response.json(
        { error: e instanceof Error ? e.message : "CSV غير صالح" },
        { status: 422 },
      );
    }
    const { error } = await client.from("cms_reports").insert({ report });
    if (error) throw error;
    return Response.json(report, {
      headers: { "Cache-Control": "private,no-store" },
    });
  } catch {
    return Response.json(
      { error: "تعذر حفظ التقرير؛ تحقق من الدخول وقاعدة البيانات" },
      { status: 401 },
    );
  }
}
