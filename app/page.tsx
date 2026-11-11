import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { SiteIcon } from "@/components/site-icon";
import { articles } from "@/lib/content";
import { pageAlternates } from "@/lib/page-alternates";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: "لوسيل | أدلة الخدمات المصرية والكهرباء والمرور" },
  description: siteConfig.description,
  alternates: pageAlternates("/"),
  openGraph: {
    title: "لوسيل | أدلة الخدمات المصرية والكهرباء والمرور",
    description: siteConfig.description,
    url: "/",
  },
};
export const revalidate = 3600;

const serviceCategories = [
  { title: "فواتير الكهرباء والعدادات", detail: "اختيار شركة التوزيع، الاستعلام عن الفاتورة، تسجيل القراءة، الشكاوى والسداد.", href: "/categories/fawatir-alkahraba", lead: "/articles/electricity-bill-inquiry", cta: "ابدأ بدليل الفواتير" },
  { title: "السجل المدني والوثائق", detail: "شهادة الميلاد وبطاقة الرقم القومي وتصحيح القيود وجواز السفر.", href: "/categories/shehadat-almilad-walsijil-almadani", lead: "/articles/automated-birth-certificate", cta: "طريقة استخراج شهادة الميلاد" },
  { title: "رخص القيادة والمرور", detail: "المستندات المطلوبة للرخص وخدمات المركبات والمخالفات.", href: "/categories/rokhas-alqiyada-walmoror", lead: "/articles/private-driving-license-first-time", cta: "دليل الرخصة لأول مرة" },
  { title: "مصر الرقمية والتموين", detail: "بطاقة التموين، حساب مصر الرقمية والخدمات الإلكترونية الرسمية.", href: "/categories/bawabat-misr-alraqmeya", lead: "/articles/ration-data-update", cta: "راجع تحديث بيانات التموين" },
] as const;

const electricityPeers = [
  { slug: "north-cairo-electricity", title: "كهرباء شمال القاهرة" },
  { slug: "south-cairo-electricity", title: "كهرباء جنوب القاهرة" },
  { slug: "north-delta-electricity", title: "كهرباء شمال الدلتا" },
  { slug: "south-delta-electricity", title: "كهرباء جنوب الدلتا" },
  { slug: "alexandria-electricity", title: "كهرباء الإسكندرية" },
] as const;

export default function Home() {
  const featuredSlugs = ["electricity-bill-inquiry", "north-cairo-electricity", "automated-birth-certificate", "private-driving-license-first-time"];
  const featured = featuredSlugs.map(slug => articles.find(article => article.slug === slug)).filter((article): article is (typeof articles)[number] => Boolean(article));
  const websiteSchema = {
    "@context": "https://schema.org", "@type": "WebSite",
    "@id": siteConfig.url + "/#website", url: siteConfig.url,
    name: siteConfig.name, description: siteConfig.description,
    inLanguage: siteConfig.language, publisher: { "@id": siteConfig.url + "/#organization" },
  };

  return <main id="main-content" className="magazine-home">
    <section className="hero identity-hero"><div className="shell identity-hero-grid">
      <div className="identity-intro">
        <span className="hero-eyebrow">أدلة عملية للخدمات المصرية</span>
        <h1>خدمتك في مصر،<br/><em>بخطوات أوضح.</em></h1>
        <p className="hero-sub">اشرح مشكلة الفاتورة أو الرخصة أو الوثيقة التي تحتاجها. لوسيل يقدم أدلة مستقلة بروابط للمصادر الرسمية؛ تقديم الطلبات والدفع يتم لدى الجهات المختصة.</p>
        <div className="search-section">
          <form className="search-bar" role="search" action="/search" method="get">
            <input name="q" type="search" maxLength={200} aria-label="ابحث في أدلة الخدمات المصرية" placeholder="مثال: الاستعلام عن فاتورة الكهرباء" />
            <button type="submit" className="button button-primary search-submit">بحث</button>
          </form>
        </div>
        <p className="identity-intro-note">مصادر رسمية، خطوات واضحة، وحدود موضّحة للمعلومة.</p>
      </div>
      <aside className="identity-taskboard" aria-labelledby="home-priority-title">
        <div className="taskboard-heading"><span>ابدأ من هنا</span><h2 id="home-priority-title">الخدمات الأكثر طلبًا</h2></div>
        <div className="identity-tasks">
          {serviceCategories.map(service => <Link href={service.lead} key={service.href}>
            <SiteIcon name="document" width="22" height="22"/>
            <strong>{service.title}</strong><span>{service.cta}</span>
            <SiteIcon name="arrow" width="16" height="16"/>
          </Link>)}
        </div>
        <Link className="taskboard-all" href="/articles">استعرض جميع الأدلة <SiteIcon name="arrow" width="16"/></Link>
      </aside>
    </div></section>
    <div className="shell home-editorial-wrap">
      <section className="browse-section" aria-labelledby="service-categories-heading">
        <div className="editorial-section-heading"><h2 id="service-categories-heading">اختر نوع الخدمة</h2><Link href="/categories">كل التصنيفات <SiteIcon name="arrow" width="16"/></Link></div>
        <div className="trust-grid">{serviceCategories.map(service => <div className="trust-card" key={service.href}>
          <h3><Link href={service.href}>{service.title}</Link></h3><p>{service.detail}</p>
          <p><Link href={service.lead}>{service.cta}</Link></p>
        </div>)}</div>
      </section>
      <section className="identity-feature" aria-labelledby="home-guides-heading">
        <div className="editorial-section-heading"><div><span className="identity-kicker">ابدأ بالدليل المناسب</span><h2 id="home-guides-heading">أدلة عملية موثقة</h2></div><Link href="/articles">جميع الأدلة <SiteIcon name="arrow" width="16"/></Link></div>
        <div className="identity-feature-grid">{featured.map((article,index) => <ArticleCard key={article.slug} article={article} priority={index===0}/>)}</div>
      </section>
      <section className="browse-section" aria-labelledby="electricity-companies-heading">
        <div className="editorial-section-heading"><h2 id="electricity-companies-heading">شركات توزيع الكهرباء في مصر</h2><Link href="/articles/electricity-bill-inquiry">دليل الفواتير والشركات <SiteIcon name="arrow" width="16"/></Link></div>
        <p>تأكد أولًا من اسم الشركة المطبوع على فاتورتك، ثم استخدم دليلها؛ طرق الاستعلام ورقم المشترك قد تختلف من شركة لأخرى.</p>
        <div className="category-ribbon">{electricityPeers.map(company => <Link key={company.slug} href={`/articles/${company.slug}`}><SiteIcon name="bolt" width="22"/><strong>{company.title}</strong></Link>)}</div>
      </section>
      <section className="editorial-method">
        <div><span className="section-eyebrow">كيف نعدّ المعلومات؟</span><h2>محتوى عملي قابل للمراجعة</h2><Link href="/editorial-policy">منهج التحرير والمصادر</Link></div>
        <ol>
          <li><span>01</span><strong>إجابة مباشرة</strong><p>ما الإجراء المناسب لحالتك؟</p></li>
          <li><span>02</span><strong>المصدر الرسمي</strong><p>اذهب إلى الجهة الصحيحة قبل إدخال بياناتك أو الدفع.</p></li>
          <li><span>03</span><strong>تحديث وتصحيح</strong><p>راجع تاريخ التحقق وأبلغنا إن تغيّر الإجراء.</p></li>
        </ol>
      </section>
      <section className="home-faq">
        <h2>موسوعة لوسيل</h2>
        <p>لوسيل موقع مستقل، وليس بوابة حكومية. وإذا كنت تبحث عن العلوم أو التعليم أو التقنية، يمكنك الوصول إلى <Link href="/knowledge">المعارف والأدوات</Link> أو <Link href="/topics">جميع موضوعات الموسوعة</Link>.</p>
      </section>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c") }} />
  </main>;
}
