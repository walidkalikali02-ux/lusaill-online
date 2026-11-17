import { sixgLessons, sixgMeta, sixgPath, sixgLessonPath } from "@/lib/sixg-course";
import { qatarGradeOneMathLessons, qatarMathLessonPath } from "@/lib/qatar-grade-one-math-lessons";
import type { MetadataRoute } from "next";
import { getArticleModifiedAt } from "./content-modified";
import { restoredScienceGuides } from "./restored-science-guides";
import { articles, clusters } from "@/lib/content";
import { isArticleSearchReady, isKnowledgeSearchReady, isFoodSafetySearchReady, isSearchReadyHref } from "@/lib/editorial-indexing";
import { foodSafetyArticles } from "@/lib/food-safety";
import { knowledgeTopics } from "@/lib/knowledge-expansion-data";
import { encyclopediaCategories } from "@/lib/encyclopedia-taxonomy";
import { getEncyclopediaCategoryItems } from "@/lib/encyclopedia-catalog";
import { entities } from "@/lib/entities";
import { absoluteUrl } from "@/lib/site-config";
import { guidePaths } from "@/lib/guide-paths";
import { isGuidePathSearchReady } from "@/lib/editorial-indexing";
import { guideIllustrations } from "@/lib/guide-illustrations";
import { fivegLessons, fivegMeta, fivegPath, fivegLessonPath } from "@/lib/fiveg-course";
import { geometryLessons, geometryMeta, geometryPath, geometryLessonPath } from "@/lib/geometry-course";
import { courseMeta, drivingLessons } from "@/lib/driving-course";

import { categoryIntroductions } from "@/lib/category-introductions";

function latestPublishedUpdate(items: Array<{ slug?: string; updatedAt?: string; publishedAt?: string }> ): Date | undefined {
  const timestamps = items
    .map((item) => getArticleModifiedAt(item))
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite);

  return timestamps.length > 0 ? new Date(Math.max(...timestamps)) : undefined;
}

export function sitemapGroups(): Record<string, MetadataRoute.Sitemap> {
  // Index the subject directory and only categories with real published content.
  // Empty editorial-roadmap categories are intentionally absent from the sitemap.
  const topicRoutes: MetadataRoute.Sitemap = encyclopediaCategories
    .filter(category => getEncyclopediaCategoryItems(category).filter(item => isSearchReadyHref(item.href)).length >= 2)
    .map(category => ({
      url: absoluteUrl(`/topics/${category.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  const knowledgeRoutes: MetadataRoute.Sitemap = knowledgeTopics
    .filter(isKnowledgeSearchReady)
    .map(topic => ({
      url: absoluteUrl(`/knowledge/${topic.slug}`),
      lastModified: new Date(topic.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: topic.image ? [absoluteUrl(topic.image)] : [],
    }));
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: new Date("2026-11-14"), changeFrequency: "weekly", priority: 1.0 },
    { url: absoluteUrl("/knowledge"), lastModified: new Date("2026-11-06"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/topics"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/caricatures"), lastModified: new Date("2026-11-08"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/caricatures/gaza-flooded-tents"), lastModified: new Date("2026-11-08"), changeFrequency: "monthly", priority: 0.85, images: [absoluteUrl("/images/caricatures/gaza-flooded-tents.jpg")] },
    { url: absoluteUrl("/caricatures/ai-ram-crisis"), lastModified: new Date("2026-11-08"), changeFrequency: "monthly", priority: 0.85, images: [absoluteUrl("/images/caricatures/ai-ram-crisis.jpg")] },
    { url: absoluteUrl("/services"), lastModified: new Date("2026-11-17"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/services/website-design"), lastModified: new Date("2026-11-17"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/services/video-editing"), lastModified: new Date("2026-11-17"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/services/excel"), lastModified: new Date("2026-11-17"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/services/social-design"), lastModified: new Date("2026-11-17"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/knowledge/manahej"), lastModified: new Date("2026-11-14"), changeFrequency: "monthly", priority: 0.8 },
    // Previously discoverable only via HTML links; include canonical Qatar programme paths.
    { url: absoluteUrl("/knowledge/manahej/qatar"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/knowledge/manahej/qatar/grade-1"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/knowledge/manahej/qatar/grade-1/math"), lastModified: new Date("2026-11-17"), changeFrequency: "monthly", priority: 0.8 },
    // Separately authored routes; not included in knowledgeTopics.
    { url: absoluteUrl("/knowledge/roman-numerals"), lastModified: new Date("2026-11-06"), changeFrequency: "monthly", priority: 0.8, images: [absoluteUrl("/images/roman-numerals-education.svg")] },
    { url: absoluteUrl("/knowledge/learning-objectives"), lastModified: new Date("2026-11-06"), changeFrequency: "monthly", priority: 0.8, images: [absoluteUrl("/images/bloom-learning-levels-original.svg")] },
    { url: absoluteUrl("/articles"), lastModified: latestPublishedUpdate(articles.filter((article) => isArticleSearchReady(article))), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/categories"), lastModified: latestPublishedUpdate(articles.filter((article) => isArticleSearchReady(article))), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/entities"), lastModified: latestPublishedUpdate(articles.filter((article) => isArticleSearchReady(article))), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/about"),  changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/team"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/privacy"), lastModified: new Date("2026-11-13"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: new Date("2026-09-24"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/contact"), lastModified: new Date("2026-09-30"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/editorial-policy"), lastModified: new Date("2026-10-01"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/authors/editorial-team"), lastModified: new Date("2026-10-01"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/courses"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl(sixgPath), lastModified: new Date(sixgMeta.updatedAt), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl(fivegPath), lastModified: new Date(fivegMeta.updatedAt), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl(geometryPath), lastModified: new Date(geometryMeta.updatedAt), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/courses/learn-driving"), lastModified: new Date(courseMeta.updatedAt), changeFrequency: "monthly", priority: 0.9, images: [absoluteUrl(drivingLessons[0].image.src)] },
  ];

  const courseRoutes: MetadataRoute.Sitemap = drivingLessons.map((lesson) => ({
    url: absoluteUrl(`/courses/learn-driving/${lesson.slug}`),
    lastModified: new Date(courseMeta.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.9,
    images: [absoluteUrl(lesson.image.src)],
  }));

  const clusterRoutes: MetadataRoute.Sitemap = clusters.filter((cluster) => articles.some((article) => isArticleSearchReady(article) && article.clusterCode === cluster.code)).map((cluster) => ({
    url: absoluteUrl(`/categories/${cluster.slug}`),
    lastModified: new Date(Math.max(latestPublishedUpdate(articles.filter((article) => isArticleSearchReady(article) && article.clusterCode === cluster.code))?.getTime() ?? 0, new Date(categoryIntroductions[cluster.slug]?.updatedAt ?? 0).getTime())),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Temporarily omit category pagination from the XML sitemap during editorial triage.
  // The paginated URLs remain accessible for readers, but should not be indexable until reviewed.
  const categoryPaginationRoutes: MetadataRoute.Sitemap = [];

  const entityRoutes: MetadataRoute.Sitemap = entities
    .filter((entity) => articles.some((article) => isArticleSearchReady(article) && entity.clusterCodes.includes(article.clusterCode)))
    .map((entity) => ({
    url: absoluteUrl(`/entities/${entity.slug}`),
    lastModified: entity.updatedAt ? new Date(entity.updatedAt) : latestPublishedUpdate(articles.filter((article) => isArticleSearchReady(article) && entity.clusterCodes.includes(article.clusterCode))),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const publishedArticleRoutes: MetadataRoute.Sitemap = articles
    .filter((article) => isArticleSearchReady(article))
    .map((article) => ({
      url: absoluteUrl(`/articles/${article.slug}`),
      lastModified: getArticleModifiedAt(article) ? new Date(getArticleModifiedAt(article)!) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: [article.coverImage, guideIllustrations[article.slug]?.src].filter((src): src is string => Boolean(src)).map(absoluteUrl).filter((url) => new URL(url).hostname !== "res-academy.cache.wpscdn.com"),
    }));

  const restoredScienceRoutes: MetadataRoute.Sitemap = Object.values(restoredScienceGuides).map(guide => ({
    url: absoluteUrl("/articles/" + guide.slug),
    lastModified: new Date(guide.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const foodSafetyRoutes: MetadataRoute.Sitemap = foodSafetyArticles.filter(isFoodSafetySearchReady).map((article) => ({
    url: absoluteUrl(`/food-safety/${article.slug}`),
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    images: article.coverImage ? [article.coverImage] : [],
  }));

  const guideRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/guides"), lastModified: new Date("2026-10-02"), changeFrequency: "monthly", priority: 0.8 },
    ...guidePaths.filter(isGuidePathSearchReady).map((path) => ({ url: absoluteUrl(`/guides/${path.slug}`), lastModified: latestPublishedUpdate(articles.filter((article) => isArticleSearchReady(article) && path.articleSlugs.includes(article.slug))), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
  return {
    "sitemap-articles.xml": [...publishedArticleRoutes, ...restoredScienceRoutes, ...foodSafetyRoutes],
    "sitemap-categories.xml": [...clusterRoutes, ...categoryPaginationRoutes],
    "sitemap-guides.xml": guideRoutes,
    "sitemap-courses.xml": [...staticRoutes.filter((route) => new URL(route.url).pathname === "/courses"), ...courseRoutes, ...sixgLessons.map(lesson => ({url:absoluteUrl(sixgLessonPath(lesson.slug)),lastModified:new Date(sixgMeta.updatedAt),changeFrequency:"monthly" as const,priority:0.7})), ...fivegLessons.map(lesson => ({url:absoluteUrl(fivegLessonPath(lesson.slug)),lastModified:new Date(fivegMeta.updatedAt),changeFrequency:"monthly" as const,priority:0.7})), ...geometryLessons.flatMap(lesson => [geometryLessonPath(lesson.slug), `${geometryLessonPath(lesson.slug)}/worksheet`].map(path => ({url:absoluteUrl(path),lastModified:new Date(geometryMeta.updatedAt),changeFrequency:"monthly" as const,priority:0.7}))), ...staticRoutes.filter((route) => route.url.includes("/courses/"))],
    "sitemap-entities.xml": entityRoutes,
    "sitemap-pages.xml": [...staticRoutes.filter((route) => !new URL(route.url).pathname.startsWith("/courses")), ...knowledgeRoutes, ...topicRoutes,
      ...qatarGradeOneMathLessons.map(lesson => ({
        url: absoluteUrl(qatarMathLessonPath(lesson.slug)), lastModified: new Date("2026-11-17"),
        changeFrequency: "monthly" as const, priority: 0.7,
      }))],
  };
}

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!);
export function sitemapResponse(name?: string) {
  const groups = sitemapGroups();
  const body = name
    ? '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' + groups[name].map((item) => '<url><loc>' + escapeXml(item.url) + '</loc>' + (item.lastModified ? '<lastmod>' + new Date(item.lastModified).toISOString() + '</lastmod>' : '') + (item.images ?? []).map((src) => '<image:image><image:loc>' + escapeXml(src) + '</image:loc></image:image>').join('') + '</url>').join('') + '</urlset>'
    : '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + Object.keys(groups).map((file) => '<sitemap><loc>' + absoluteUrl('/' + file) + '</loc></sitemap>').join('') + '</sitemapindex>';
  return new Response('<?xml version="1.0" encoding="UTF-8"?>' + body, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
