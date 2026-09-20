import { articleSeeds, type ArticleSeed } from "./articles-data";
import { clusters, getCluster } from "./clusters";
import { publishedContent } from "./article-content";

export type ArticleStatus = "not_started" | "drafting" | "needs_verification" | "published";

export type FactRow = { label: string; value: string };
export type Step = { title: string; detail: string; screenshotAlt?: string };
export type FaqItem = { question: string; answer: string };
export type SourceRef = { label: string; url: string; checkedAt: string };

export type Article = ArticleSeed & {
  slug: string;
  metaDescription?: string;
  status: ArticleStatus;
  publishedAt?: string;
  updatedAt?: string;
  coverImage?: string;
  coverImageAlt?: string;
  quickAnswer?: string;
  summaryTable?: FactRow[];
  steps?: Step[];
  commonMistakes?: string[];
  sources?: SourceRef[];
  faqs?: FaqItem[];
};

function slugify(text: string): string {
  return text
    .trim()
    .replace(/[ً-ْ]/g, "")
    .replace(/[؟!،.«»"'’‘:؛()/]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const usedSlugs = new Set<string>();

export const articles: Article[] = articleSeeds.map((seed) => {
  let slug = slugify(seed.keyword) || slugify(seed.title) || `article-${seed.id}`;
  if (usedSlugs.has(slug)) slug = `${slug}-${seed.id}`;
  usedSlugs.add(slug);
  const override = publishedContent.get(seed.id);
  return { ...seed, slug, status: "not_started", ...override };
});

export const coreHundred = articles.filter((article) => article.id <= 100);
export const bonusArticles = articles.filter((article) => article.id > 100);

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getArticleBySlug(slug: string) {
  const decoded = safeDecode(slug);
  return articles.find((article) => article.slug === decoded || article.slug === slug);
}

export function getClusterArticles(clusterSlug: string) {
  const cluster = getCluster(clusterSlug);
  if (!cluster) return [];
  return articles.filter((article) => article.clusterCode === cluster.code);
}

export function getRelatedArticles(article: Article, count = 4) {
  return articles
    .filter((candidate) => candidate.status === "published" && candidate.clusterCode === article.clusterCode && candidate.id !== article.id)
    .sort((a, b) => Math.abs(a.id - article.id) - Math.abs(b.id - article.id))
    .slice(0, count);
}

export function clusterProgress(clusterSlug: string) {
  const items = getClusterArticles(clusterSlug);
  const published = items.filter((item) => item.status === "published").length;
  return { total: items.length, published };
}

export function overallProgress() {
  const published = articles.filter((article) => article.status === "published").length;
  return { total: articles.length, published, coreTotal: coreHundred.length, corePublished: coreHundred.filter((a) => a.status === "published").length };
}

export const trafficProjection = [
  { month: 1, publishedTarget: 15, expectedVisits: 500 },
  { month: 2, publishedTarget: 35, expectedVisits: 4000 },
  { month: 3, publishedTarget: 55, expectedVisits: 15000 },
  { month: 4, publishedTarget: 75, expectedVisits: 35000 },
  { month: 5, publishedTarget: 90, expectedVisits: 65000 },
  { month: 6, publishedTarget: 100, expectedVisits: 100000 },
];

export const methodologyNotes = [
  {
    title: "نبدأ من سؤال حقيقي",
    body: "لا ننشر صفحة لمجرد استهداف عبارة بحث. يجب أن تحل مشكلة محددة، وأن تضيف ترتيبًا أو تفسيرًا عمليًا يمكن للقارئ تنفيذه.",
  },
  {
    title: "الدقة هنا ليست اختيارية",
    body: "رسوم، مواعيد، أرقام هواتف، روابط بوابات. معلومة خاطئة واحدة تقتل ثقة القارئ. كل مقال يحتاج مصدرًا رسميًا وتاريخ مراجعة ظاهرًا.",
  },
  {
    title: "المعلومة المتغيرة مؤرخة",
    body: "الخدمات والبوابات والأرقام قد تتغير. لذلك نضع تاريخ التحقق بجوار المصدر، ونراجع الدليل عند تغير الخدمة أو ظهور مرجع رسمي أحدث.",
  },
  {
    title: "الوضوح لا يلغي الحدود",
    body: "نفرق بين ما تؤكده الجهة الرسمية وما نستنتجه لتنظيم الخطوات، ونوضح متى يحتاج القارئ إلى التواصل مع الجهة أو مختص.",
  },
];

export const winningArticleTemplate = [
  { step: "إجابة فورية في أول ٤٠ كلمة", detail: "الرسم، الرابط، الرقم. القارئ جاء لشيء محدد." },
  { step: "جدول ملخص", detail: "الرسوم، المدة، الأوراق المطلوبة، جهة التنفيذ." },
  { step: "خطوات مرتبة بقدر الحاجة", detail: "لا نثبت عددًا مصطنعًا؛ نستخدم ما يتطلبه الإجراء مع صورة توضيحية مناسبة." },
  { step: "قسم الأخطاء الشائعة", detail: "«الموقع لا يفتح»، «الرقم القومي مرفوض» — استعلامات مستقلة بحد ذاتها." },
  { step: "صندوق المصدر والتاريخ", detail: "الجهة الرسمية + تاريخ آخر تحقق." },
  { step: "روابط داخلية سياقية", detail: "تظهر فقط عندما يوجد دليل منشور ذو صلة حقيقية." },
  { step: "FAQPage schema", detail: "للأسئلة الظاهرة فعلاً في الصفحة فقط." },
];

export { clusters, getCluster };
