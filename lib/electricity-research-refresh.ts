import type { Article, SourceRef } from "./content";

// Scoped editorial changes reviewed on 1 November 2026. An editorial cleanup
// never renews checkedAt on an official page that could not be read.
const checkedAt = "2026-11-01";
const updatedAt = "2026-11-01T13:40:00+03:00";
const northCairo = "https://ncedc.gov.eg/";
const payment = "https://ncedc.gov.eg/AhliPayment";
const upperFaq = "https://ueedc.com/ueed/faq";
const regulatorFaq = "https://egyptera.org/ar/FAQ.aspx";
const codeUpdate = "https://eehc.gov.eg/CMSEehc/الاخبار/بيان-صحف-من-وزارة-الكهرباء-والطاقة-المتجددة/";
type Refresh = { apply: (article: Article) => Article; sources?: { url: string; label: string }[] };

export const electricityResearchRefreshes: Record<string, Refresh> = {
  "electricity-bill-inquiry": {
    apply: article => ({ ...article, faqs: article.faqs?.map(faq => faq.question === "ما الفرق بين العداد الكودي ومسبوق الدفع؟" ? {
      ...faq, answer: "مسبوق الدفع طريقة دفع، والكودي وضع تعاقدي. جدول أبريل 2026 يدرج فئة للكودي، لكن بيان القابضة في 6 سبتمبر 2026 يوجّه بتحويل محاسبة العدادات المستوفية لموافقة توصيل المرافق إلى الشرائح قبل استكمال التعاقد. لا تفترض شمول كل عداد؛ أكد فئة حسابك مع الشركة قبل استخدام الحاسبة المنزلية.",
    } : faq) }),
    sources: [{ url: codeUpdate, label: "القابضة لكهرباء مصر — بيان 6 سبتمبر 2026: شروط تحويل محاسبة الكودي إلى الشرائح" }],
  },
  "north-cairo-electricity": {
    apply: article => ({ ...article,
      quickAnswer: "لاستعلام فاتورة شمال القاهرة، افتح نموذج AhliPayment الرسمي وأدخل رقم السداد المكون من 14 رقمًا من فاتورتك. راجع الحساب والمبلغ قبل اختيار الدفع واحفظ إيصال العملية. تسجيل قراءة العداد خدمة منفصلة؛ تعلن الشركة المنصة الموحدة وشعاع والمحصل و121 ضمن قنواتها.",
      steps: [
        { title: "طابق اسم شركة التوزيع", detail: "تأكد أن الفاتورة تخص شمال القاهرة، وجهز إيصال الحساب نفسه.", relatedLink: { href: "/articles/electricity-bill-inquiry", label: "اختيار شركة الكهرباء وبيانات الحساب" } },
        { title: "افتح نموذج الاستعلام والسداد الرسمي", detail: "افتح AhliPayment على نطاق ncedc.gov.eg؛ يطلب النموذج رقم سداد من 14 رقمًا. انقله من الفاتورة، ولا تضف أصفارًا إلى رقم جسم العداد لتخمينه.", sourceUrl: payment },
        { title: "استعلم وطابق النتيجة قبل الدفع", detail: "قارن بيانات الحساب والمبلغ بفاتورتك. عند نتيجة غير متوقعة توقف وراجع الشركة؛ ظهور النتيجة لا يثبت السداد.", sourceUrl: payment },
        { title: "اختر قناة السداد واحتفظ بالإيصال", detail: "اختر قناة معلنة على موقع الشركة، وراجع بيانات العملية قبل تأكيدها. احفظ الإيصال ورقم المرجع للمتابعة.", sourceUrl: northCairo },
        { title: "استخدم خدمة القراءة لإرسال الاستهلاك", detail: "تذكر الشركة المنصة الموحدة وشعاع والمحصل و121 لتسجيل القراءة؛ نموذج السداد لا يسجلها بدلًا منك. احتفظ بصورة القراءة وتأكيد الإرسال.", sourceUrl: northCairo },
        { title: "تابع المشكلة في مسارها", detail: "بلّغ عن العطل على 121. وللاعتراض المالي احتفظ بالإثباتات وقدم شكوى موثقة للشركة، ثم للجهاز عند عدم الحل.", relatedLink: { href: "/articles/electricity-complaint", label: "شكوى الفاتورة والتصعيد للجهاز" } },
      ],
      faqs: article.faqs?.filter(faq => faq.question !== "هل يمكن تسجيل قراءة العداد إلكترونيًا؟"),
    }),
    sources: [{ url: payment, label: "شمال القاهرة — نموذج AhliPayment ورقم السداد 14 خانة" }, { url: northCairo, label: "شمال القاهرة — قنوات السداد وتسجيل القراءة والأعطال" }],
  },
  "south-delta-electricity": {
    apply: article => ({ ...article, faqs: article.faqs?.filter(faq => faq.question !== "هل يمكن الاستعلام عن فاتورة الكهرباء جنوب الدلتا بالاسم فقط؟") }),
  },
  "north-delta-electricity": {
    apply: article => ({ ...article, steps: article.steps?.map(step => step.title.startsWith("جهز ملخصًا واضحًا") ? {
      ...step, detail: step.detail.replace("إذا تبين أن فاتورتك تتبع جنوب الدلتا، راجع دليلها بدل الاستمرار في بوابة شمال الدلتا.", "إذا اختلف اسم الشركة على الفاتورة، ارجع إلى دليل اختيار الشركة قبل إعادة الاستعلام."), relatedLink: { href: "/articles/electricity-bill-inquiry", label: "اختيار شركة الكهرباء والرقم المطلوب" },
    } : step) }),
  },
  "alexandria-electricity": {
    apply: article => ({ ...article, steps: article.steps?.map(step => step.title === "تحقق من الإيصال قبل اعتبار السداد مكتملًا" ? {
      ...step, detail: step.detail.replace("أما إذا كانت فاتورتك تتبع شمال الدلتا رغم قربك من الإسكندرية، فانتقل إلى دليل الشركة المكتوبة على الفاتورة.", "إذا لم تُحل مراجعة السداد لدى الشركة، استخدم ملف الشكوى وإثبات العملية للتصعيد."), relatedLink: { href: "/articles/electricity-complaint", label: "تجهيز شكوى سداد الفاتورة والتصعيد" },
    } : step) }),
  },
  "upper-egypt-electricity": {
    apply: article => ({ ...article, faqs: [...(article.faqs ?? []), { question: "هل اليومية في بيانات القراءة تعني تاريخ اليوم؟", answer: "المقصود خانة اليومية على إيصال الحساب، إلى جانب المنطقة والحساب والفرعي؛ انقل قيمتها كما هي. فترة الإبلاغ المنشورة تعتمد على هذه اليومية، فلا تضع يوم الشهر الحالي مكانها." }] }),
    sources: [{ url: upperFaq, label: "مصر العليا — بيانات الإيصال وفترات الإبلاغ عن القراءة" }],
  },
  "electricity-meter-transfer": {
    apply: article => ({ ...article, quickAnswer: "لنقل ملكية عداد الكهرباء، جهّز هوية الطرفين وعقد الإيجار أو الملكية وإيصالًا حديثًا، وحضور المشترك الأصلي أو توكيله. للورثة موافقة وصورة إعلام الوراثة. قدّم الملف وادفع الرسوم المطلوبة؛ تنص تعليمات الجهاز على إقرار المشترك الجديد بسداد المستحقات السابقة. اطلب بيانها وافهم الإقرار قبل التوقيع، ثم تابع تغيير الاسم." }),
    sources: [{ url: regulatorFaq, label: "جهاز تنظيم مرفق الكهرباء — نقل الملكية وإقرار المستحقات" }],
  },
  "electricity-complaint": {
    apply: article => ({ ...article, faqs: article.faqs?.map(faq => faq.question === "هل 121 مخصص لاعتراض الفاتورة؟" ? { question: "هل 121 للأعطال فقط؟", answer: "هو قناة للأعطال، وتعلن شمال القاهرة استخدامه لتسجيل القراءة أيضًا. لا يغني الاتصال عن ملف الاعتراض الموثق؛ احتفظ بشكوى الشركة وردها للتصعيد إلى الجهاز عند عدم الحل." } : faq) }),
    sources: [{ url: northCairo, label: "شمال القاهرة — 121 ضمن قنوات القراءة والأعطال" }],
  },
  "electricity-outage-report": {
    apply: article => ({ ...article, faqs: article.faqs?.map(faq => faq.question === "هل أستخدم 121 للاعتراض على قيمة الفاتورة؟" ? { ...faq, answer: "بلّغ عن الانقطاع أو الخطر على 121. وقد تعلن شركتك استخدامات إضافية؛ شمال القاهرة تذكر تسجيل القراءة أيضًا. للاعتراض المالي احتفظ بشكوى موثقة للشركة ومرفقاتها للتصعيد عند عدم الحل." } : faq) }),
    sources: [{ url: northCairo, label: "شمال القاهرة — قنوات القراءة وحدود تعميم استخدام 121" }],
  },
};

export function applyElectricityResearchRefresh(input: Article): Article {
  const refresh = electricityResearchRefreshes[input.slug];
  if (!refresh || input.status !== "published") return input;
  const article = refresh.apply(input);
  const sources: SourceRef[] = [...(article.sources ?? [])];
  for (const source of refresh.sources ?? []) {
    const existing = sources.findIndex(item => item.url === source.url);
    const reviewed = { ...source, checkedAt };
    if (existing >= 0) sources[existing] = reviewed;
    else sources.push(reviewed);
  }
  return { ...article, sources, updatedAt };
}
