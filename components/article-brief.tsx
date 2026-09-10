import Link from "next/link";
import type { Article } from "@/lib/content";
import type { Cluster } from "@/lib/clusters";

export function ArticleBrief({ article, cluster, related }: { article: Article; cluster: Cluster; related: Article[] }) {
  return (
    <div className="article-layout">
      <div className="article-body">
        <div className="brief-box">
          <strong>الإجابة الفورية</strong>
          {article.quickAnswer ? (
            <p>{article.quickAnswer}</p>
          ) : (
            <p>لم تُكتب بعد.</p>
          )}
        </div>

        <div className="brief-box">
          <strong>الملخص</strong>
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
        </div>

        <div className="brief-box">
          <strong>خطوات التنفيذ</strong>
          {article.steps?.length ? (
            <div className="steps-list">
              {article.steps.map((step, i) => (
                <div className="step-item" key={step.title}>
                  <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>يحتاج كاتب فتح البوابة/التطبيق الرسمي فعليًا والتقاط لقطات شاشة حديثة لكل خطوة.</p>
          )}
        </div>

        <div className="brief-box">
          <strong>الأخطاء الشائعة</strong>
          {article.commonMistakes?.length ? (
            <ul>{article.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul>
          ) : (
            <p>—</p>
          )}
        </div>

        <div className="brief-box">
          <strong>المصادر الرسمية</strong>
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
        </div>

        {article.faqs?.length ? (
          <div className="brief-box">
            <strong>الأسئلة الشائعة</strong>
            <ul>{article.faqs.map((faq) => <li key={faq.question}><strong>{faq.question}</strong> — {faq.answer}</li>)}</ul>
          </div>
        ) : null}

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

      <aside className="sidebar">
        <div className="toc">
          <h2>في هذا الدليل</h2>
          <ul className="toc-list">
            <li><a href="#quick-answer">الإجابة الفورية</a></li>
            <li><a href="#summary">الملخص</a></li>
            <li><a href="#steps">خطوات التنفيذ</a></li>
            <li><a href="#mistakes">الأخطاء الشائعة</a></li>
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
