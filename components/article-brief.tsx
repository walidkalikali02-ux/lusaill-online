import Image from "next/image";
import { guideIllustrations } from "@/lib/guide-illustrations";
import Link from "next/link";
import type { Article } from "@/lib/content";
import type { Cluster } from "@/lib/clusters";
import { GuideChecklist } from "./guide-checklist";
import { getGuidePath } from "@/lib/guide-paths";

export function ArticleBrief({ article, cluster, related }: { article: Article; cluster: Cluster; related: Article[] }) {
  const illustration = guideIllustrations[article.slug];
  const path = getGuidePath(article.slug);
  const nextStep = related[0];
  return (
    <div className="article-layout">
      <div className="article-body">
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
                    {illustration?.step === i + 1 && <figure className="guide-figure">
                      <Image src={illustration.src} alt={illustration.alt} width={1200} height={700} sizes="(max-width: 768px) 100vw, 760px" />
                      <figcaption>{illustration.caption} <a href={illustration.sourceUrl} target="_blank" rel="noopener noreferrer">المصدر الرسمي</a></figcaption>
                    </figure>}
                    {step.sourceUrl && <p><a href={step.sourceUrl} target="_blank" rel="noopener noreferrer">مرجع هذه الخطوة</a></p>}
                    {step.relatedLink && <p><Link href={step.relatedLink.href}>{step.relatedLink.label}</Link></p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>يحتاج كاتب فتح البوابة/التطبيق الرسمي فعليًا والتقاط لقطات شاشة حديثة لكل خطوة.</p>
          )}
        </section>

        {article.steps?.length ? <GuideChecklist steps={article.steps.map((step) => step.title)} /> : null}
        {path && <section className="brief-box"><h2>اختر الدليل المناسب لحالتك</h2><p>{path.description}</p><Link href={`/guides/${path.slug}`}>{path.title}</Link></section>}
        <section id="next-step" className="brief-box">
          <h2>الخطوة التالية المرتبطة</h2>
          {nextStep ? <p>إذا كانت هذه هي مهمتك التالية، راجع <Link href={`/articles/${nextStep.slug}`}>{nextStep.title}</Link> قبل بدء الإجراء.</p> : <p>راجع باقي الأدلة في <Link href={`/categories/${cluster.slug}`}>{cluster.name}</Link> واختر ما يناسب حالتك.</p>}
          <p><Link href={`/categories/${cluster.slug}`}>مركز أدلة {cluster.name}</Link>{path && <> · <Link href={`/guides/${path.slug}`}>مسار المهمة كاملًا</Link></>}</p>
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
                  <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a> — آخر تحقق: <time dateTime={source.checkedAt}>{source.checkedAt}</time>
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
              {related.map((item) => (
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
            {article.steps?.length ? <li><a href="#checklist">قائمة متابعة التنفيذ</a></li> : null}
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
