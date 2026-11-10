import { getArticleBySlug, isArticleIndexable } from "@/lib/content";
import { clusters } from "@/lib/clusters";
import { getKnowledgeTopic } from "@/lib/knowledge-expansion-data";
import { getFoodSafetyArticle } from "@/lib/food-safety";
import { createEditorialCoverImage, createEditorialMapImage, type VisualSubject } from "@/lib/editorial-image-response";
import type { EditorialImageKind } from "@/lib/editorial-image-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageParams = { params: Promise<{ kind: string; slug: string; view: string }> };

function getSubject(kind: EditorialImageKind, slug: string): VisualSubject | null {
  if (kind === "articles") {
    const article = getArticleBySlug(slug);
    if (!article || !isArticleIndexable(article)) return null;
    return {
      title: article.title,
      category: clusters.find(item => item.code === article.clusterCode)?.name ?? "دليل عملي",
      image: article.coverImage,
      items: article.steps?.map(step => step.title) ?? [],
      subtitle: "دليل عملي بخطوات ومراجع",
    };
  }
  if (kind === "knowledge") {
    const topic = getKnowledgeTopic(slug);
    if (!topic?.directAnswer?.trim() || !topic.sections.length) return null;
    return {
      title: topic.title,
      category: topic.category,
      image: topic.image,
      items: topic.sections.map(section => section.heading),
      subtitle: "مفاهيم دقيقة وتطبيقات ومراجع",
    };
  }
  if (kind === "food-safety") {
    const article = getFoodSafetyArticle(slug);
    if (!article) return null;
    return {
      title: article.title,
      category: "سلامة الغذاء",
      image: article.coverImage,
      subtitle: "شرح علمي ومراجع لسلامة الغذاء",
    };
  }
  return null;
}

export async function GET(_request: Request, { params }: PageParams) {
  const { kind, slug, view } = await params;
  if (!["articles", "knowledge", "food-safety"].includes(kind) || !["cover", "map"].includes(view)) {
    return new Response("Not found", { status: 404 });
  }
  const subject = getSubject(kind as EditorialImageKind, slug);
  if (!subject) return new Response("Not found", { status: 404 });
  if (view === "map") {
    if ((subject.items?.length ?? 0) < 2 || kind === "food-safety") {
      return new Response("No meaningful map for this article", { status: 404 });
    }
    return createEditorialMapImage(subject);
  }
  return createEditorialCoverImage(subject);
}
