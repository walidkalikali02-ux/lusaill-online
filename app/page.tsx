import Link from "next/link";
import { ClusterCard } from "@/components/cluster-card";
import { clusters, overallProgress, trafficProjection } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  const progress = overallProgress();
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "ar",
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };

  return (
    <main id="main-content">
      <section className="hero">
        <div className="shell">
          <span className="hero-eyebrow">خدمات {siteConfig.market} · {siteConfig.searchEngine}</span>
          <h1>الرسم، الرابط، والخطوة —<br /><em>مباشرة من المصدر الرسمي.</em></h1>
          <p>{siteConfig.description}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/articles">استكشف خطة المقالات</Link>
            <Link className="button button-secondary" href="/editorial-policy">منهج الدقة والمراجعة</Link>
          </div>
          <div className="stat-row">
            <div><b>{progress.coreTotal}</b><span>مقالاً في الموجة الأولى</span></div>
            <div><b>{clusters.length}</b><span>عناقيد كلمات مفتاحية</span></div>
            <div><b>{progress.corePublished}/{progress.coreTotal}</b><span>منشور حتى الآن</span></div>
            <div><b>١٠٠ ألف</b><span>هدف الزيارات خلال ٦ أشهر</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">خطة الأشهر الستة</span>
              <h2>عناقيد الكلمات المفتاحية</h2>
            </div>
            <p>كل عنقود مبني حول نية بحث محددة: صفحة ركيزة، ثم صفحات فرعية دقيقة لكل جمهور بحث.</p>
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
              <span className="eyebrow">توقّع الزيارات</span>
              <h2>الطريق إلى ١٠٠ ألف زائر شهريًا</h2>
            </div>
            <p>بافتراض إصلاح مشكلات الأرشفة، ٢٠ مقالاً شهريًا بجودة حقيقية، وبناء روابط تدريجي.</p>
          </div>
          <table className="plan-table">
            <thead>
              <tr><th>الشهر</th><th>المقالات المنشورة</th><th>الزيارات المتوقعة</th></tr>
            </thead>
            <tbody>
              {trafficProjection.map((row) => (
                <tr key={row.month}>
                  <td>{row.month}</td>
                  <td>{row.publishedTarget}+</td>
                  <td>{row.expectedVisits.toLocaleString("ar-EG")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </main>
  );
}
