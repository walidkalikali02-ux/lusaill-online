import type { Article } from "./content";
import type { KnowledgeTopic } from "./knowledge-expansion-data";
import type { FoodSafetyArticle } from "./food-safety";
import { getEncyclopedicContent } from "./encyclopedic-content";

/**
 * Temporary, conservative editorial index gate for the cleanup phase.
 * Word counts are *internal triage signals*, not Google ranking factors.
 * A passing result does not certify that sources, claims or links were externally checked.
 */
const DRAFT_PHRASES = ["إضافات ذات قيمة", "صور مقترحة", "روابط داخلية تخطيطية", "بيانات تجريبية مختلقة"];
const words = (text: string): number => text.trim().split(/\s+/u).filter(Boolean).length;
const sources = (urls: Array<string | undefined>): number =>
  new Set(urls.filter((url): url is string => Boolean(url && /^https:\/\/[^\s]+/i.test(url)))).size;
const hasDraftMaterial = (text: string): boolean => DRAFT_PHRASES.some((phrase) => text.includes(phrase));

export function isArticleSearchReady(article: Article): boolean {
  const deep = getEncyclopedicContent(article.slug);
  const text = [
    article.quickAnswer,
    ...(article.summaryTable ?? []).flatMap((row) => [row.label, row.value]),
    ...(article.steps ?? []).flatMap((step) => [step.title, step.detail]),
    ...(article.practicalSections ?? []).flatMap((section) => [section.title, section.intro, ...section.columns, ...section.rows.flat()]),
    ...(article.commonMistakes ?? []),
    ...(article.faqs ?? []).flatMap((faq) => [faq.question, faq.answer]),
    ...(deep?.sections ?? []).flatMap((section) => [section.title, ...section.paragraphs, ...(section.bullets ?? [])]),
  ].filter(Boolean).join(" ");
  const citationCount = sources([
    ...(article.sources ?? []).map((item) => item.url),
    ...(deep?.sources ?? []).map((item) => item.url),
    ...(deep?.sections ?? []).flatMap((section) => section.sourceUrls ?? []),
  ]);
  const hasStructure = (deep?.sections.length ?? 0) >= 3 ||
    ((article.steps?.length ?? 0) >= 3 && (article.practicalSections?.length ?? 0) >= 2);
  return words(text) >= 900 && citationCount >= 2 && hasStructure && !hasDraftMaterial(text);
}

export function isMedicalKnowledgeTopic(topic: KnowledgeTopic): boolean {
  return /(الصحة|صحي|الطب|الطبي|التغذية|الغذاء|الأغذية|التسمم|المناعة|الأمراض|المرض|الإسعاف|الدواء|الأدوية)/u.test(topic.category);
}

export function isKnowledgeSearchReady(topic: KnowledgeTopic): boolean {
  if (isMedicalKnowledgeTopic(topic)) return false; // Await documented human specialist review.
  const text = [
    topic.intro, topic.directAnswer,
    ...topic.sections.flatMap((section) => [
      section.heading, ...(section.paragraphs ?? []), ...(section.points ?? []),
      ...(section.table?.headers ?? []), ...(section.table?.rows.flat() ?? []), section.note,
    ]),
    ...topic.faq.flatMap((faq) => [faq.question, faq.answer]),
  ].filter(Boolean).join(" ");
  return words(text) >= 900 && topic.sections.length >= 3 &&
    sources(topic.sources.map((item) => item.url)) >= 2 && !hasDraftMaterial(text);
}

// No medical author/reviewer has been independently authenticated in the project.
// Add a documented reviewer record and re-audit before making a medical article indexable.
const clinicallyReviewedSlugs = new Set<string>();
export function isFoodSafetySearchReady(article: FoodSafetyArticle): boolean {
  return clinicallyReviewedSlugs.has(article.slug);
}
