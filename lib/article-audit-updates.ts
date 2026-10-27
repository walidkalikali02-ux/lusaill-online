import type { Article } from "./content";
import { housingDeadlinePassed } from "./deadlines";

export type PracticalSection = { title: string; intro?: string; columns: string[]; rows: string[][]; sourceUrl?: string };
export type ArticleAdvisory = { title: string; detail: string; url: string; label: string };
const reviewedAt = "2026-10-27T16:56:00+03:00";
const sdkCodes = "https://sdk.invoicing.eta.gov.eg/api/09-create-egs-code-usage/";
const sdkFaq = "https://sdk.invoicing.eta.gov.eg/faq/";
const registrationGuide = "https://www.eta.gov.eg/sites/default/files/2022-12/E-INVOICING-SELF-REGISTRATION.pdf";
const machineLocator = "https://psm.gov.eg/Services/533";
const trafficLaw = "https://traffic.moi.gov.eg/Arabic/OurServices/InfoServices/TrafficLaw/Pages/driving-licenses-for-rapid-transport-vehicles.aspx";
export const trafficArticleSlugs = new Set([
  "driving-license-damaged-replacement", "driving-license-medical-exam", "foreign-driving-license-egypt", "motorcycle-driving-license-egypt",
  "private-driving-license-first-time", "private-driving-license-renewal", "professional-driving-license-egypt", "verify-used-vehicle-license",
]);

export function getArticleAdvisories(article: Article, now = new Date()): ArticleAdvisory[] {
  const notices: ArticleAdvisory[] = [];
  if (article.slug.startsWith("old-rent-housing-") && housingDeadlinePassed(now)) {
    notices.push({ title: "تحقق من إتاحة التقديم قبل بدء إجراء جديد", detail: "الموعد المنشور الذي تستند إليه هذه السلسلة هو 12 أكتوبر 2026 وقد مضى. شرح المستندات أو إجراءات البريد لا يثبت استمرار استقبال طلبات جديدة أو وجود تمديد. راجع الإعلان الرسمي الحالي أولًا. إذا سبق إرسال طلب، افصل متابعته واستكمال نواقصه عن إنشاء طلب جديد.", url: "/articles/old-rent-housing-apply", label: "الموعد المنشور ومصادره" });
  }
  if (article.sources?.some(source => {
    const host = new URL(source.url).hostname;
    return host === "www.tra.gov.eg" || host === "tra.gov.eg";
  })) {
    notices.push({ title: "تنبيه إتاحة المصادر — رُصد في 27 أكتوبر 2026", detail: "أعلن الموقع الرئيسي للجهاز القومي لتنظيم الاتصالات أنه تحت الصيانة؛ قد لا تفتح بعض المراجع الداخلية حاليًا. نحتفظ بها كمراجع للمعلومات المنشورة، ولا نعد تعذر فتحها دليلًا على إلغاء الخدمة. يعرض إعلان الصيانة قنواته الحالية، ومنها منظومة الشكاوى والرقم 155. تحقق من القناة التي تناسب معاملتك قبل مشاركة بياناتك.", url: "https://www.tra.gov.eg/", label: "إعلان الصيانة والقنوات الرسمية الحالية" });
  }
  return notices;
}

function addSource(article: Article, label: string, url: string) {
  if (!article.sources?.some(source => source.url === url)) article.sources = [...(article.sources ?? []), { label, url, checkedAt: "2026-10-27" }];
}

// These updates preserve article URLs and original publication/source-check dates.
export function applyArticleAuditUpdates(input: Article): Article {
  const article: Article = { ...input };
  if (trafficArticleSlugs.has(article.slug)) article.clusterCode = "C";
  if (article.slug === "old-rent-housing-apply" && housingDeadlinePassed()) {
    article.faqs = article.faqs?.map(faq => faq.question === "ماذا أفعل إذا اقترب الموعد ولم أستكمل المستندات؟" ? {
      question: "ماذا أفعل بعد مرور الموعد المنشور؟",
      answer: "إذا سبق إرسال الطلب، تابع حسابك والإخطارات الخاصة باستكماله. إذا لم ترسل طلبًا، تحقق من أحدث إعلان رسمي عن استقبال الطلبات قبل محاولة إنشاء طلب جديد أو الذهاب إلى البريد؛ هذا الدليل لا يثبت وجود تمديد أو عدمه، ولا يعني تجهيز المستندات أن الطلب أُرسل.",
    } : faq);
    article.updatedAt = reviewedAt;
  }
  if (article.slug === "old-rent-housing-post-office" && housingDeadlinePassed()) {
    article.metaDescription = "دور البريد في طلب السكن البديل ومستندات الزيارة. الموعد المنشور السابق 12 أكتوبر 2026 وقد مضى؛ تحقق من إعلان رسمي حالي قبل طلب تسجيل جديد.";
    article.quickAnswer = "الموعد المنشور في هذه السلسلة هو 12 أكتوبر 2026 وقد مضى. قبل الذهاب إلى البريد لتسجيل طلب جديد، تحقق من إعلان الجهة الرسمي الحالي؛ لا يثبت هذا الشرح استمرار التقديم أو وجود تمديد. كان دور المكاتب المشاركة مساعدة المواطن في إدخال الطلب عبر مصر الرقمية، وليس تقرير الأهلية أو تخصيص الوحدة.";
    article.updatedAt = reviewedAt;
  }
  if (article.slug === "e-invoice-gs1-egs-codes") {
    article.practicalSections = [{ title: "مثال تجهيز كود EGS قبل طلب اعتماده", intro: "القيم بين الأقواس عناصر نائبة، وليست كودًا صالحًا أو رقم تسجيل حقيقيًا. مثال تحريري للتجهيز؛ لم نرسل طلبًا. توثيق المصلحة يوضح أن إرسال طلب التسجيل يسبق الموافقة واستخدام الكود.", columns: ["الحقل", "مثال تحضيري", "ما الذي تتحقق منه؟"], rows: [
      ["الصنف الداخلي", "PEN-BLUE-01 — قلم أزرق", "وصف يميز الصنف عن بقية الأصناف."],
      ["codeType / itemCode", "EGS / EG-<TaxpayerID>-PEN-BLUE-01", "استبدل TaxpayerID برقم تسجيل منشأتك الصحيح. الصيغة الرسمية هي EG ثم رقم التسجيل ثم كودك الداخلي، مفصولة بشرطات."],
      ["parentCode", "<كود GPC مستوى 4 مناسب للصنف>", "ابحث عن تصنيف الصنف الفعلي؛ لا تنسخ رقم مثال لصنف مختلف."],
      ["codeName / codeNameAr", "Blue pen / قلم أزرق", "طابق الاسمين مع الصنف نفسه."],
      ["activeFrom", "<تاريخ بداية السريان بصيغة UTC>", "حدده وفق الاستخدام الفعلي، وبالصيغة التي يطلبها النظام."],
      ["النتيجة", "مقدم ← قرار الجهة ← مسموح بالاستخدام عند الموافقة", "احتفظ بمرجع الطلب؛ نجاح الإرسال لا يعني اعتماد الكود."],
    ], sourceUrl: sdkCodes }];
    article.steps = article.steps?.map((step, index) => index === 3 ? { ...step, detail: step.detail + " للمطور الذي يربط نظام ERP: يوضح التوثيق الرسمي مسار POST /api/v1.0/codetypes/requests/codes ومصفوفة items. هذا مسار API وليس عنوان صفحة تفتحه لإرسال طلب يدوي؛ يحتاج مصادقة وصلاحيات، ثم موافقة الجهة على الكود قبل الاستخدام.", sourceUrl: sdkCodes } : step);
    addSource(article, "مصلحة الضرائب: حقول وصيغة طلب إنشاء كود EGS ومراحل اعتماده", sdkCodes);
    article.updatedAt = reviewedAt;
  }
  if (article.slug === "e-invoice-registration-errors") {
    article.practicalSections = [{ title: "شخّص مرحلة التعثر قبل إعادة التسجيل", intro: "هذه أوصاف لحالات التشخيص، وليست اقتباسات لرسائل خطأ من البوابة. انسخ نص رسالتك الفعلية بدل افتراض أنها تطابق حالة أخرى. دليل التسجيل المذكور مرجع منشور؛ راجع متطلبات البوابة الحالية عند اختلاف الواجهة.", columns: ["ما تلاحظه", "فحص محدد", "علامة التقدم أو التصعيد"], rows: [
      ["التعثر عند التعرف على الختم", "قارن رقم التسجيل في شهادة الختم بالمنشأة المطلوب تسجيلها، وراجع صلاحية الشهادة وأداة التوقيع وفق دليل المصلحة.", "التعرف على شهادة المنشأة الصحيحة. عند استمرار الفشل أرسل للدعم المرحلة وإصدار الأداة دون PIN."],
      ["تعثر أثناء اتباع دليل التسجيل المنشور", "يذكر دليل التسجيل الذاتي نظام Windows؛ طابق بيئة جهازك مع تعليمات البوابة الحالية، ولا تعتبر تشغيلها على نظام آخر مضمونًا.", "الانتقال إلى التحقق من بيانات المنشأة، أو إحالة الفرق بين الدليل والواجهة للدعم."],
      ["اختلاف بيانات المنشأة أو المفوض", "طابق رقم التسجيل والبريد والصفة مع الملف الأصلي. لا تنشئ كيانًا ثانيًا لتجاوز الاختلاف.", "ظهور الكيان الصحيح والصلاحية المناسبة، أو تذكرة تصحيح بيانات رسمية."],
      ["التباس بين بيئة الاختبار والإنتاج", "قارن النطاق: profile.preprod.eta.gov.eg للاختبار وprofile.eta.gov.eg للإنتاج وفق SDK. تعليمات شهادة بيئة الاختبار تخصها وحدها.", "التأكد من البيئة المطلوبة. لا تعطل التحقق من الشهادات أو تثبت شهادة اختبار في بيئة الإنتاج."],
    ], sourceUrl: registrationGuide }];
    addSource(article, "مصلحة الضرائب: دليل خطوات التسجيل الذاتي المنشور", registrationGuide);
    addSource(article, "SDK مصلحة الضرائب: الفصل بين نطاقات الاختبار والإنتاج", sdkFaq);
    article.updatedAt = reviewedAt;
  }
  if (article.slug === "birth-certificate-smart-machine") {
    article.steps = article.steps?.map((step, index) => index === 0 ? { ...step, detail: "ابدأ بصفحة «خدمة الماكينة الخاصة بشهادات الميلاد» في دليل الخدمات العامة، واختر المحافظة والمنطقة لعرض بيانات الخدمة المتاحة. إذا لم تظهر جهة أو تعذر الموقع، اسأل الأحوال المدنية عن نقطة تقدم خدمة الماكينة في منطقتك قبل الزيارة؛ لا تستنتج أنها تعمل من وجود عنوان قديم على الخريطة. عند الوصول تحقق من قائمة خدمات الشاشة وحالة الجهاز قبل إدخال بياناتك.", sourceUrl: machineLocator } : step);
    article.practicalSections = [{ title: "قبل التوجه إلى موقع ماكينة", intro: "تعذر تأكيد إتاحة دليل المواقع عند هذه المراجعة. الطريقة أدناه تصف استخدام صفحته المفهرسة، ولا تؤكد عمل ماكينة بعينها اليوم.", columns: ["الحالة", "الإجراء"], rows: [
      ["يعمل دليل الخدمات", "اختر المحافظة والمنطقة ثم راجع بيانات خدمة الماكينة؛ لا تفترض أن كل سجل مدني يملك ماكينة."],
      ["الدليل لا يفتح أو لا يعرض موقعًا", "استخدم بيانات اتصال قطاع الأحوال المدنية من قناة وزارة الداخلية الرسمية لتأكيد نقطة الخدمة؛ لا توجد هنا قائمة مؤكدة بتوافر كل ماكينة اليوم."],
      ["الماكينة متوقفة أو الخدمة غير ظاهرة", "استخدم قناة استخراج أخرى بعد تأكيد شروطها؛ لا تدفع ولا تدخل بياناتك بمساعدة وسيط غير موثق."],
    ], sourceUrl: machineLocator }];

    article.updatedAt = reviewedAt;
  }
  if (article.slug === "seasonal-work-permit-egypt") {
    article.title = "تصريح العمل الموسمي: دليل أولي لاختيار الخدمة";
    article.metaDescription = "دليل توجيه أولي لخدمة التصاريح الموسمية: ما الذي تؤكده قبل بدء الطلب، وكيف تميزها عن الإصدار والتجديد. لا يمثل قائمة مستندات مكتملة.";
    article.quickAnswer = "هذا دليل توجيه أولي، وليس قائمة مستندات مكتملة أو تأكيدًا لأهليتك. تعرض بوابة الداخلية خدمة إصدار تصاريح موسمية، لكن لم نتمكن من توثيق قائمة عامة حديثة للمستندات والفئات والرسوم من صفحة متاحة دون تسجيل دخول. قبل تجهيز طلب أو دفع مبلغ، اطلب من الجهة تأكيد انطباق الخدمة والمستندات المطلوبة والفترة التي يغطيها التصريح.";
    article.practicalSections = [{ title: "أسئلة تحسمها مع الجهة قبل بدء الطلب", columns: ["السؤال", "ما تحتفظ به"], rows: [
      ["هل حالتي تصنف تصريحًا موسميًا أم أول إصدار أو تجديدًا؟", "اسم الخدمة الذي أكدته الجهة؛ قصر عقد العمل وحده لا يثبت التصنيف."],
      ["ما المستندات اللازمة لحالتي وصيغها؟", "قائمة من البوابة أو الجهة، تشمل الأصول والصور المطلوبة. لا تعتمد قائمة تخمينية من هذا الدليل."],
      ["ما الفترة والرسوم وقناة السداد والتسليم؟", "التفاصيل المعروضة في الطلب الرسمي ومرجعه؛ لا تدفع لوسيط مقابل ضمان القبول."],
    ], sourceUrl: "https://publicservices.moi.gov.eg/" }];
    article.updatedAt = reviewedAt;
  }
  if (article.slug === "foreign-driving-license-egypt") {
    article.practicalSections = [{ title: "افصل استخدام الرخصة الأجنبية عن طلب رخصة مصرية", intro: "المادة 39 في النص المنشور على بوابة المرور تربط المدة المسموح بها بالاتفاقيات النافذة وبصلاحية الرخصة في بلد الإصدار. تعذر الوصول المباشر إلى النص في هذه المراجعة واستُعين بنسخته المفهرسة. الحالات التالية لترتيب الاستفسار، وليست تصريح قيادة شخصيًا أو جدول دول معتمدًا.", columns: ["حالتك", "ما يجب تأكيده قبل القيادة"], rows: [
      ["رخصة أجنبية أو دولية سارية وتريد استخدامها داخل مصر", "اسأل المرور عن المدة المسموح بها لوثيقتك وفق الاتفاقية النافذة؛ لا تفترض عدد أشهر موحدًا لكل الجنسيات."],
      ["انتهت صلاحيتها في بلد إصدارها", "لا تعتمد عليها: المدة داخل مصر لا تتجاوز صلاحيتها الأصلية وفق المادة 39."],
      ["جُددت بالخارج وأنت موجود داخل مصر", "المادة 39 لا تعتد بهذا التجديد أثناء وجود المرخص له بالبلاد؛ اطلب المسار النظامي من المرور."],
      ["تريد إصدار رخصة مصرية بدل استخدام الأجنبية", "هذه معاملة مختلفة؛ أكد النوع والجنسية والإقامة وشروط اللائحة والمستندات مع المرور. لا نفترض تحويلًا تلقائيًا أو إعفاءً من الاختبار."],
    ], sourceUrl: trafficLaw }];

    article.updatedAt = reviewedAt;
  }
  if (article.slug === "telecom-accessibility-egypt") {
    article.quickAnswer = "راجع أولًا قناة الشركة التي تناسب احتياجك وخذ رقم شكوى إن لم تحل المشكلة. كانت المصادر المنشورة للجهاز تشرح تيسيرات لذوي الهمم وخدمة شكوى بالفيديو بلغة الإشارة؛ لكن موقعه الرئيسي أعلن الصيانة عند فحصه في 27 أكتوبر 2026، ولم نتمكن من تأكيد رابط بدء مكالمة الفيديو حاليًا. يعرض إعلان الصيانة رابط منظومة الشكاوى؛ لا نفترض أنها تقدم مكالمة إشارة أو أن الاتصال الصوتي يلائم كل مستخدم.";
    article.steps = article.steps?.map((step, index) => index === 3 ? { ...step, title: "تحقق من قناة الفيديو أو استخدم قناة كتابية مناسبة", detail: "افتح إعلان الصيانة الرسمي واتبع منه رابط منظومة الشكاوى إذا أردت تقديم وصف كتابي. اذكر حاجتك إلى التواصل بلغة الإشارة أو تيسير محدد، واحتفظ بمرجع الشكوى إن أتيح. لم نتأكد من زر لبدء مكالمة فيديو أثناء الصيانة؛ لا ترسل بياناتك إلى رقم أو رابط يدعي توفيرها دون إحالته من الجهاز، ولا تعتبر 155 الصوتي بديلًا مناسبًا للجميع.", sourceUrl: "https://www.tra.gov.eg/" } : step);
    article.faqs = article.faqs?.map(faq => faq.question.includes("الإشارة") || faq.question.includes("فيديو") ? { ...faq, answer: "المراجع المنشورة تصف خدمة بالفيديو بلغة الإشارة، لكن لم نتأكد من رابط بدء المكالمة أثناء صيانة الموقع في 27 أكتوبر 2026. راجع إعلان الجهاز وقنواته الحالية، واطلب التيسير المناسب في وصف شكواك." } : faq);
    addSource(article, "الجهاز: إعلان الصيانة والقنوات الحالية — تحقق إتاحة فقط", "https://www.tra.gov.eg/");
    article.updatedAt = reviewedAt;
  }
  return article;
}
