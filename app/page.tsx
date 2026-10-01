import type { Metadata } from "next";
import { GuideSearch } from "@/components/guide-search";
import Link from "next/link";
import { ClusterCard } from "@/components/cluster-card";
import { ArticleCard } from "@/components/article-card";
import { clusters, articles, overallProgress, clusterProgress } from "@/lib/content";
import { guidePaths, getGuidePath } from "@/lib/guide-paths";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

const quickTopics = [
  { label: "مسارات المهام", href: "/guides" },
  { label: "خدمات مصر الرقمية", href: "/categories/bawabat-misr-alraqmeya" },
  { label: "فواتير الكهرباء", href: "/categories/fawatir-alkahraba" },
  { label: "تعلم القيادة", href: "/courses/learn-driving" },
  { label: "أمان حساب Google", href: "/articles/google-backup-codes" },
  { label: "تنظيم Gmail", href: "/articles/gmail-filters" },
];

export const metadata: Metadata = {
  title: "لوسيل | أدلة الخدمات المصرية والحياة الرقمية",
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: { title: "لوسيل | أدلة الخدمات المصرية والحياة الرقمية", description: siteConfig.description, url: "/" },
};

export default function Home() {
  const progress = overallProgress();
  const published = articles.filter((a) => a.status === "published")
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") || b.id - a.id);
  const activeClusters = clusters.filter((cluster) => clusterProgress(cluster.slug).published > 0);
  const featuredSlugs = ["old-rent-housing-apply", "ration-data-update", "vehicle-license-renewal-online", "south-delta-electricity", "google-backup-codes", "android-backup-check"];
  const featured = featuredSlugs.flatMap((slug) => published.filter((a) => a.slug === slug));
  // Keep a single daily batch from displacing all other useful tasks.
  const perPath = new Map<string, number>();
  const latest = published.filter((article) => {
    if (featuredSlugs.includes(article.slug)) return false;
    const key = getGuidePath(article.slug)?.slug ?? article.clusterCode;
    const count = perPath.get(key) ?? 0;
    if (count >= 2) return false;
    perPath.set(key, count + 1);
    return true;
  }).slice(0, 12);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") }],
  };

  return (
    <main id="main-content">
      {/* Hero */}
      <section className="hero">
        <div className="shell">
          <span className="hero-eyebrow">موسوعة عربية للحياة اليومية</span>
          <h1>حلّ مشكلتك اليومية<br /><em>بدليل موثّق.</em></h1>
          <p className="hero-sub">
            نشرح لك الخدمات والإجراءات والمشكلات اليومية بلغة عربية واضحة، مع خطوات عملية تساعدك على معرفة ما يجب فعله بعد ذلك.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/articles">استكشف الأدلة</Link>
            <Link className="button button-secondary" href="/guides">اختر مهمتك</Link>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="search-section">
        <div className="shell">
          <div className="search-box">
            <h2>ما الذي تريد أن تفهمه اليوم؟</h2>
            <p>ابحث عن خدمة، إجراء، مشكلة أو موضوع...</p>
            <GuideSearch items={published.map(({ slug, title, keyword, quickAnswer }) => ({ slug, title, keyword, quickAnswer }))} />
            <div className="quick-topics">
              {quickTopics.map((t) => (
                <Link key={t.href} className="quick-chip" href={t.href}>
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="shell">
          <div className="section-header"><h2>ابدأ من الإجراء الذي تحتاجه</h2><p>أدلة الخدمات الحكومية التالية تخص مصر؛ أدلة الحسابات والهواتف توضح حدود الجهاز والخدمة داخل كل مقال.</p></div>
          <div className="trust-grid">
            <section className="trust-card"><h3>طلب السكن البديل</h3><p>افحص الاستحقاق والمستندات قبل التسجيل، ثم تابع الطلب من القناة الرسمية.</p><Link href="/articles/old-rent-housing-eligibility">شروط الاستحقاق</Link> · <Link href="/articles/old-rent-housing-documents">المستندات</Link> · <Link href="/articles/old-rent-housing-apply">التسجيل</Link> · <Link href="/articles/old-rent-housing-track">المتابعة</Link></section>
            <section className="trust-card"><h3>بطاقة التموين</h3><p>حدد الخدمة المناسبة لحالتك بدل تقديم طلب مختلف عن حاجتك.</p><Link href="/articles/ration-data-update">تحديث البيانات</Link> · <Link href="/articles/ration-family-join">ضم الأسرة</Link> · <Link href="/articles/ration-card-replacement">بدل فاقد وتالف</Link> · <Link href="/articles/ration-card-activation">التفعيل</Link></section>
            <section className="trust-card"><h3>خدمات السيارة والمرور</h3><p>تحقق من المخالفات وشروط الإجراء قبل بدء التجديد أو طلب بدل للرخصة.</p><Link href="/articles/vehicle-violations-inquiry">المخالفات</Link> · <Link href="/articles/vehicle-license-renewal-online">التجديد</Link> · <Link href="/articles/vehicle-license-lost-replacement">بدل فاقد</Link> · <Link href="/entities/egypt-traffic">البوابة الرسمية</Link></section>
          </div>
        </div>
      </section>

      <section className="section"><div className="shell">
        <div className="section-header"><h2>حماية الحسابات والبيانات وحل مشكلات الجهاز</h2><p>مسارات تساعدك على اختيار الإجراء المناسب قبل تغيير إعداداتك أو حذف بياناتك.</p></div>
        <div className="trust-grid">{guidePaths.filter((path) => ["account-security", "android-backup", "chrome-repair"].includes(path.slug)).map((path) => <section className="trust-card" key={path.slug}><h3><Link href={`/guides/${path.slug}`}>{path.title}</Link></h3><p>{path.description}</p></section>)}</div>
        <Link className="button button-secondary" href="/guides">كل مسارات المهام</Link>
      </div></section>

      {/* Learning paths */}
      <section className="section course-home-section">
        <div className="shell course-home-card">
          <div>
            <span className="section-eyebrow">مسار تعليمي جديد</span>
            <h2>تعلّم قيادة السيارة من الصفر</h2>
            <p>ثمانية دروس مترابطة تبدأ من المقعد والمرايا، ثم الانطلاق والتحكم والتقاطعات والوقوف، وتنتهي بالطرق السريعة والطقس السيئ.</p>
          </div>
          <div className="course-home-actions">
            <span><strong>٨</strong> دروس عملية</span>
            <Link className="button button-primary" href="/courses/learn-driving">ابدأ الكورس</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="shell">
          <div className="section-header">
            <span className="section-eyebrow">المعرفة تبدأ من مكان واضح</span>
            <h2>الأبواب الرئيسية</h2>
            <p>اختر المجال الذي تبحث فيه وسنأخذك إلى الأدلة الأكثر فائدة.</p>
          </div>
          <div className="cluster-grid">
            {activeClusters.map((cluster) => (
              <ClusterCard cluster={cluster} key={cluster.slug} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="section section-alt">
        <div className="shell">
          <div className="section-header">
            <span className="section-eyebrow">ابدأ من هنا</span>
            <h2>أدلة تختصر عليك الطريق</h2>
            <p>ابدأ بالإجراء الذي تحتاجه، ثم انتقل إلى الدليل المرتبط بالخطوة التالية.</p>
          </div>
          {published.length > 0 ? (
            <div className="articles-grid">
              {featured.map((article) => (
                <ArticleCard article={article} key={article.slug} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>جاري تجهيز الأدلة</h3>
              <p>نعمل على نشر أول الأدلة العملية قريباً.</p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Guides */}
      {published.length > 6 && (
        <section className="section">
          <div className="shell">
            <div className="section-header">
              <span className="section-eyebrow">أحدث ما نشرناه</span>
              <h2>أحدث الأدلة</h2>
              <p>أدلة حديثة من مسارات مختلفة؛ اختر ما يطابق حاجتك.</p>
            </div>
            <div className="articles-grid">
              {latest.map((article) => (
                <ArticleCard article={article} key={article.slug} />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Link className="button button-secondary" href="/articles">عرض كل الأدلة</Link>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="section section-alt">
        <div className="shell">
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-value">{progress.published}</span>
              <span className="stat-label">دليل عربي</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{activeClusters.length}</span>
              <span className="stat-label">مجالات رئيسية</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">2026</span>
              <span className="stat-label">آخر تحديث للموسوعة</span>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Trust */}
      <section className="section">
        <div className="shell">
          <div className="section-header">
            <span className="section-eyebrow">لماذا لوسيل</span>
            <h2>كيف نكتب أدلة لوسيل؟</h2>
          </div>
          <div className="trust-grid">
            <div className="trust-card">
              <span className="trust-num">١</span>
              <h3>سؤال محدد</h3>
              <p>نحدد المشكلة التي يريد المستخدم حلها — لا مقالات عامة مبثرة.</p>
            </div>
            <div className="trust-card">
              <span className="trust-num">٢</span>
              <h3>سياق ومعلومة</h3>
              <p>نشرح الفكرة ونفصل الحقيقة عن التفسير — مع مصدر رسمي وتاريخ مراجعة.</p>
            </div>
            <div className="trust-card">
              <span className="trust-num">٣</span>
              <h3>تطبيق وحدود</h3>
              <p>نعطي خطوة عملية ونوضح متى يحتاج الأمر إلى جهة رسمية أو مختص.</p>
            </div>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
