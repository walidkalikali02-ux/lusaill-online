import { articles } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { courseMeta, drivingLessons } from "@/lib/driving-course";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character] ?? character);
}

export function GET() {
  const published = articles.filter((article) => article.status === "published");
  const articleItems = published.map((article) => {
    const url = absoluteUrl(`/articles/${article.slug}`);
    const date = new Date(article.updatedAt ?? article.publishedAt ?? "2026-01-01").toUTCString();
    return `<item><title>${escapeXml(article.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${date}</pubDate><description>${escapeXml(article.metaDescription ?? article.quickAnswer ?? article.keyword)}</description></item>`;
  }).join("");
  const courseItems = drivingLessons.map((lesson) => {
    const url = absoluteUrl(`/courses/learn-driving/${lesson.slug}`);
    const date = new Date(courseMeta.updatedAt).toUTCString();
    return `<item><title>${escapeXml(lesson.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${date}</pubDate><description>${escapeXml(lesson.metaDescription)}</description></item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(siteConfig.name)}</title><link>${siteConfig.url}</link><description>${escapeXml(siteConfig.description)}</description><language>ar</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${courseItems}${articleItems}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" } });
}
