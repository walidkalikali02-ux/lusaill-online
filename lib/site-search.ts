import { restoredScienceGuides } from "./restored-science-guides";
import { knowledgeTopics } from "./knowledge-expansion-data";
import { foodSafetyArticles } from "./food-safety";
import type { SearchItem } from "./guide-search";

/** Search only genuinely published pages; categories and topic routes remain unchanged. */
export function getEncyclopediaSearchItems(): SearchItem[] {
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
  return [...knowledge, ...specialKnowledge, ...food, ...restored];
}
