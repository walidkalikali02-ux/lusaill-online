import { getEncyclopediaSearchItems } from "./site-search";
import { normalizeSearch, type SearchItem } from "./guide-search";
import { encyclopediaCategories, type EncyclopediaCategory } from "./encyclopedia-taxonomy";

type CategoryRule = {
  entryIds?: string[];
  match?: RegExp;
  prefixes?: string[];
};

/**
 * Explicit, conservative subject routing. A topic is listed only if a page is
 * actually published. Blank categories remain browsable but unindexable.
 */
const rules: Record<string, CategoryRule> = {
  science: { entryIds: ["knowledge:crystals-vs-precipitates","knowledge:roman-numerals"], match: /كيمياء|فيزياء|رياضيات|البلورات|الرواسب|العلوم الطبيعية|علمي|التجارب العلمية|المجسمات/u },
  education: { match: /التعليم|التعلّم|تعلم|التركيز|التخصص الجامعي|الأهداف التعليمية|الانضباط المدرسي|المجسّمات|الأرقام الرومانية|الكتابة|الدراسة|بلوم/u },
  technology: { match: /تقني|الشبكات|الاتصالات|البرمجة|الإنترنت|الذكاء الاصطناعي|الكمبيوتر|التطبيقات|الملفات|Excel|WPS|الهواتف/u },
  health: { prefixes: ["food:"], match: /الصحة|التسمم الغذائي|جهاز المناعة|المناعة|سلامة الغذاء|الأعراض|الغذاء/u },
  nutrition: { prefixes: ["food:"], match: /التغذية|الفيتامينات|الطعام|سلامة الغذاء|التسمم الغذائي|جهاز المناعة/u },
  cooking: { match: /وصفة|طبخ|مطبخ|تحضير الطعام|المخبوزات/u },
  business: { match: /الضريب|المحاسبة|الفاتورة|تجار|الشراء|المستهلك|إعلان مضلل|التسويق|الأعمال/u },
  history: { match: /التاريخ|الحضارات|الآثار|تاريخي/u },
  geography: { match: /الجغرافيا|العواصم|دول العالم|البلدان|المدن|التخصصات البيئية/u },
  earth: { entryIds: ["knowledge:environmental-majors"], match: /البيئة|البلورات|التلوث|الطبيعة|الزراعة|الجيولوجيا/u },
  animals: { match: /الحيوانات|الطيور|النباتات|الكائنات الحية/u },
  astronomy: { match: /الفضاء|الفلك|الكواكب|النجوم|المجرات/u },
  literature: { entryIds: ["knowledge:writing-topic-steps"], match: /الأدب|الكتابة|التعبير|الشعر|اللغة العربية/u },
  languages: { match: /اللغة|الترجمة|الاختصارات|المفردات|النحو/u },
  religion: { match: /القرآن|الحديث|الإسلام|الصلاة|الزكاة|الصيام/u },
  family: { entryIds: ["knowledge:positive-school-discipline"], match: /التربية|الأسرة|الطفل|الانضباط المدرسي|العلاقات الأسرية/u },
  society: { match: /المجتمع|المستهلك|الحقوق|الأسرة|المسؤولية/u },
  psychology: { entryIds: ["knowledge:improve-focus","knowledge:positive-school-discipline"], match: /التركيز|علم النفس|السلوك|تطوير الذات|مهارات الحياة/u },
  beauty: { match: /البشرة|الشعر|الجمال|العناية الذاتية/u },
  fitness: { match: /اللياقة|كرة القدم|الرياضة|التمارين/u },
  travel: { match: /جواز السفر|جواز سفر|السفر|تأشيرة|المطارات|السياحة|وثيقة سفر/u },
  law: { match: /قانون|الحقوق|عقد|الإيجار|الشكاوى|استبدال|الاسترجاع|حماية المستهلك/u },
  government: { match: /خدمات حكومية|بطاقة الرقم القومي|جواز السفر|الوثائق|التأمينات/u },
  home: { match: /المنزل|فاتورة الكهرباء|عداد الكهرباء|المرافق|السكن/u },
  vehicles: { match: /القيادة|المرور|المركبات|السيارات/u },
  arts: { match: /الفنون|التصميم|الرسم|التصوير|المسرح/u },
  stories: { match: /قصص|حكايات|رواية|السرد/u },
  quotes: { match: /الحكم|الأقوال|الأمثال|عبارات/u },
  entertainment: { match: /ألغاز|ألعاب|تسلية|اختبار ثقافي/u },
  parenting: { entryIds: ["knowledge:positive-school-discipline"], match: /الطفل|الحمل|الولادة|الانضباط المدرسي|تربية الأطفال/u },
  engineering: { match: /الهندسة|المجسمات|الشبكات|الاتصالات|الروبوتات|الصناعة/u },
  questions: { match: /^كيف |^لماذا |^ما هي |^ما هو |ما الفرق|كيفية /u },
};

export type CategoryContentItem = SearchItem & { href: string };

let publishedCache: CategoryContentItem[] | undefined;
const categoryCache = new Map<string, CategoryContentItem[]>();
const allPublished = () => publishedCache ??= getEncyclopediaSearchItems().filter((entry): entry is CategoryContentItem => Boolean(entry.href));

export function getEncyclopediaCategoryItems(category: EncyclopediaCategory): CategoryContentItem[] {
  const cached = categoryCache.get(category.slug);
  if (cached) return cached;
  const rule = rules[category.slug];
  if (!rule) return [];
  const matches = allPublished().filter(item => {
    if (rule.entryIds?.includes(item.slug)) return true;
    if (rule.prefixes?.some(prefix => item.slug.startsWith(prefix))) return true;
    return rule.match?.test(`${item.title} ${item.category ?? ""}`) ?? false;
  });
  categoryCache.set(category.slug, matches);
  return matches;
}

function simplify(value: string): string {
  return normalizeSearch(value).replace(/ال(?=\p{L})/gu, "").replace(/[ةه]$/u, "").trim();
}

/** A subtopic only lists relevant, already-published entries. */
export function getEncyclopediaSubtopicItems(category: EncyclopediaCategory, subtopic: string): CategoryContentItem[] {
  if (!category.subtopics.includes(subtopic)) return [];
  const words = simplify(subtopic).split(/\s+/u)
    .filter(word => word.length >= 4 && !["معلومات", "اساسيات", "منوعات", "العامة"].includes(word))
    .slice(0, 5);
  if (!words.length) return [];
  return getEncyclopediaCategoryItems(category).filter(item => {
    const text = simplify(`${item.title} ${item.keyword} ${item.category ?? ""}`);
    return words.some(word => text.includes(word));
  });
}

export function getEncyclopediaCategoryCounts(): Record<string, number> {
  return Object.fromEntries(encyclopediaCategories.map(category => [category.slug, getEncyclopediaCategoryItems(category).length]));
}

export function getCategoryUrl(category: EncyclopediaCategory, subtopic?: string): string {
  return subtopic ? `/topics/${category.slug}?section=${encodeURIComponent(subtopic)}` : `/topics/${category.slug}`;
}
