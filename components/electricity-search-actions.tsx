import Link from "next/link";

// Questions observed for these pages in Google Search Console (Sep–Nov 2026).
// Answers only use verified company or government sources. Keep each company distinct.
type IntentQuestion = { question: string; answer: string; sourceUrl: string; sourceLabel: string };
type IntentGuide = {
  title: string;
  introduction: string;
  questions: IntentQuestion[];
  related: { slug: string; label: string }[];
};

const intentGuides: Record<string, IntentGuide> = {
  "north-cairo-electricity": {
    title: "تسجيل قراءة عداد الكهرباء شمال القاهرة: ما القناة الصحيحة؟",
    introduction: "إذا ظهر اسم شركة شمال القاهرة لتوزيع الكهرباء على فاتورتك، حدد أولًا هل تريد إرسال القراءة أم الاستعلام عن مبلغ مستحق؛ لكل مهمة بيانات وقناة مختلفة.",
    questions: [
      {
        question: "كيف أبلغ قراءة عداد الكهرباء لشركة شمال القاهرة؟",
        answer: "يذكر الموقع الرسمي المنصة الموحدة لخدمات الكهرباء، وكشافي شركة شعاع، ومحصلين الشركة، والرقم 121 ضمن طرق تسجيل القراءة. اختر قناة متاحة لحسابك واحتفظ بقيمة القراءة وتاريخ الإبلاغ. ذكر القناة لا يثبت قبول قراءة محددة.",
        sourceUrl: "https://ncedc.gov.eg/",
        sourceLabel: "شركة شمال القاهرة: طرق تسجيل القراءة",
      },
      {
        question: "هل أكتب رقم العداد في نموذج الاستعلام والسداد؟",
        answer: "صفحة AhliPayment تنبه إلى رقم السداد المكوّن من 14 خانة. انقله من فاتورة حسابك ولا تستخدم الرقم المطبوع على جسم العداد بدلًا منه، ولا تعتبر ظهور مبلغ الاستحقاق إثباتًا للسداد.",
        sourceUrl: "https://ncedc.gov.eg/AhliPayment",
        sourceLabel: "شركة شمال القاهرة: نموذج السداد الإلكتروني",
      },
    ],
    related: [
      { slug: "electricity-bill-inquiry", label: "اختيار شركة الكهرباء والفرق بين رقم العداد ورقم السداد" },
      { slug: "south-cairo-electricity", label: "خدمات جنوب القاهرة إذا كان اسمها على فاتورتك" },
      { slug: "electricity-complaint", label: "الاعتراض على قراءة أو فاتورة الكهرباء" },
    ],
  },
  "south-delta-electricity": {
    title: "فاتورة كهرباء جنوب الدلتا: بالاسم أم برقم المشترك؟",
    introduction: "الاستعلام عن الفاتورة وإرسال قراءة العداد خدمتان مختلفتان. تحقق من اسم شركة التوزيع على فاتورتك قبل إدخال أي معلومات.",
    questions: [
      {
        question: "هل أستطيع الاستعلام بالاسم أو برقم العداد فقط؟",
        answer: "نموذج الاستعلام الذي راجعناه يطلب رقم المشترك المكوّن من 13 خانة ورمز التحقق، وليس الاسم وحده. انقل رقم المشترك من فاتورة سابقة للحساب نفسه، ثم راجع الشهر والمبلغ دون افتراض أن الاستعلام يعني السداد.",
        sourceUrl: "https://sdedc.gov.eg/ar/Fatora",
        sourceLabel: "جنوب الدلتا: نموذج الاستعلام عن الفواتير",
      },
      {
        question: "متى يمكن الإبلاغ عن قراءة عداد جنوب الدلتا؟",
        answer: "تذكر صفحة «إرسال القراءة» الرسمية الفترة من يوم 5 إلى يوم 15 من كل شهر. تأكد من استمرار الفترة وظهور نموذج الإرسال عند الاستخدام، ولا تخلط إرسال القراءة مع دفع الفاتورة.",
        sourceUrl: "https://sdedc.gov.eg/ar/SendReading",
        sourceLabel: "جنوب الدلتا: إرسال القراءة",
      },
    ],
    related: [
      { slug: "electricity-bill-inquiry", label: "دليل الاستعلام عن فواتير الكهرباء حسب الشركة" },
      { slug: "north-delta-electricity", label: "خدمات شمال الدلتا إذا ظهر اسمها على الفاتورة" },
      { slug: "electricity-complaint", label: "تقديم شكوى على فاتورة الكهرباء أو القراءة" },
    ],
  },
  "north-delta-electricity": {
    title: "فاتورة شمال الدلتا: تحقق من الشركة والبيانات قبل السداد",
    introduction: "تظهر أسئلة البحث باسم شركة شمال الدلتا وتستهدف الوصول إلى خدمة فاتورة صحيحة. هذه خطوات تحقق تمنع استخدام موقع شركة أخرى أو رقم غير مناسب.",
    questions: [
      {
        question: "كيف أتأكد أن فاتورتي تتبع شركة شمال الدلتا؟",
        answer: "اقرأ اسم شركة التوزيع في فاتورة أو إيصال سابق؛ وجود العداد في محافظة قريبة لا يكفي وحده لتحديد الشركة. ابدأ من موقع الشركة الرسمي واختر الاستعلام أو القراءة بحسب حاجتك، مع نقل بيانات الحساب كما تظهر في فاتورتك.",
        sourceUrl: "https://www.ndedco.gov.eg/",
        sourceLabel: "شركة شمال الدلتا: الموقع الرسمي",
      },
      {
        question: "ماذا أفعل إذا تعذرت الخدمة أو لم يظهر حسابي؟",
        answer: "لا تغيّر الأرقام بالتخمين ولا تكرر الدفع. احتفظ باسم الشركة وتاريخ المحاولة ورسالة الخطأ، ثم راجع مركز خدمة الشركة أو الرقم 121 للحصول على توجيه. لا يمكن اعتبار عدم ظهور الحساب دليلًا على عدم وجود مستحقات.",
        sourceUrl: "https://www.ndedco.gov.eg/",
        sourceLabel: "شركة شمال الدلتا: قنوات الخدمة",
      },
    ],
    related: [
      { slug: "electricity-bill-inquiry", label: "اختيار شركة التوزيع قبل الاستعلام عن الفاتورة" },
      { slug: "south-delta-electricity", label: "الاستعلام عن فاتورة جنوب الدلتا برقم المشترك" },
      { slug: "electricity-complaint", label: "خطوات الشكوى عند اختلاف قيمة الفاتورة" },
    ],
  },
  "south-cairo-electricity": {
    title: "شركة جنوب القاهرة للكهرباء: الاستعلام والسداد والقراءة",
    introduction: "حدد المهمة أولًا، وتأكد أن اسم شركة جنوب القاهرة يظهر على الفاتورة. لا تخلط بينها وبين شركة شمال القاهرة لمجرد أن العنوان داخل القاهرة.",
    questions: [
      {
        question: "أين أجد الخدمات التي تؤكدها الجهات الرسمية؟",
        answer: "تذكر بوابة محافظة القاهرة خدمات الشباك الواحد وحساب الفاتورة وشكاوى المواطنين لشركة جنوب القاهرة. ابدأ بالموقع الرسمي للشركة، وتحقق من الخدمة المتاحة لحسابك قبل إرسال بيانات شخصية.",
        sourceUrl: "https://cairo.gov.eg/ar/governorate-entities/companies/south-cairo-electricity-distribution-company/services/",
        sourceLabel: "بوابة محافظة القاهرة: خدمات شركة جنوب القاهرة",
      },
      {
        question: "هل يمكن سداد فاتورة جنوب القاهرة بالفيزا مباشرة؟",
        answer: "لا يكفي ذكر اسم خدمة السداد لإثبات عمل نموذج دفع إلكتروني في الوقت الحالي. استخدم فقط القناة التي تعلنها الشركة وتعرض بيانات الحساب والمبلغ والجهة المستفيدة، واحفظ الإيصال بعد التأكد من إتمام العملية؛ وإلا اطلب المساعدة من الشركة.",
        sourceUrl: "https://scedc.gov.eg/",
        sourceLabel: "شركة جنوب القاهرة: الموقع الرسمي",
      },
    ],
    related: [
      { slug: "electricity-bill-inquiry", label: "دليل شركات الكهرباء والتأكد من تبعية الحساب" },
      { slug: "north-cairo-electricity", label: "شمال القاهرة: تسجيل القراءة ورقم السداد" },
      { slug: "electricity-complaint", label: "الشكوى على فاتورة الكهرباء والتصعيد" },
    ],
  },
};

export function hasElectricitySearchActions(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(intentGuides, slug);
}

export function ElectricitySearchActions({ slug }: { slug: string }) {
  const guide = intentGuides[slug];
  if (!guide) return null;
  return (
    <section className="brief-box" id="electricity-search-actions" aria-labelledby="electricity-search-actions-title">
      <h2 id="electricity-search-actions-title">{guide.title}</h2>
      <p>{guide.introduction}</p>
      {guide.questions.map((item) => (
        <div key={item.question}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
          <p><a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.sourceLabel}</a></p>
        </div>
      ))}
      <h3>اختر الدليل المرتبط بمهمتك</h3>
      <ul>
        {guide.related.map((item) => (
          <li key={item.slug}><Link href={"/articles/" + item.slug}>{item.label}</Link></li>
        ))}
      </ul>
    </section>
  );
}
