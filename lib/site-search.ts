import { articles, isArticleIndexable } from "./content";
import { restoredScienceGuides } from "./restored-science-guides";
import { knowledgeTopics } from "./knowledge-expansion-data";
import { foodSafetyArticles } from "./food-safety";
import { courseMeta } from "./driving-course";
import { geometryMeta, geometryPath } from "./geometry-course";
import { fivegMeta, fivegPath } from "./fiveg-course";
import { sixgMeta, sixgPath } from "./sixg-course";
import type { SearchItem } from "./guide-search";

/** Search only genuinely published pages; categories and topic routes remain unchanged. */
export function getSiteSearchItems(): SearchItem[] {
  const guides: SearchItem[] = articles.filter(isArticleIndexable).map(article => ({
    slug: `article:${article.slug}`, href: `/articles/${article.slug}`,
    title: article.title, keyword: article.keyword,
    quickAnswer: article.quickAnswer,
    description: article.metaDescription ?? article.quickAnswer?.slice(0, 180),
    category: "أدلة عملية",
  }));
  const knowledge: SearchItem[] = knowledgeTopics
    .filter(topic => Boolean(topic.directAnswer?.trim()) && topic.sections.length > 0)
    .map(topic => ({
      slug: `knowledge:${topic.slug}`, href: `/knowledge/${topic.slug}`,
      title: topic.title, keyword: `${topic.category} ${topic.description}`,
      quickAnswer: topic.directAnswer,
      description: topic.description, category: topic.category,
    }));
  const specialKnowledge: SearchItem[] = [
    { slug: "knowledge:roman-numerals", href: "/knowledge/roman-numerals", title: "الأرقام الرومانية من 1 إلى 100", keyword: "رياضيات تعليم تحويل أرقام رومانية", category: "الرياضيات" },
    { slug: "knowledge:learning-objectives", href: "/knowledge/learning-objectives", title: "كتابة أهداف تعليمية قابلة للقياس", keyword: "تعليم بلوم أهداف تعليمية تصميم الدروس", category: "التعليم" },
  ];
  const food: SearchItem[] = foodSafetyArticles.map(article => ({
    slug: `food:${article.slug}`, href: `/food-safety/${article.slug}`,
    title: article.title, keyword: `سلامة الغذاء التسمم الغذائي ${article.description}`,
    description: article.description, category: "الصحة وسلامة الغذاء",
  }));
  const restored: SearchItem[] = Object.values(restoredScienceGuides).map(guide => ({
    slug: "restored:" + guide.slug,
    href: "/articles/" + guide.slug,
    title: guide.title,
    keyword: guide.title + " " + guide.description,
    quickAnswer: guide.directAnswer,
    description: guide.description,
    category: guide.category,
  }));
  const courses: SearchItem[] = [
    { slug: "course:learn-driving", href: "/courses/learn-driving", title: courseMeta.title, keyword: "تعلم القيادة كورس سيارات تعليم", description: courseMeta.description, category: "التعليم والكورسات" },
    { slug: "course:geometry", href: geometryPath, title: geometryMeta.title, keyword: "الرياضيات المجسمات الحجوم تمارين هندسة", description: geometryMeta.description, category: "التعليم والكورسات" },
    { slug: "course:5g", href: fivegPath, title: fivegMeta.title, keyword: "تقنية اتصالات شبكات 5G", description: fivegMeta.description, category: "التعليم والكورسات" },
    { slug: "course:6g", href: sixgPath, title: sixgMeta.title, keyword: "تقنية اتصالات شبكات 6G", description: sixgMeta.description, category: "التعليم والكورسات" },
  ];
  // Special educational routes can also appear in the article catalog.
  return [...new Map([...guides, ...restored, ...knowledge, ...specialKnowledge, ...food, ...courses].map(item => [item.href, item])).values()];
}
