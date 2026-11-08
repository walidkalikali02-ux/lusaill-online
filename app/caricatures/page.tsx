import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { pageAlternates } from "@/lib/page-alternates";
import { absoluteUrl } from "@/lib/site-config";
import s from "./caricatures.module.css";

const gallery = [
  {
    slug: "gaza-flooded-tents",
    title: "غزة حين تغرق الخيام",
    description: "غرق خيام النازحين في مياه الفيضان وسط مدينة مدمرة، وعائلات تحاول حماية أطفالها من المطر والبرد. مشهد إنساني رمزي.",
    image: "/images/caricatures/gaza-flooded-tents.jpg",
    category: "قضايا إنسانية",
    alt: "كاريكاتير ملون لخيام غارقة تحت أمطار غزيرة في غزة، وأم تحمل طفلها وسط مياه الفيضان",
  },
  {
    slug: "ai-ram-crisis",
    title: "أزمة الرامات في عصر الذكاء الاصطناعي",
    description: "بائع يمسك شريحة ذاكرة ثمينة، وطوابير من المبرمجين والشركات وروبوت يائس ينتظرون نصيبهم: مفارقة ساخرة بين الطلب والعرض.",
    image: "/images/caricatures/ai-ram-crisis.jpg",
    category: "تقنية واقتصاد",
    alt: "كاريكاتير لأزمة ذاكرة الحاسوب مع بائع RAM وروبوت ذكاء اصطناعي ومطورين أمام متجر",
  },
] as const;

export const metadata: Metadata = {
  title: "معرض الكاريكاتير | موسوعة لوسيل",
  description: "معرض الكاريكاتير الأصلي في موسوعة لوسيل: صور فنية عن القضايا الإنسانية والاجتماعية والتقنية، مع قراءة الرموز ورسالة كل رسم.",
  alternates: pageAlternates("/caricatures"),
  robots: { index: true, follow: true },
  openGraph: {
    title: "معرض الكاريكاتير | موسوعة لوسيل",
    url: "/caricatures",
    type: "website",
    images: [{ url: "/images/caricatures/gaza-flooded-tents.jpg", width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image", images: ["/images/caricatures/gaza-flooded-tents.jpg"] },
};

export default function CaricatureIndex() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "معرض الكاريكاتير | لوسيل",
    url: absoluteUrl("/caricatures"),
    inLanguage: "ar",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: gallery.length,
      itemListElement: gallery.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: absoluteUrl("/caricatures/" + item.slug),
        image: absoluteUrl(item.image),
      })),
    },
  };
  return (
    <main id="main-content" className={s.page}>
      <div className={s.wrap}>
        <nav className={s.crumb} aria-label="مسار التنقل"><Link href="/">الرئيسية</Link><span>/</span><span>الكاريكاتير</span></nav>
        <section className={s.hero}>
          <div>
            <span className={s.eyebrow}>رسوم تحكي ما وراء الخبر</span>
            <h1>الكاريكاتير في موسوعة لوسيل</h1>
            <p>مساحة للرسوم التحريرية الأصلية التي تطرح قضايا إنسانية واجتماعية وتقنية بأسلوب ساخر ومعبر. ننشر الصورة الفعلية لكل عمل مع شرح دلالاتها، ونوضح متى تكون المشاهد والأرقام رمزية وليست توثيقًا للأحداث.</p>
            <Link className={s.action} href="/caricatures/gaza-flooded-tents">شاهد: غزة حين تغرق الخيام</Link>
          </div>
          <figure className={s.figure}>
            <Link href="/caricatures/gaza-flooded-tents" aria-label="شاهد كاريكاتير غزة حين تغرق الخيام">
              <Image src="/images/caricatures/gaza-flooded-tents.jpg" width={1200} height={800} priority alt={gallery[0].alt} />
            </Link>
          </figure>
        </section>
        <section aria-label="الأعمال المنشورة">
          <h2 className={s.sectionTitle}>الأعمال المنشورة</h2>
          <div className={s.artGrid}>
            {gallery.map((item) => (
              <Link className={s.artCard} href={"/caricatures/" + item.slug} key={item.slug}>
                <Image src={item.image} width={1200} height={800} alt={item.alt} />
                <div className={s.artCopy}>
                  <span className={s.date}>{item.category} · 8 نوفمبر 2026</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    </main>
  );
}
