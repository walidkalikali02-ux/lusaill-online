import Link from "next/link";
import type { Article } from "@/lib/content";
import type { Cluster } from "@/lib/clusters";

export function ArticleBrief({ article, cluster, related }: { article: Article; cluster: Cluster; related: Article[] }) {
  return (
    <div className="article-layout">
      <div className="article-body">
        {/* Quick Answer */}
        <section id="quick-answer" className="brief-box">
          <h2>الإجابة الفورية</h2>
          {article.quickAnswer ? (
            <p>{article.quickAnswer}</p>
          ) : (
            <p>لم تُكتب بعد.</p>
          )}
        </section>

        {/* Summary Table */}
        <section id="summary" className="brief-box">
          <h2>الملخص</h2>
          {article.summaryTable?.length ? (
            <table className="todo-table">
              <tbody>
                {article.summaryTable.map((row) => (
                  <tr key={row.label}><th>{row.label}</th><td>{row.value}</td></tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>—</p>
          )}
        </section>

        {/* Steps */}
        <section id="steps" className="brief-box">
          <h2>خطوات التنفيذ</h2>
          {article.steps?.length ? (
            <div className="steps-list">
              {article.steps.map((step, i) => (
                <div className="step-item" id={`step-${i + 1}`} key={step.title}>
                  <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>يحتاج كاتب فتح البوابة/التطبيق الرسمي فعليًا والتقاط لقطات شاشة حديثة لكل خطوة.</p>
          )}
        </section>

        {/* Common Mistakes */}
        {article.commonMistakes?.length ? (
          <section id="mistakes" className="brief-box callout callout-warning">
            <div className="callout-title">الأخطاء الشائعة</div>
            <ul>{article.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ) : null}

        {/* Sources */}
        <section id="sources" className="brief-box">
          <h2>المصادر الرسمية</h2>
          {article.sources?.length ? (
            <ul>
              {article.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a> — آخر تحقق: {source.checkedAt}
                </li>
              ))}
            </ul>
          ) : (
            <p>يجب إضافة رابط الجهة الرسمية وتاريخ آخر تحقق قبل النشر.</p>
          )}
        </section>

        {/* FAQs */}
        {article.faqs?.length ? (
          <section id="faq" className="brief-box">
            <h2>الأسئلة الشائعة</h2>
            <ul>{article.faqs.map((faq) => <li key={faq.question}><strong>{faq.question}</strong> — {faq.answer}</li>)}</ul>
          </section>
        ) : null}

        {/* Related Guides */}
        {related.length > 0 && (
          <div className="related-section">
            <h2>قد يفيدك أيضًا</h2>
            <div className="related-grid">
              {related.slice(0, 3).map((item) => (
                <Link key={item.slug} className="article-card" href={`/articles/${item.slug}`}>
                  <h3>{item.title}</h3>
                  <p className="article-card-desc">{item.keyword}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop TOC */}
      <aside className="sidebar">
        <div className="toc">
          <h2>في هذا الدليل</h2>
          <ul className="toc-list">
            <li><a href="#quick-answer">الإجابة الفورية</a></li>
            <li><a href="#summary">الملخص</a></li>
            <li><a href="#steps">خطوات التنفيذ</a></li>
            {article.commonMistakes?.length ? <li><a href="#mistakes">الأخطاء الشائعة</a></li> : null}
            <li><a href="#sources">المصادر الرسمية</a></li>
            {article.faqs?.length ? <li><a href="#faq">الأسئلة الشائعة</a></li> : null}
          </ul>
        </div>

        <div className="sidebar-box" style={{ marginTop: 16 }}>
          <h2>التصنيف</h2>
          <p style={{ margin: 0, fontSize: 13.5 }}>
            <Link href={`/categories/${cluster.slug}`}>{cluster.name}</Link>
          </p>
        </div>
      </aside>
    </div>
  );
}
