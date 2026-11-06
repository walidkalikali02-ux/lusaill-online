import { pageAlternates } from "@/lib/page-alternates";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig, absoluteUrl, siteSocialImage } from "@/lib/site-config";
import { overallProgress } from "@/lib/content";

export const metadata: Metadata = {
  twitter: { card: "summary_large_image", title: "عن لوسيل", description: siteConfig.description, images: ["https://www.lusaill.online/opengraph-image"] },
  title: "عن لوسيل",
  description: siteConfig.description,
  alternates: pageAlternates("/about"),
  openGraph: {
    title: "عن لوسيل",
    description: siteConfig.description,
    url: "/about",
    type: "website",
    images: [siteSocialImage],
  },
};

export default function AboutPage() {
  const progress = overallProgress();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "عن لوسيل", item: absoluteUrl("/about") },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/about/#webpage`,
    url: absoluteUrl("/about"),
    name: "عن لوسيل",
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
  };

  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">عن المشروع</span>
        <h1>لوسيل — موسوعة عربية شاملة للمعرفة</h1>
        <p className="text-lead">
          {siteConfig.description} هدفنا بناء مرجع عربي واسع يساعد القارئ على فهم الموضوعات والأسئلة في مختلف مجالات الحياة، مع توثيق المعلومات وتوضيح ما نعرفه وما يتطلب تحققًا إضافيًا.
        </p>
        <section aria-labelledby="encyclopedia-scope">
          <h2 id="encyclopedia-scope">موسوعة لجميع مجالات المعرفة</h2>
          <p>رؤية لوسيل هي تغطية موضوعات العلوم والطبيعة والصحة والتعليم والتاريخ والثقافة والتقنية والاقتصاد والحياة اليومية والخدمات وغيرها، من خلال محتوى عربي واضح يمكن الرجوع إلى مصادره. لا يعني ذلك أن جميع المجالات اكتملت اليوم؛ نوسّعها تدريجيًا بحسب قيمة الموضوع ودقة مراجعه.</p>
          <p>يمكنك البدء من <Link href="/knowledge">المقالات المعرفية والأدوات</Link>، أو <Link href="/courses">الكورسات التعليمية</Link>، أو <Link href="/articles">الأدلة العملية</Link>. وأدلة الإجراءات الحكومية جزء من هذه الموسوعة وليست اختصاصها الوحيد.</p>
        </section>
        <section aria-labelledby="site-ownership">
          <h2 id="site-ownership">ملكية الموقع</h2>
          <p>
            مالك موقع لوسيل: <strong lang="en" dir="ltr">{siteConfig.owner}</strong>.
            يقدم الموقع محتوى إرشاديًا مستقلًا، ولا تمثل الأدلة اعتمادًا رسميًا من الجهات المذكورة فيها.
            للاقتراحات والتصحيحات، يُرجى استخدام <Link href="/contact">صفحة التواصل</Link>،
            ولقواعد إعداد المحتوى ومراجعته راجع <Link href="/editorial-policy">منهج التحرير</Link>.
          </p>
        </section>
        <section className="brief-box"><h2>كيف تستخدم لوسيل لفهم موضوع أو حل مشكلة؟</h2>
          <p>ابدأ بالسؤال الذي تريد فهمه: مفهوم علمي، معلومة صحية عامة، مسألة تعليمية، أداة تقنية أو إجراء يومي. ابحث عن موضوعك، واقرأ الملخص والمصادر، ثم انتقل إلى المحتوى المرتبط عند الحاجة. المقال العلمي يشرح المعرفة ودرجة اليقين، بينما يضيف الدليل العملي خطوات وشروطًا مرتبطة بسياق محدد. وإذا كان الموضوع يتعلق بإجراء رسمي أو قرار حساس، تحقق من مرجعه الحالي أو من المختص المناسب.</p>
          <h2>ما الذي يفترض أن تجده داخل الدليل؟</h2>
          <p>نعرض المشكلة المقصودة والمتطلبات والخطوات وعلامات نجاح الإجراء عندما يسمح المصدر بتوثيقها. ونضيف الأخطاء الشائعة وحدود الحل حتى تعرف متى تتوقف عن تكرار محاولة لا تناسب حالتك. الأمثلة التحريرية تشرح الفكرة ولا تمثل طلبًا حقيقيًا أو وعدًا بقبوله. كذلك، الصور التوضيحية تساعد على الفهم ولا تعد دليلًا على اعتماد الخدمة للموقع. اقرأ تسمية الصورة وملاحظات المقال بدل افتراض أنها واجهة رسمية. وراجع المصدر والتاريخ عندما يكون السؤال عن موعد أو شرط أو إجراء يمكن أن يتغير بمرور الوقت.</p>
          <h2>كيف تميز المعلومة عن الاقتراح؟</h2>
          <p>الخطوة المرتبطة بمصدر توضح ما يمكن إسناده إلى الجهة أو وثائق المنتج، أما النصيحة التنظيمية فتهدف إلى تسهيل التطبيق. مثلًا، الاحتفاظ برقم الطلب في ملاحظة خاصة بك اقتراح عملي، وليس شرطًا إضافيًا تفرضه جهة الخدمة. لا ننسب توصية تحريرية إلى مصدر لم يذكرها، ولا نستخدم الدرجة الداخلية للمقال بوصفها شهادة رسمية. يمكن الاستفادة من الأدلة لترتيب أسئلتك، لكن القرار الذي يخص طلبك أو أهلية حالتك يصدر من الجهة المختصة، وليس من عنوان المقال أو ملخصه في نتائج البحث.</p>
          <h2>التصحيح وحدود التواصل</h2>
          <p>إذا وجدت رابطًا لا يعمل أو شرحًا لا يطابق المصدر، أرسل اسم المقال وموضع المشكلة ورابط المرجع عبر صفحة التواصل. يكفي وصف عام يمكن فهمه دون كشف بياناتك؛ لا ترسل كلمة مرور أو رمز تحقق أو صورة مستند شخصي. تساعد هذه التفاصيل على تحديد ما يحتاج مراجعة بدل تغيير المقال اعتمادًا على رسالة غير واضحة. يمكنك أيضًا اقتراح سؤال جديد يهمك، مع ذكر البلد والخدمة أو نوع الجهاز دون معلومات حساسة. اقرأ صفحة فريق التحرير وسياسة التحرير لمعرفة استخدام أدوات المساعدة وحدود الاختبار، وكيف نعرض المصادر وتواريخ التحقق داخل المحتوى المنشور.</p>
          <p><Link href="/guides">مسارات الأدلة</Link> · <Link href="/articles">كل الأدلة</Link> · <Link href="/contact">التواصل والتصحيح</Link></p>
        </section>
        <div className="text-grid">
          <section>
            <span>الهدف</span>
            <h2>معرفة موثقة وواضحة</h2>
            <p>نشرح السؤال ونعرض المصادر المناسبة لمجاله، ونوضح حدود الدليل وما يمكن للقارئ الاستفادة منه.</p>
          </section>
          <section>
            <span>الحالة الآن</span>
            <h2>{progress.published} دليلًا منشورًا</h2>
            <p>هذا العدد يخص قسم الأدلة العملية فقط؛ إلى جانبه مقالات معرفية وكورسات وأدوات تعليمية. نستخدم لكل مجال مصادر تناسب طبيعة ادعاءاته.</p>
          </section>
        </div>
        <div className="text-cta">
          <div>
            <strong>محتوى معرفي وإرشادي عام</strong>
            <p>لا يحل محل الجهة الرسمية أو المتخصص المؤهل في القرارات الطبية أو القانونية أو المالية.</p>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
    </main>
  );
}
