import type { Article } from "../content";
import type { CmsDocument } from "./model";
import { clusters } from "../clusters";

// Only public snapshots belong here: private drafts never replace a live article.
export function mergePublicArticles(base: Article[], snapshots: CmsDocument[]): Article[] {
  const visible = new Map(base.filter(a => a.status === "published").map(a => [a.slug, a]));
  for (const doc of snapshots) {
    if (doc.status === "archived") { visible.delete(doc.slug); continue; }
    if (doc.status !== "published") continue;
    const original = visible.get(doc.slug);
    const category = clusters.find(c => c.code === doc.category);
    if (!category) continue;
    visible.set(doc.slug, {
      ...(original ?? { id: -parseInt(doc.id.replaceAll("-", "").slice(-10), 16), group: "bonus", volume: 0, kd: null, month: 1 }),
      slug: doc.slug, title: doc.title, keyword: doc.title,
      clusterCode: category.code, status: "published",
      metaDescription: doc.description, quickAnswer: doc.answer,
      summaryTable: doc.summary, sources: doc.sources, updatedAt: doc.updatedAt,
    });
  }
  return [...visible.values()];
}
