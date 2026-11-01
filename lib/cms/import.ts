import type { Article } from "@/lib/content";
import type { CmsDocument } from "./model";
export function importArticle(a: Article): CmsDocument {
  const id = `00000000-0000-4000-8000-${String(a.id).padStart(12, "0")}`;
  return {
    id,
    slug: a.slug,
    title: a.title,
    description: a.metaDescription ?? "",
    author: "فريق لوسيل",
    category: a.clusterCode,
    status:
      a.status === "published"
        ? "published"
        : a.status === "needs_verification"
          ? "verification"
          : "draft",
    answer: a.quickAnswer ?? "",
    summary: a.summaryTable ?? [],
    body: {
      type: "doc",
      content: (a.practicalSections ?? []).flatMap((s) => [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: s.title }],
        },
        ...(s.intro
          ? [{ type: "paragraph", content: [{ type: "text", text: s.intro }] }]
          : []),
        {
          type: "table",
          content: [
            {
              type: "tableRow",
              content: s.columns.map((text) => ({
                type: "tableHeader",
                content: [
                  { type: "paragraph", content: [{ type: "text", text }] },
                ],
              })),
            },
            ...s.rows.map((row) => ({
              type: "tableRow",
              content: row.map((text) => ({
                type: "tableCell",
                content: [
                  { type: "paragraph", content: [{ type: "text", text }] },
                ],
              })),
            })),
          ],
        },
      ]),
    },
    blocks: [
      ...(a.slug === "electricity-bill-inquiry"
        ? [
            {
              id: "electricity-details",
              kind: "component" as const,
              title: "تفاصيل استعلام الكهرباء",
              text: "",
              sourceUrl: "",
              mediaUrl: "",
              component: "electricity-details" as const,
            },
            {
              id: "calculator",
              kind: "component" as const,
              title: "حاسبة الكهرباء",
              text: "",
              sourceUrl: "",
              mediaUrl: "",
              component: "electricity" as const,
            },
          ]
        : []),
      ...(a.steps ?? []).map((s, i) => ({
        id: `step-${i}`,
        kind: "step" as const,
        title: s.title,
        text: s.detail,
        sourceUrl: s.sourceUrl ?? "",
        mediaUrl: "",
      })),
      ...(a.faqs ?? []).map((f, i) => ({
        id: `faq-${i}`,
        kind: "faq" as const,
        title: f.question,
        text: f.answer,
        sourceUrl: "",
        mediaUrl: "",
      })),
      ...(a.commonMistakes ?? []).map((text, i) => ({
        id: `error-${i}`,
        kind: "error" as const,
        title: "خطأ شائع",
        text,
        sourceUrl: "",
        mediaUrl: "",
      })),
    ],
    sources: (a.sources ?? []).map((s) => ({ ...s, expiresAt: "" })),
    reviewedAt:
      (a.sources ?? [])
        .map((s) => s.checkedAt)
        .sort()
        .at(-1)
        ?.slice(0, 10) ?? "",
    scheduledAt: "",
    deadline: "",
    updatedAt: a.updatedAt ?? a.publishedAt ?? "",
    version: 0,
  };
}
