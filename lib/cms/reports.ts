import { z } from "zod";
export const reportSchema = z
  .object({
    kind: z.enum(["performance", "indexing"]),
    from: z.string().date(),
    to: z.string().date(),
    reason: z.string().max(300).default(""),
    csv: z.string().max(3000000),
  })
  .refine((v) => v.from <= v.to, "الفترة الزمنية غير صالحة");
export type ReportRow = {
  url: string;
  clicks?: number;
  impressions?: number;
  position?: number;
  reason?: string;
};
export type CmsReport = {
  kind: "performance" | "indexing";
  from: string;
  to: string;
  reason: string;
  rows: ReportRow[];
  importedAt: string;
};
export function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [],
    cell = "",
    quoted = false;
  const s = input.replace(/^\uFEFF/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"') {
      if (quoted && s[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(cell);
      if (row.some((x) => x.trim())) rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (quoted) throw Error("ملف CSV غير مكتمل");
  row.push(cell);
  if (row.some((x) => x.trim())) rows.push(row);
  if (rows.length > 20001) throw Error("الحد الأقصى 20000 صف");
  return rows;
}
export function parseSearchReport(
  input: z.infer<typeof reportSchema>,
): CmsReport {
  const [headers, ...body] = parseCsv(input.csv);
  if (!headers || !body.length) throw Error("التقرير فارغ");
  const key = (s: string) => s.trim().toLowerCase();
  const index = (names: string[]) =>
    headers.findIndex((h) => names.includes(key(h)));
  const urlIndex = index(["top pages", "page", "pages", "url"]);
  if (urlIndex < 0)
    throw Error("صدّر تقرير الصفحات باللغة الإنجليزية من Search Console");
  const clicks = index(["clicks"]),
    impressions = index(["impressions"]),
    position = index(["position"]);
  if (
    input.kind === "performance" &&
    [clicks, impressions, position].some((i) => i < 0)
  )
    throw Error("الأعمدة المطلوبة: Top pages, Clicks, Impressions, Position");
  if (input.kind === "indexing" && !input.reason.trim())
    throw Error("حدد سبب الاستبعاد كما يظهر في التقرير");
  const seen = new Set<string>();
  const number = (s: string) => {
    if (!s?.trim()) throw Error("قيمة رقمية ناقصة");
    const n = Number(s.replace(/,/g, "").trim());
    if (!Number.isFinite(n) || n < 0) throw Error("قيمة رقمية غير صالحة");
    return n;
  };
  const rows = body.map((c) => {
    const url = c[urlIndex]?.trim();
    let u: URL;
    try {
      u = new URL(url);
    } catch {
      throw Error("رابط غير صالح في CSV");
    }
    if (u.origin !== "https://www.lusaill.online")
      throw Error("التقرير يجب أن يخص https://www.lusaill.online");
    if (seen.has(url)) throw Error("رابط مكرر في التقرير");
    seen.add(url);
    if (input.kind === "indexing") return { url, reason: input.reason };
    const cl = number(c[clicks]),
      im = number(c[impressions]),
      pos = number(c[position]);
    if (!Number.isInteger(cl) || !Number.isInteger(im) || cl > im)
      throw Error("عدد النقرات أو مرات الظهور غير صالح");
    return { url, clicks: cl, impressions: im, position: pos };
  });
  return {
    kind: input.kind,
    from: input.from,
    to: input.to,
    reason: input.reason,
    rows,
    importedAt: new Date().toISOString(),
  };
}
