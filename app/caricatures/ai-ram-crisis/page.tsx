import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { pageAlternates } from "@/lib/page-alternates";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import s from "../caricatures.module.css";

const path = "/caricatures/ai-ram-crisis";
const cover = "/images/caricatures/ai-ram-crisis.jpg";
const title = "أزمة الرامات في عصر الذكاء الاصطناعي: كاريكاتير عن سباق الذاكرة";
const description = "كاريكاتير ساخر يصور التنافس على شرائح الذاكرة بين مطوري الذكاء الاصطناعي والشركات والمستهلكين، مع شرح رموز المشهد والفرق بين ذاكرة RAM وHBM.";
export const metadata: Metadata = {
  title: "أزمة الرامات والذكاء الاصطناعي",
  description,
  alternates: pageAlternates(path),
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    type: "article",
    url: path,
    publishedTime: "2026-11-08",
    images: [{ url: cover, width: 1200, height: 800, alt: "كاريكاتير بائع الذاكرة وطابور الذكاء الاصطناعي" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [cover] },
};
export default function CaricaturePage() {
  const artwork = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: title,
    description,
    artform: "كاريكاتير تحريري ساخر",
    artMedium: "رسم رقمي ملون بأسلوب حبر الصحف والتهشير",
    image: absoluteUrl(cover),
    url: absoluteUrl(path),
    dateCreated: "2026-11-08",
    inLanguage: "ar",
    creator: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "الكاريكاتير", item: absoluteUrl("/caricatures") },
      { "@type": "ListItem", position: 3, name: "أزمة الرامات", item: absoluteUrl(path) },
    ],
  };
  return (
    <main id="main-content" className={s.page}>
      <div className={s.wrap}>
        <nav className={s.crumb} aria-label="مسار التنقل"><Link href="/caricatures">رئيسية المشروع</Link><span>/</span><Link href="/caricatures">الكاريكاتير</Link><span>/</span><span>أزمة الرامات</span></nav>
        <header className={s.articleHeader}>
          <span className={s.eyebrow}>كاريكاتير تقني · الاقتصاد الرقمي</span>
          <h1 className={s.title}>{title}</h1>
          <p className={s.intro}>في سوق خيالي يزدحم بالمبرمجين وروبوتات الذكاء الاصطناعي، يتحول شريط صغير من الذاكرة إلى سلعة ثمينة يتنافس عليها الجميع. يحوّل العمل فكرة ضغط الطلب على الذاكرة إلى موقف ساخر يسهل فهمه.</p>
          <div className={s.articleMeta}>8 نوفمبر 2026 · إعداد ونشر: فريق موسوعة لوسيل · رسم فني تخييلي</div>
        </header>
        <figure className={s.figure}>
          <Image src={cover} width={1200} height={800} priority alt="كاريكاتير حبر ملون لمتجر رامات وبائع يحمل شريحة RAM وسط طوابير من المبرمجين وروبوت ذكاء اصطناعي أمام ميزان الطلب والعرض" />
        </figure>
        <p className={s.caption}>«أزمة الرامات في عصر الذكاء الاصطناعي» — كاريكاتير ساخر. الشعارات والأسعار والنسب الظاهرة عناصر سردية متخيلة، وليست بيانات أسعار أو نمو موثّقة.</p>
        <a className={s.back} href={cover} target="_blank" rel="noopener noreferrer">فتح الصورة الكاملة</a>
        <div className={s.content}>
          <article className={s.prose}>
            <section id="description">
              <h2>وصف دقيق للمشهد</h2>
              <p>في الجانب الأيمن متجر ضخم يحمل لافتة «الرامات»، وخلف طاولته يقف بائع ذو ابتسامة ساخرة يرفع شريحة ذاكرة خضراء محاطة بإشعاع أصفر. تبدو القطعة صغيرة، لكن مكانتها في المشهد مبالغ فيها حتى تصبح محور اهتمام الجميع. أمام المتجر يقف مطورون يحملون حواسيب وشعارات تقنية، وبجانبهم روبوت بملامح حزينة يمد يديه طالبًا شريحة ذاكرة.</p>
              <p>في أعلى الصورة ميزان كبير: إحدى كفتيه مزدحمة بمكعبات «AI» التي ترمز إلى نماذج الذكاء الاصطناعي ومراكز البيانات، فيما تضم الأخرى شريحة محدودة من الذاكرة. وفي الخلف تظهر رسوم لارتفاع الطلب ولافتات نقص المعروض. يبالغ الرسم في ردود الفعل والأسعار لخلق مفارقة بين حجم الثورة التقنية وصغر المكوّن الذي تعتمد عليه.</p>
            </section>
            <section id="symbols">
              <h2>ماذا ترمز عناصر الكاريكاتير؟</h2>
              <h3>شريحة الذاكرة اللامعة</h3><p>رمز للموارد الحاسوبية التي قد تصبح محور تنافس عندما تتسارع الاستثمارات في الذكاء الاصطناعي.</p>
              <h3>الميزان المختل</h3><p>يعكس التفاوت المحتمل بين الطلب المتنامي وقدرة سلاسل الإنتاج على توفير أنواع الذاكرة اللازمة لتشغيل الأنظمة المتقدمة.</p>
              <h3>الروبوت المتوسل</h3><p>تجسيد ساخر للمفارقة: نظام يوصف بأنه شديد الذكاء، لكنه لا يعمل دون مكونات مادية محدودة وكثيفة الاستهلاك للطاقة والموارد.</p>
              <h3>بائع الرامات</h3><p>شخصية مبالغ فيها تمثل قوة التسعير في سوق يشعر فيه المشترون بضغط الندرة؛ وهي ليست إشارة إلى شركة أو بائع بعينه.</p>
            </section>
            <section id="clarification">
              <h2>هل ذاكرة الذكاء الاصطناعي هي RAM العادية؟</h2>
              <p>تختلف ذاكرة الحواسيب الشخصية مثل DDR4 وDDR5 عن ذاكرة النطاق الترددي العالي (HBM) المستخدمة مع كثير من مسرّعات الذكاء الاصطناعي. كما تستخدم مراكز البيانات أنواعًا أخرى من ذاكرة الخوادم. يختصر الكاريكاتير هذه الأسواق المختلفة في كلمة «رامات» لأغراض السخرية، ولا يعني ذلك أن جميع أنواع الذاكرة تواجه المشكلة نفسها أو ترتفع أسعارها بالمقدار ذاته.</p>
              <p>الأرقام الظاهرة في اللوحة، مثل «+300%» والسعر الدولاري، وضعت ضمن الخيال التحريري ولا تمثل قياسات سوقية أو عروضًا حقيقية. والشعارات التجارية في الخلفية تستخدم للدلالة على قطاع التكنولوجيا، وليس للإشارة إلى أزمة توريد مؤكدة لدى أي شركة بعينها.</p>
            </section>
            <section id="message">
              <h2>الرسالة الأساسية</h2>
              <p>وراء كل نموذج ذكاء اصطناعي ضخم معدات مادية وسلاسل توريد ومصانع متخصصة. فالتقدم البرمجي لا ينفصل عن توافر العتاد، وأحيانًا تظهر حدود الثورة الرقمية في مكوّن أصغر من راحة اليد.</p>
              <p><strong>التعليق المقترح:</strong> «الذكاء الاصطناعي يفكر بالمستقبل… لكنه ينتظر دوره في طابور الرامات!»</p>
            </section>
            <section id="disclosure">
              <h2>تنويه تحريري</h2>
              <p>هذه لوحة كاريكاتيرية أُنشئت بمساعدة أدوات الذكاء الاصطناعي، وتستخدم المبالغة البصرية والأرقام التخيلية لأغراض السخرية. ليست تقريرًا اقتصاديًا، ولا ينبغي الاستناد إلى أسعارها ونسبها لاتخاذ قرارات شراء أو استثمار.</p>
            </section>
            <Link href="/caricatures" className={s.back}>العودة إلى معرض الكاريكاتير</Link>
          </article>
          <aside className={s.side} aria-label="فهرس العمل">
            <strong>محتويات العمل</strong>
            <a href="#description">وصف الصورة</a>
            <a href="#symbols">الرموز الساخرة</a>
            <a href="#clarification">RAM وHBM</a>
            <a href="#message">الرسالة</a>
            <a href="#disclosure">تنويه تحريري</a>
          </aside>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artwork).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
    </main>
  );
}
