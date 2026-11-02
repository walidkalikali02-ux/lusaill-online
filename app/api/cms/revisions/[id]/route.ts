import { requireAdmin } from "@/lib/cms/server";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { client } = await requireAdmin();
    const { id } = await params;
    const { data, error } = await client
      .from("cms_revisions")
      .select("id,document,version,created_at")
      .eq("document_id", id)
      .order("version", { ascending: false })
      .limit(100);
    if (error) throw error;
    return Response.json(data, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return Response.json({ error: "تعذر تحميل المراجعات" }, { status: 401 });
  }
}
