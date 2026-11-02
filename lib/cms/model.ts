import { z } from "zod";

export const statuses = [
  "planned",
  "draft",
  "verification",
  "approval",
  "scheduled",
  "published",
  "archived",
] as const;
export const statusLabels: Record<string, string> = {
  planned: "مخطط",
  draft: "مسودة",
  verification: "قيد التحقق",
  approval: "بانتظار الاعتماد",
  scheduled: "مجدول",
  published: "منشور",
  archived: "مؤرشف",
};
const optionalDate = z
  .string()
  .refine((v) => !v || Number.isFinite(Date.parse(v)), "تاريخ غير صالح");
const safeUrl = z
  .string()
  .max(2000)
  .refine(
    (v) => !v || /^https:\/\//.test(v) || /^\/(?!\/)/.test(v),
    "استخدم رابط HTTPS أو مسارًا داخليًا",
  );
export const blockSchema = z.object({
  id: z.string(),
  kind: z.enum([
    "requirements",
    "fees",
    "deadline",
    "warning",
    "troubleshooting",
    "step",
    "faq",
    "error",
    "component",
  ]),
  title: z.string().max(300),
  text: z.string().max(12000),
  sourceUrl: safeUrl.default(""),
  mediaUrl: safeUrl.default(""),
  component: z
    .enum(["electricity", "checklist", "electricity-details"])
    .optional(),
});
export function validRichBody(value: unknown, depth = 0): boolean {
  if (depth > 25 || !value || typeof value !== "object") return false;
  const node = value as {
    type?: string;
    attrs?: Record<string, unknown>;
    content?: unknown[];
    marks?: { type: string; attrs?: Record<string, unknown> }[];
  };
  if (
    ![
      "doc",
      "paragraph",
      "text",
      "heading",
      "bulletList",
      "orderedList",
      "listItem",
      "blockquote",
      "hardBreak",
      "horizontalRule",
      "codeBlock",
      "table",
      "tableRow",
      "tableCell",
      "tableHeader",
      "image",
    ].includes(node.type ?? "")
  )
    return false;
  if (
    node.type === "image" &&
    (!safeUrl.safeParse(node.attrs?.src).success || !node.attrs?.alt)
  )
    return false;
  if (
    node.marks?.some(
      (m) => m.type === "link" && !safeUrl.safeParse(m.attrs?.href).success,
    )
  )
    return false;
  return (
    !node.content ||
    (Array.isArray(node.content) &&
      node.content.length <= 10000 &&
      node.content.every((n) => validRichBody(n, depth + 1)))
  );
}
export const documentSchema = z.object({
  operationsItemId: z.uuid().optional(),
  editorialOverrideReason: z.string().max(3000).optional(),
  id: z.string().uuid(),
  slug: z
    .string()
    .min(1)
    .max(180)
    .regex(/^[\p{L}\p{N}-]+$/u),
  title: z.string().min(1).max(250),
  description: z.string().max(300),
  author: z.string().max(150),
  category: z.string().max(100),
  status: z.enum(statuses),
  answer: z.string().max(6000),
  summary: z
    .array(
      z.object({ label: z.string().max(250), value: z.string().max(2000) }),
    )
    .max(50),
  body: z
    .record(z.string(), z.unknown())
    .refine(
      (v) => v.type === "doc" && validRichBody(v),
      "بنية نص المقال غير صالحة",
    ),
  blocks: z.array(blockSchema).max(100),
  sources: z
    .array(
      z.object({
        label: z.string().max(250),
        url: safeUrl,
        checkedAt: optionalDate,
        expiresAt: optionalDate,
      }),
    )
    .max(60),
  reviewedAt: optionalDate,
  scheduledAt: optionalDate,
  deadline: optionalDate,
  updatedAt: optionalDate,
  version: z.number().int().nonnegative(),
});
export type CmsDocument = z.infer<typeof documentSchema>;
export type CmsBlock = z.infer<typeof blockSchema>;
export function emptyDocument(): CmsDocument {
  return {
    id: crypto.randomUUID(),
    slug: "",
    title: "مقال جديد",
    description: "",
    author: "مدير التحرير",
    category: "",
    status: "draft",
    answer: "",
    summary: [],
    body: { type: "doc", content: [{ type: "paragraph" }] },
    blocks: [],
    sources: [],
    reviewedAt: "",
    scheduledAt: "",
    deadline: "",
    updatedAt: new Date().toISOString(),
    version: 0,
  };
}
export function warnings(d: CmsDocument, now = Date.now()) {
  const result: string[] = [];
  if (d.description.length < 140 || d.description.length > 155)
    result.push("الوصف التعريفي خارج نطاق 140–155 حرفًا");
  if (d.title.length > 60) result.push("العنوان أطول من 60 حرفًا");
  if (!d.answer.trim()) result.push("الإجابة المباشرة ناقصة");
  if (!d.sources.length) result.push("لا توجد مصادر موثقة");
  if (!d.reviewedAt || now - Date.parse(d.reviewedAt) > 30 * 86400000)
    result.push("مراجعة المحتوى متأخرة");
  if (
    d.sources.some(
      (s) =>
        !s.checkedAt ||
        now - Date.parse(s.checkedAt) > 30 * 86400000 ||
        (s.expiresAt && Date.parse(s.expiresAt) < now),
    )
  )
    result.push("مصدر يحتاج إعادة التحقق");
  return result;
}
function hasBodyH1(body: unknown): boolean {
  const n = body as {
    type?: string;
    attrs?: { level?: number };
    content?: unknown[];
  };
  return (
    (n.type === "heading" && n.attrs?.level === 1) ||
    Boolean(n.content?.some(hasBodyH1))
  );
}
export function publishErrors(d: CmsDocument) {
  return [
    !/^[A-H]$/.test(d.category) ? "اختر تصنيفًا صالحًا للمقال" : "",
    hasBodyH1(d.body) ? "عنوان المقال هو H1؛ استخدم H2–H6 داخل النص" : "",
    d.blocks.some(
      (b) => b.kind === "faq" && (!b.title.trim() || !b.text.trim()),
    )
      ? "أكمل الأسئلة الشائعة"
      : "",
    !d.answer.trim() ? "أضف الإجابة المباشرة" : "",
    !d.sources.length ? "أضف مصدرًا رسميًا" : "",
    !d.reviewedAt ? "حدد تاريخ المراجعة" : "",
    d.sources.some(
      (s) =>
        !s.checkedAt ||
        !s.url ||
        (s.expiresAt && Date.parse(s.expiresAt) < Date.now()),
    )
      ? "تحقق من جميع المصادر"
      : "",
    JSON.stringify(d.body).length > 700000 ? "نص المقال كبير جدًا" : "",
    d.status === "scheduled" &&
    (!d.scheduledAt || Date.parse(d.scheduledAt) <= Date.now())
      ? "اختر موعد نشر مستقبليًا"
      : "",
  ].filter(Boolean);
}
export function normalizeTopic(s: string) {
  return s
    .normalize("NFKC")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/[\u064b-\u065fـ]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .toLowerCase();
}
