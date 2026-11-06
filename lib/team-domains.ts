import { articles, clusters, type Article } from "./content";
import { foodSafetyArticles } from "./food-safety";
import { geometryMeta, geometryPath } from "./geometry-course";
import { fivegMeta, fivegPath } from "./fiveg-course";
import { sixgMeta, sixgPath } from "./sixg-course";
import { courseMeta } from "./driving-course";
import { buildTeamPersonas, type TeamDomain, type TeamPersona } from "./team-personas";

/**
 * The linked November 3 preview included a larger educational catalog that is not
 * in the current production branch. Preserve its subject personas, but never link
 * to missing course pages or claim that fictional personas wrote the articles.
 */
const previewCourseSubjects: ReadonlyArray<readonly [string, string]> = [
  ["advanced-excel", "Excel المتقدم"],
  ["agile", "العمل الرشيق Agile"],
  ["agile-data-science", "علم البيانات الرشيق"],
  ["agile-testing", "الاختبار الرشيق"],
  ["agritech", "التقنية الزراعية Agritech"],
  ["artificial-intelligence", "الذكاء الاصطناعي"],
  ["ai-engineering", "هندسة الذكاء الاصطناعي"],
  ["ai-with-python", "الذكاء الاصطناعي باستخدام Python"],
  ["aiml", "لغة AIML للمحادثة"],
  ["ajax", "AJAX وطلبات الويب"],
  ["algorithm-design", "تصميم الخوارزميات"],
  ["amazon-codewhisperer", "CodeWhisperer وAmazon Q Developer"],
  ["amazon-marketplace", "البيع عبر Amazon Marketplace"],
  ["adobe-indesign", "Adobe InDesign"],
  ["adobe-robohelp", "Adobe RoboHelp"],
  ["advanced-excel-charts", "رسوم Excel المتقدمة"],
  ["advanced-excel-functions", "دوال Excel، بفهم"],
  ["adding-subtracting-whole-numbers", "جمع وطرح الأعداد الكلية"],
  ["marketing-communications", "الإعلان والاتصال التسويقي"],
  ["adaptive-software-development", "تطوير البرمجيات التكيفي"],
  ["adding-subtracting-decimals", "جمع وطرح العشريات"],
  ["adding-subtracting-fractions", "جمع وطرح الكسور"],
  ["ab-testing", "اختبارات A/B"],
  ["accounting-basics", "أساسيات المحاسبة"],
  ["abbreviations", "فهم الاختصارات"],
];

/**
 * Course links are surfaced only where that course actually exists in production.
 * Old preview-only subjects remain as informational profiles with no broken links.
 */
export function getTeamDomains(): TeamDomain[] {
  const published = articles.filter(article => article.status === "published");
  const guides: TeamDomain[] = clusters
    .filter(cluster => published.some(article => article.clusterCode === cluster.code))
    .map(cluster => ({ id: `guide:${cluster.slug}`, title: cluster.name, href: `/categories/${cluster.slug}`, kind: "guide", available: true }));
  const foodSafety: TeamDomain = { id: "guide:food-safety", title: "سلامة الغذاء والوقاية من التسمم", href: "/food-safety", kind: "guide", available: true };
  const courses: TeamDomain[] = [
    { id: "course:learn-driving", title: courseMeta.title, href: "/courses/learn-driving", kind: "course", available: true },
    ...[
      { meta: geometryMeta, path: geometryPath },
      { meta: fivegMeta, path: fivegPath },
      { meta: sixgMeta, path: sixgPath },
    ].map(course => ({ id: `course:${course.path}`, title: course.meta.title, href: course.path, kind: "course" as const, available: true })),
    ...previewCourseSubjects.map(([slug, title]) => ({ id: `course:${slug}`, title, href: `/courses/${slug}`, kind: "course" as const, available: false })),
  ];
  return [...guides, foodSafety, ...courses];
}

export function getTeamPersonas(): TeamPersona[] {
  return buildTeamPersonas(getTeamDomains());
}

export type TeamArticleLink = { title: string; href: string; slug: string };
const publishedArticles = () => articles.filter(article => article.status === "published");
function toLink(article: Article): TeamArticleLink {
  return { title: article.title, href: `/articles/${article.slug}`, slug: article.slug };
}

/** Select only a small set of explicitly related course subjects; otherwise no guess. */
const subjectTerms: Record<string, RegExp> = {
  "advanced-excel": /(?:Excel|إكسل|اكسل|WPS|جدول البيانات)/iu,
  "advanced-excel-charts": /(?:مخططات Excel|رسوم Excel|الرسم البياني في Excel)/iu,
  "advanced-excel-functions": /(?:دوال Excel|معادلات Excel)/iu,
  "accounting-basics": /(?:المحاسبة|محاسبي|ضريبية|الضريبي|الفاتورة الضريبية)/iu,
  "marketing-communications": /(?:تسويق|الإعلان|اعلان مضلل|إعلان مضلل)/iu,
  "amazon-marketplace": /(?:أمازون|Amazon Marketplace)/iu,
  "artificial-intelligence": /(?:الذكاء الاصطناعي|ChatGPT)/iu,
  "ai-engineering": /(?:هندسة الذكاء الاصطناعي)/iu,
  "ai-with-python": /(?:Python|بايثون)/iu,
  "abbreviations": /(?:الاختصارات|اختصار)/iu,
  "learn-driving": /(?:تعلم القيادة|قيادة السيارة للمبتدئين)/iu,
};

export function getTeamArticles(persona: Pick<TeamPersona, "id" | "kind">): TeamArticleLink[] {
  if (persona.id === "guide:food-safety") {
    return foodSafetyArticles.map(article => ({
      title: article.title, slug: article.slug, href: `/food-safety/${article.slug}`,
    }));
  }
  if (persona.kind === "guide") {
    const cluster = clusters.find(cluster => persona.id === `guide:${cluster.slug}`);
    return cluster
      ? publishedArticles().filter(article => article.clusterCode === cluster.code).map(toLink)
      : [];
  }
  const term = subjectTerms[persona.id.replace(/^course:/, "")];
  return term
    ? publishedArticles().filter(article => term.test(`${article.title} ${article.keyword}`)).map(toLink)
    : [];
}

/** A subject-directory link is categorization, not evidence of individual authorship. */
export function getTeamPersonaForArticle(article: Pick<Article, "clusterCode">): TeamPersona | undefined {
  const cluster = clusters.find(item => item.code === article.clusterCode);
  return cluster ? getTeamPersonas().find(persona => persona.id === `guide:${cluster.slug}`) : undefined;
}

export function getFoodSafetyPersona(): TeamPersona | undefined {
  return getTeamPersonas().find(persona => persona.id === "guide:food-safety");
}
