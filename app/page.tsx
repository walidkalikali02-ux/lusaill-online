import Link from "next/link";
import { ClusterCard } from "@/components/cluster-card";
import { clusters, overallProgress } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export default function Home() {
  const progress = overallProgress();
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/articles?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
    ],
  };

  return (
    <main id="main-content">
      <section className="hero">
        <div className="shell">
          <span className="hero-eyebrow">موسوعة عربية · {progress.coreTotal} دليل مختار للفهرسة</span>
          <h1>الفكرة بوضوح. والخطوة<br /><em>بعملية.</em></h1>
          <p>{siteConfig.description}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/categories">استكشف الأبواب المختارة</Link>
            <Link className="button button-secondary" href="/editorial-policy">كيف نراجع المحتوى؟</Link>
          </div>
        </div>
      </section>

      <section className="section search-section">
        <div className="shell">
          <div className="search-box">
            <h2>ما الذي تريد أن تفهمه اليوم؟</h2>
            <p>ابحث في الأدلة وال閃وات العملية — رسوم، مواعيد، خطوات، أرقام دعم رسمية.</p>
            <form action="/articles" method="get" className="search-bar">
              <input type="search" name="q" placeholder="مثال: كيف أسدد فاتورة الكهرباء؟" aria-label="بحث في المقالات" />
              <button type="submit" className="button button-primary">ابحث</button>
            </form>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">المعرفة تبدأ من مكان واضح</span>
              <h2>الأبواب الرئيسية</h2>
            </div>
          </div>
          <div className="cluster-grid">
            {clusters.map((cluster) => <ClusterCard cluster={cluster} key={cluster.slug} />)}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--paper-deep)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ابدأ من هنا</span>
              <h2>أدلة تختصر عليك الطريق</h2>
            </div>
          </div>
          <p style={{ color: "var(--muted)", marginBottom: 32, maxWidth: 600 }}>أحدث الأدلة المنشورة مع خطوات عملية وأرقام دعم رسمية.</p>
          <div className="featured-grid">
            <Link href="/articles/فاتورة-الكهرباء" className="featured-card">
              <span className="featured-tag">فواتير الكهرباء</span>
              <h3>شركة جنوب الدلتا — دليل كامل</h3>
              <p>الاستعلام عن الفواتير، السداد أونلاين، الخط الساخن، وأرقام الدعم لكل شركة توزيع.</p>
              <span className="featured-link">اقرأ الدليل ←</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">لماذا لوسيل؟</span>
              <h2>الثقة تبدأ من الشفافية</h2>
            </div>
          </div>
          <div className="trust-grid">
            <div className="trust-card">
              <span className="trust-num">١</span>
              <h3>سؤال محدد</h3>
              <p>كل مقال يبدأ من سؤال واحد واضح يبحث عنه المستخدم — لا مقالات عامة مبعثرة.</p>
            </div>
            <div className="trust-card">
              <span className="trust-num">٢</span>
              <h3>سياق ودليل</h3>
              <p>خطوات عملية، رسوم فعلية، وأرقام دعم رسمية — مع تاريخ آخر تحقق من المصدر.</p>
            </div>
            <div className="trust-card">
              <span className="trust-num">٣</span>
              <h3>تطبيق وحدود</h3>
              <p>نقول ماذا تفعل وماذا لا تفعل — ونوضح متى تحتاج للجهة الرسمية مباشرة.</p>
            </div>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
