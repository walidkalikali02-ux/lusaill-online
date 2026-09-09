import Link from "next/link";
import type { Article } from "@/lib/content";
import type { Cluster } from "@/lib/clusters";
import { StatusBadge } from "@/components/status-badge";

export function ArticleBrief({ article, cluster, related }: { article: Article; cluster: Cluster; related: Article[] }) {
  const isDraft = article.status !== "published";

  return (
    <div className="article-layout">
      <div className="article-body">
        <section className="brief-box" aria-label="الإجابة الفورية">
          <strong>الإجابة الفورية</strong>
          {article.quickAnswer ? (
            <p>{article.quickAnswer}</p>
          ) : isDraft ? (
            <p>لم تُكتب بعد. يجب أن تحتوي الرقم أو الرابط أو الرسم الذي يبحث عنه القارئ عن «{article.keyword}» — لا تُنشر الصفحة قبل التحقق من المصدر الرسمي.</p>
          ) : null}
        </section>

        <section className="brief-box" aria-label="جدول الملخص">
          <strong>الملخص</strong>
          {article.summaryTable?.length ? (
            <table className="todo-table">
              <tbody>
                {article.summaryTable.map((row) => (
                  <tr key={row.label}><th>{row.label}</th><td>{row.value}</td></tr>
                ))}
              </tbody>
            </table>
          ) : isDraft ? (
            <table className="todo-table" aria-hidden="true">
              <tbody>
                <tr><th>الرسوم</th><td>—</td></tr>
                <tr><th>المدة</th><td>—</td></tr>
                <tr><th>الأوراق المطلوبة</th><td>—</td></tr>
                <tr><th>جهة التنفيذ</th><td>—</td></tr>
              </tbody>
            </table>
          ) : null}
        </section>

        <section className="brief-box" aria-label="خطوات التنفيذ">
          <strong>خطوات التنفيذ</strong>
          {article.steps?.length ? (
            <ol>
              {article.steps.map((step) => (
                <li key={step.title}><strong>{step.title}</strong> — {step.detail}</li>
              ))}
            </ol>
          ) : isDraft ? (
            <p>يحتاج كاتب فتح البوابة/التطبيق الرسمي فعليًا والتقاط لقطات شاشة حديثة لكل خطوة.</p>
          ) : null}
        </section>

        <section className="brief-box" aria-label="الأخطاء الشائعة">
          <strong>الأخطاء الشائعة</strong>
          {article.commonMistakes?.length ? (
            <ul>{article.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul>
          ) : isDraft ? (
            <p>مثال: «الموقع لا يفتح»، «الرقم القومي مرفوض» — هذه استعلامات بحث مستقلة بحد ذاتها وتستحق فقرة كل واحدة.</p>
          ) : null}
        </section>

        <section className="brief-box" aria-label="المصادر الرسمية">
          <strong>المصادر الرسمية</strong>
          {article.sources?.length ? (
            <ul>
              {article.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a> — آخر تحقق: {source.checkedAt}
                </li>
              ))}
            </ul>
          ) : isDraft ? (
            <p>يجب إضافة رابط الجهة الرسمية وتاريخ آخر تحقق قبل النشر. بدون هذا الصندوق لا يُنشر المقال.</p>
          ) : null}
        </section>

        <section className="brief-box" aria-label="الأسئلة الشائعة">
          <strong>الأسئلة الشائعة</strong>
          {article.faqs?.length ? (
            <ul>{article.faqs.map((faq) => <li key={faq.question}><strong>{faq.question}</strong> — {faq.answer}</li>)}</ul>
          ) : isDraft ? (
            <p>أضف فقط الأسئلة الظاهرة فعليًا في نص الصفحة قبل توليد FAQPage schema.</p>
          ) : null}
        </section>

        <section className="brief-box" aria-label="روابط داخلية" style={{ marginTop: 24, padding: "16px 20px", background: "var(--paper-deep)", borderRadius: 8, border: "1px solid var(--line)" }}>
          <strong>مقالات ذات صلة</strong>
          {related.length > 0 && (
            <ul style={{ margin: "8px 0 0", fontSize: 14 }}>
              {related.map((item) => (
                <li key={item.slug}><Link href={`/articles/${item.slug}`}>{item.title}</Link></li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <aside>
        <div className="sidebar-box">
          <h2>التصنيف</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 13.5 }}>
            <Link href={`/categories/${cluster.slug}`}>{cluster.name}</Link>
          </p>
        </div>

        {isDraft && (
          <div className="sidebar-box">
            <h2>بيانات الكلمة المفتاحية</h2>
            <ul>
              <li>الكلمة الأساسية: {article.keyword}</li>
              <li>الحجم الشهري التقريبي: {article.volume.toLocaleString("ar-EG")}</li>
              <li>الصعوبة (KD): {article.kd ?? "غير متوفر"}</li>
              <li>الشهر المستهدف: {article.month}</li>
              <li>الحالة: <StatusBadge status={article.status} /></li>
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
