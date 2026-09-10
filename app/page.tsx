"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ClusterCard } from "@/components/cluster-card";
import { ArticleCard } from "@/components/article-card";
import { clusters, articles, overallProgress } from "@/lib/content";

const quickTopics = [
  { label: "خدمات حكومية", q: "خدمات حكومية" },
  { label: "فواتير الكهرباء", q: "فاتورة كهرباء" },
  { label: "رخص القيادة", q: "رخصة قيادة" },
  { label: "حماية المستهلك", q: "حماية المستهلك" },
  { label: "عقود الإيجار", q: "عقد إيجار" },
  { label: "شهادة الميلاد", q: "شهادة ميلاد" },
];

export default function Home() {
  const progress = overallProgress();
  const [query, setQuery] = useState("");

  const published = useMemo(
    () => articles.filter((a) => a.status === "published"),
    [],
  );

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim();
    return articles
      .filter(
        (a) =>
          a.title.includes(q) ||
          a.keyword.includes(q) ||
          a.quickAnswer?.includes(q),
      )
      .slice(0, 6);
  }, [query]);

  return (
    <main id="main-content">
      <section className="hero">
        <div className="shell">
          <span className="hero-eyebrow">موسوعة عربية للحياة اليومية</span>
          <h1>الفكرة بوضوح. والخطوة<br /><em>بعملية.</em></h1>
          <p className="hero-sub">
            نشرح لك الخدمات والإجراءات والمشكلات اليومية بلغة عربية واضحة، مع خطوات عملية تساعدك على معرفة ما يجب فعله بعد ذلك.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/categories">استكشف الأدلة</Link>
            <Link className="button button-secondary" href="/categories">تصفح التصنيفات</Link>
          </div>
        </div>
      </section>

      <section className="search-section">
        <div className="shell">
          <div className="search-box">
            <h2>ما الذي تريد أن تفهمه اليوم؟</h2>
            <p>ابحث عن خدمة، إجراء، مشكلة أو موضوع...</p>
            <div className="search-bar">
              <input
                type="search"
                placeholder="ابحث عن خدمة، إجراء، مشكلة أو موضوع..."
                aria-label="بحث في الأدلة"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="search-bar-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </span>
              {query.trim() && (
                <div className={`search-suggestions ${suggestions.length ? "active" : ""}`}>
                  {suggestions.length ? (
                    suggestions.map((a) => (
                      <Link key={a.slug} className="search-suggestion" href={`/articles/${a.slug}`} onClick={() => setQuery("")}>
                        <div className="search-suggestion-title">{a.title}</div>
                        <div className="search-suggestion-meta">{a.keyword}</div>
                      </Link>
                    ))
                  ) : (
                    <div className="search-suggestion">
                      <div className="search-suggestion-title">لم نجد نتيجة</div>
                      <div className="search-suggestion-meta">جرّب كلمات أبسط أو تصفح التصنيفات</div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="quick-topics">
              {quickTopics.map((t) => (
                <Link key={t.q} className="quick-chip" href={`/articles?q=${encodeURIComponent(t.q)}`}>
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-header">
            <span className="section-eyebrow">المعرفة تبدأ من مكان واضح</span>
            <h2>الأبواب الرئيسية</h2>
            <p>اختر المجال الذي تبحث فيه وسنأخذك إلى الأدلة الأكثر فائدة.</p>
          </div>
          <div className="cluster-grid">
            {clusters.map((cluster) => (
              <ClusterCard cluster={cluster} key={cluster.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="shell">
          <div className="section-header">
            <span className="section-eyebrow">ابدأ من هنا</span>
            <h2>أدلة تختصر عليك الطريق</h2>
            <p>أدلة مختارة تساعدك في أكثر الأسئلة والمواقف شيوعًا.</p>
          </div>
          {published.length > 0 ? (
            <div className="articles-grid">
              {published.slice(0, 6).map((article) => (
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

      <section className="section">
        <div className="shell">
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-value">{progress.total}+</span>
              <span className="stat-label">دليل عربي</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{clusters.length}</span>
              <span className="stat-label">مجالات رئيسية</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">2026</span>
              <span className="stat-label">آخر تحديث للموسوعة</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
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
    </main>
  );
}
