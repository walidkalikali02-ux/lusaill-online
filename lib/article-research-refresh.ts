import type { Article } from "./content";
import type { PracticalSection } from "./article-audit-updates";

// Targeted changes from the 1 November research pass. Unchanged articles keep
// their original review dates; checking a link is not a factual review.
const checkedAt = "2026-11-01";
const updatedAt = "2026-11-01T10:30:00+03:00";
const taxRegime = "https://www.eta.gov.eg/ar/news/qrar-wzyr-almalyt-rqm-420-lsnt-2025";
const taxGuide = "https://www.eta.gov.eg/sites/default/files/2025-08/guide.of_.the_.egyptian.tax_.authority.services.second_edition.pdf";
const criminal = "https://www.moi.gov.eg/PublicSecurity/Home/Department1";
const damaged = "https://traffic.moi.gov.eg/Arabic/Pages/terms-drivinglicense-replacement-of-damaged.aspx";
const pension = "https://www.nosi.gov.eg/ar/Services/Pages/Info/PurchaseDurationEmp.aspx";
const returns = "https://cpa.gov.eg/ar-EG/%D8%A7%D8%B3%D8%A6%D9%84%D8%A9-%D9%85%D8%AA%D9%83%D8%B1%D8%B1%D8%A9";
const forms = "https://support.google.com/docs/answer/139706?hl=en";
const captions = "https://support.google.com/docs/answer/9109474?hl=en";
const firstId = "https://www.khadamatmisr.gov.eg/node/63";
const changedId = "https://www.khadamatmisr.gov.eg/node/65";
const passport = "https://www.khadamatmisr.gov.eg/node/54";
const passportReplacement = "https://www.khadamatmisr.gov.eg/node/53";

type Refresh = { reason: string; source: string; sourceLabel: string; section?: PracticalSection; apply?: (article: Article) => Article };
const section = (title: string, rows: string[][], sourceUrl: string, intro?: string): PracticalSection => ({ title, intro, columns: ["الحالة", "ما تحتاج معرفته"], rows, sourceUrl });

export const articleResearchRefreshes: Record<string, Refresh> = {
  "simplified-tax-registration-egypt": {
    reason: "تمييز رقم التسجيل المبسط عن الانضمام للنظام الضريبي للمشروعات الصغيرة.", source: taxRegime, sourceLabel: "مصلحة الضرائب: قرار 420 لسنة 2025 والنظام المبسط للمشروعات",
    section: section("التسجيل المبسط ليس النظام الضريبي المبسط للمشروعات", [
      ["رقم تسجيل لغرض محدد", "المسار المشروح هنا لغير الممولين، وفق أسباب التسجيل المحددة في دليل الخدمات."],
      ["الانضمام لنظام قانون 6 لسنة 2025", "إجراء مختلف للمشروعات التي لا يتجاوز حجم أعمالها السنوي 20 مليون جنيه؛ طلب الاستفادة على نموذج 1/10 طلبات، وفق إعلان المصلحة عن قرار 420 لسنة 2025."],
      ["قبل اختيار النموذج", "حدّد مع المأمورية هل تريد إنشاء رقم تسجيل أم طلب الانضمام للنظام؛ تشابه الاسمين لا يجعل النموذجين قابلين للتبادل."],
    ], taxRegime),
  },
  "vat-registration-status-certificate": {
    reason: "إضافة حد صلاحية نموذج 12 الذي يغيب عن الملخص الحالي.", source: taxGuide, sourceLabel: "مصلحة الضرائب: دليل الخدمات، الإصدار الثاني — صلاحية نموذج 12",
    section: section("متى تنتهي صلاحية نموذج تحديد الموقف؟", [
      ["المدة المنشورة", "يذكر الإصدار الثاني لدليل الخدمات أن النموذج يسري عامًا أو حتى تغيير النشاط أو زيادة رقم الأعمال بما يوجب التسجيل، أيهما أقرب."],
      ["حدث تغيير قبل انتهاء العام", "راجع المأمورية لإعادة تحديد الموقف؛ لا تستخدم تاريخ انتهاء العام وحده لإثبات استمرار عدم المطالبة بالتسجيل."],
    ], taxGuide),
  },
  "criminal-record-online-egypt": {
    reason: "تحديد أهلية الطلب الإلكتروني والتمييز بين الإصدار وتسليم البريد.", source: criminal, sourceLabel: "وزارة الداخلية: شروط صحيفة الحالة الجنائية عبر الإنترنت",
    section: section("شروط تراجعها قبل دفع طلب الفيش أونلاين", [
      ["صاحب الطلب والاستلام", "الطلب للشخص نفسه، والتسليم له شخصيًا من واقع بطاقة الرقم القومي."],
      ["البصمات والإصدار السابق", "تذكر الصفحة تسجيل البصمات بالأحوال المدنية منذ شهر على الأقل، وسبق استخراج صحيفة مميكنة بعد 1 يناير 2019."],
      ["الأهلية", "تشترط الصفحة ألا يكون طالب الخدمة مطلوبًا لتنفيذ حكم جنائي أو للتجنيد؛ اتبع تحقق البوابة لحالتك."],
      ["مهلة 72 ساعة", "تخص إنهاء الإصدار من قبول الطلب وتسليم الصحيفة لمندوب البريد وفق الشروط؛ ليست ضمان وصول إلى المنزل خلال المدة نفسها."],
    ], criminal, "هذه شروط الصفحة الرسمية عند مراجعتها، وليست تأكيدًا لقبول حساب بعينه. لا نعتمد جدول الرسوم القديم في الصفحة بدل السعر الظاهر في الطلب."),
  },
  "driving-license-damaged-replacement": {
    reason: "إظهار شروط السريان ومستندات البدل بدل تركها لقائمة عامة.", source: damaged, sourceLabel: "بوابة المرور: بدل تالف رخصة القيادة — نص مفهرس؛ الوصول المباشر مرفوض",
    section: section("هل رخصتك مؤهلة لمسار بدل التالف؟", [
      ["حالة الرخصة", "تشترط بوابة المرور أن تكون سارية، وأن تكون رخصة وليست تصريحًا."],
      ["المستندات المنشورة", "صورة بطاقة رقم قومي سارية مع الاطلاع على الأصل، والرخصة التالفة، وشهادة براءة الذمة/المخالفات."],
      ["الرخصة منتهية أو مجرد تصريح", "أكد مع المرور المسار المناسب قبل دفع طلب البدل؛ لا يعالج البدل انتهاء الصلاحية تلقائيًا."],
    ], damaged, "راجعت هذه الشروط من النص المفهرس للبوابة؛ طلب الفتح المباشر أعاد رسالة رفض وصول. أكد القائمة الحالية لدى المرور قبل التنفيذ."),
  },
  "national-id-first-time-egypt": {
    reason: "إضافة مستند طالب وضامن من قائمة حكومية بديلة واضحة.", source: firstId, sourceLabel: "مركز خدمات مصر: مستندات إصدار بطاقة الرقم القومي أول مرة",
    section: section("إذا اخترت التقديم عبر مركز خدمات مصر", [
      ["الطالب", "تسرد صفحة الخدمة شهادة ميلاد مختومة من جهة الدراسة."],
      ["الضامن", "تسرد ضامنًا من الأقارب حتى الدرجة الثالثة؛ أكد مستندات إثبات الصلة مع المركز."],
      ["قبل الزيارة", "راجع المركز المدرج وإتاحة الخدمة لحالتك؛ القائمة المنشورة لا تحدد هنا رسمًا أو مدة أو جميع إثباتات كل فئة."],
    ], firstId),
  },
  "consumer-return-exchange-egypt": {
    reason: "توضيح استثناءات عملية ومدة استجابة المورد عند ثبوت العيب.", source: returns, sourceLabel: "حماية المستهلك: الاستثناءات ورد قيمة السلعة المعيبة",
    section: section("استثناءات الرجوع دون سبب وموعد رد المعيب", [
      ["أمثلة لاستثناءات 14 يومًا", "سلعة مطابقة لمواصفات خاصة طلبتها، والكتب والصحف والمجلات والبرامج، والحلي والمجوهرات، والملابس الداخلية وفساتين الزفاف بعد إزالة الأغلفة؛ راجع القائمة الكاملة لدى الجهاز."],
      ["وجود عيب خلال 30 يومًا", "يفصل الجهاز هذا الحق عن تغيير الرأي: يذكر استبدال المعيب أو رد قيمته دون تكلفة إضافية خلال أسبوع من اللجوء للمورد، وبطريقة الدفع نفسها."],
      ["خلاف على العيب", "ارفق الفاتورة وتاريخ إخطار المورد عند الشكوى؛ الجهاز يفحص النزاع، ولا يقرر المقال وجود العيب في سلعة بعينها."],
    ], returns),
  },
  "product-warranty-repair-egypt": {
    reason: "إضافة معيار تكرار الأعطال وإثبات مرات الإصلاح.", source: returns, sourceLabel: "حماية المستهلك: تكرار الأعطال وإيصالات الصيانة",
    section: section("احتفظ بإيصال لكل إصلاح متكرر", [
      ["تكرار الأعطال", "تذكر الأسئلة الرسمية استبدال المنتج وفق المواصفة المشار إليها عند تكرار الأعطال أكثر من مرتين متتاليتين خلال السنة الأولى أو مدة الضمان، أيهما أقل."],
      ["الإثبات", "احتفظ بإيصالات الصيانة أو إثباتها في شهادة الضمان؛ اعرض الحالة على الجهاز عند الخلاف بدل اعتبار كل زيارة تحقق الشرط تلقائيًا."],
    ], returns),
  },
  "insurance-purchase-duration": {
    reason: "مطابقة نص الخدمة الحالي وإزالة المنع المطلق للعدول الذي لا تؤكده الصفحة الحالية.", source: pension, sourceLabel: "التأمينات: النص الحالي لشراء المدة وإجراءات قانون 148 لسنة 2019",
    apply: article => ({ ...article,
      quickAnswer: "شراء مدة تأمينية يستلزم طلبًا أثناء سريان التأمين وسنوات كاملة تالية لسن بدء الخضوع وسابقة على آخر اشتراك وغير مؤمّن عليها أصلًا. اطلب حساب التكلفة والسداد من الهيئة قبل التوقيع، ولا تعتمد تكلفة حالة أخرى.",
      steps: article.steps?.map((step, index) => index === 0 ? { ...step, detail: "طابق سنوات المدة مع سجلك وشروطها المنشورة قبل تقديم الطلب؛ لا تشتر مدة مؤمّنًا عليها بالفعل." } : index === 2 ? { ...step, detail: "تذكر الهيئة الدفع خلال سنة من الطلب دون تجاوز نهاية الخدمة، أو التقسيط وفق الجداول والحالة المنطبقة وبموافقة صاحب العمل. اطلب الحساب والمواعيد كتابةً." } : index === 3 ? { ...step, title: "افهم الإقرار قبل التوقيع", detail: "تذكر الصفحة توقيع إقرار العلم بالتكلفة. لا نستنتج منها منعًا مطلقًا للعدول؛ أكد مع الهيئة إمكان التعديل وآثاره قبل التوقيع." } : step),
      commonMistakes: article.commonMistakes?.map(item => item.includes("العدول") ? "التوقيع قبل فهم التكلفة والالتزامات وإمكان تعديل الطلب." : item),
      faqs: article.faqs?.map(faq => faq.question.includes("إلغاء") ? { ...faq, answer: "الصفحة الحالية لا تحسم قاعدة عامة للإلغاء. اطلب من الهيئة بيان إمكان التعديل أو العدول وآثاره قبل توقيع طلبك." } : faq),
    }),
  },
  "forms-manage-responses": {
    reason: "تصحيح مكان إغلاق النموذج وإضافة حدود الردود الحالية.", source: forms, sourceLabel: "Google Forms: إدارة الردود وحدود سبتمبر 2026",
    section: section("إغلاق النموذج وحدود الردود", [
      ["إغلاق نموذج منشور", "من Published أعلى اليمين أوقف Accepting responses، أو اختر Set close date or response limit، ثم احفظ رسالة الإغلاق."],
      ["حدود الخدمة", "تعلن Google بدء حدود 1 GB من بيانات الردود و500 ألف رد للنموذج من سبتمبر 2026، مع ترتيبات انتقالية لبعض نماذج المؤسسات حتى مارس 2027. راجع حالة النموذج في التنبيه الرسمي."],
    ], forms),
    apply: article => ({ ...article, quickAnswer: "من Settings > Responses اختر طريقة جمع البريد: Verified أو Responder input، واضبط نسخة الرد. لإغلاق نموذج منشور افتح Published وأوقف Accepting responses أو حدد تاريخًا أو عدد ردود، ثم احفظ. راجع حدود التخزين والردود قبل استقبال تسجيلات كثيرة." }),
  },
  "forms-responses-sheets": {
    reason: "إضافة حد المزامنة عند كثرة الردود بدل تكرار الربط فقط.", source: forms, sourceLabel: "Google Forms: حدود عرض الردود ومزامنة Sheets",
    section: section("الردود موجودة لكن المزامنة توقفت؟", [
      ["أكثر من 100 ألف رد", "تذكر Google أن هذا قد يفسر توقف المزامنة مع Sheets؛ راجع الردود داخل Forms ونزّل CSV بدل افتراض ضياعها."],
      ["حذف ردود للتنظيف", "حذف الردود لا يحذف الملفات المرفقة؛ راجع سياسة الاحتفاظ وصلاحيات Drive بصورة مستقلة."],
    ], forms),
  },
  "slides-captions": {
    reason: "تمييز تحويل الكلام لنص عن الترجمة بين اللغات.", source: captions, sourceLabel: "Google Slides: التسميات التوضيحية أثناء العرض",
    apply: article => ({ ...article,
      title: "تشغيل التسميات التوضيحية في Google Slides",
      keyword: "التسميات التوضيحية في Google Slides",
      coverImageAlt: "رسم إرشادي أصلي لتشغيل التسميات التوضيحية أثناء عرض Google Slides",
      metaDescription: "عرض كلام المتحدث كنص في Google Slides: تشغيل Captions والميكروفون ومشاركة الشاشة وحدود الدقة والحفظ، دون وعد بالترجمة بين اللغات.",
      quickAnswer: "لإظهار كلامك كنص أثناء عرض Google Slides، افتح Captions preferences ثم Toggle captions واسمح بالميكروفون. تعمل الميزة عبر المتصفحات المدعومة واتصال الإنترنت، ولا تحفظ النص داخل العرض. التسميات التوضيحية ليست وعدًا بترجمة الكلام إلى لغة أخرى؛ اختبر لغة حديثك قبل العرض.",
    }),
  },
};

for (const slug of ["tax-card-first-time-egypt", "tax-registration-data-update", "tax-card-lost-damaged-replacement", "tax-basic-data-certificate", "tax-registration-reactivation", "tax-registration-cancel-suspend"]) {
  articleResearchRefreshes[slug] = { reason: "مقارنة تعليمات التسجيل بالإصدار الثاني من دليل مصلحة الضرائب، الصفحات 11–31، وإضافة المرجع الأحدث.", source: taxGuide, sourceLabel: "مصلحة الضرائب: دليل الخدمات — الإصدار الثاني، خدمات التسجيل" };
}

// Scoped government service lists supplement the original routes without
// presenting a single center's abbreviated list as exhaustive nationwide.
for (const slug of ["national-id-address-change", "national-id-profession-change", "national-id-marital-status-change"]) {
  articleResearchRefreshes[slug] = { reason: "إضافة البطاقة القديمة وإثبات التغيير وقناة مركز الخدمات.", source: changedId, sourceLabel: "مركز خدمات مصر: تغيير بيانات بطاقة الرقم القومي", section: section("التقديم عبر مركز خدمات مصر", [
    ["الملف المنشور", "تطلب صفحة المركز بطاقة الرقم القومي القديمة وما يفيد تغيير البيانات؛ أكد إثبات حالتك مع المركز قبل الزيارة."],
  ], changedId) };
}
for (const slug of ["passport-first-time-egypt", "passport-renewal-expired-full", "child-passport-egypt", "passport-lost-inside-egypt", "passport-damaged-replacement-egypt"]) {
  const url = slug.includes("lost") || slug.includes("damaged") ? passportReplacement : passport;
  articleResearchRefreshes[slug] = { reason: "إضافة فصل سن 15 ومستندات الحالات من قائمة مركز خدمات مصر.", source: url, sourceLabel: "مركز خدمات مصر: قائمة مستندات الجواز للحالات المختلفة", section: section("إذا قدمت عبر مركز خدمات مصر", [
    ["إثبات الهوية", "قائمة المركز: شهادة ميلاد رقم قومي لدون 15 عامًا، وبطاقة سارية مطابقة للحالة لمن بلغ 15 عامًا."],
    ["حالات إضافية", "راجع قيد العام الدراسي للطالب، وإثبات الحالة الاجتماعية إذا غاب عن البطاقة، ووثيقة تأمين رعاية المسافر، وفق قائمة الخدمة."],
  ], url, "أكد اكتمال الملف مع المركز؛ هذه القائمة المختصرة لا تحدد جميع مستندات كل حالة.") };
}

export function applyArticleResearchRefresh(input: Article): Article {
  const refresh = articleResearchRefreshes[input.slug];
  if (!refresh || input.status !== "published") return input;
  let article = refresh.apply ? refresh.apply(input) : { ...input };
  if (refresh.section) article = { ...article, practicalSections: [...(article.practicalSections ?? []), refresh.section] };
  const source = { label: refresh.sourceLabel, url: refresh.source, checkedAt };
  article.sources = [...(article.sources ?? []).filter(item => item.url !== refresh.source), source];
  article.updatedAt = updatedAt;
  return article;
}
