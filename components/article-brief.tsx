import Link from "next/link";
import type { Article } from "@/lib/content";
import { winningArticleTemplate } from "@/lib/content";
import type { Cluster } from "@/lib/clusters";
import { StatusBadge } from "@/components/status-badge";

export function ArticleBrief({ article, cluster, related }: { article: Article; cluster: Cluster; related: Article[] }) {
  return (
    <div className="article-layout">
      <div className="article-body">
        <div className="brief-box">
          <strong>١. الإجابة الفورية (أول ٤٠ كلمة)</strong>
          {article.quickAnswer ? (
            <p>{article.quickAnswer}</p>
          ) : (
            <p>لم تُكتب بعد. يجب أن تحتوي الرقم أو الرابط أو الرسم الذي يبحث عنه القارئ عن «{article.keyword}» — لا تُنشر الصفحة قبل التحقق من المصدر الرسمي.</p>
          )}
        </div>

        <div className="brief-box">
          <strong>٢. جدول الملخص</strong>
          {article.summaryTable?.length ? (
            <table className="todo-table">
              <tbody>
                {article.summaryTable.map((row) => (
                  <tr key={row.label}><th>{row.label}</th><td>{row.value}</td></tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="todo-table" aria-hidden="true">
              <tbody>
                <tr><th>الرسوم</th><td>—</td></tr>
                <tr><th>المدة</th><td>—</td></tr>
                <tr><th>الأوراق المطلوبة</th><td>—</td></tr>
                <tr><th>جهة التنفيذ</th><td>—</td></tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="brief-box">
          <strong>٣. خطوات مرقّمة مع لقطات شاشة حقيقية</strong>
          {article.steps?.length ? (
            <ol>
              {article.steps.map((step) => (
                <li key={step.title}><strong>{step.title}</strong> — {step.detail}</li>
              ))}
            </ol>
          ) : (
            <p>يحتاج كاتب فتح البوابة/التطبيق الرسمي فعليًا والتقاط لقطات شاشة حديثة لكل خطوة.</p>
          )}
        </div>

        <div className="brief-box">
          <strong>٤. الأخطاء الشائعة</strong>
          {article.commonMistakes?.length ? (
            <ul>{article.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul>
          ) : (
            <p>مثال: «الموقع لا يفتح»، «الرقم القومي مرفوض» — هذه استعلامات بحث مستقلة بحد ذاتها وتستحق فقرة كل واحدة.</p>
          )}
        </div>

        <div className="brief-box">
          <strong>٥. صندوق المصدر والتاريخ</strong>
          {article.sources?.length ? (
            <ul>
              {article.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a> — آخر تحقق: {source.checkedAt}
                </li>
              ))}
            </ul>
          ) : (
            <p>يجب إضافة رابط الجهة الرسمية وتاريخ آخر تحقق قبل النشر. بدون هذا الصندوق لا يُنشر المقال.</p>
          )}
        </div>

        <div className="brief-box">
          <strong>٦. أسئلة شائعة (FAQPage schema)</strong>
          {article.faqs?.length ? (
            <ul>{article.faqs.map((faq) => <li key={faq.question}><strong>{faq.question}</strong> — {faq.answer}</li>)}</ul>
          ) : (
            <p>أضف فقط الأسئلة الظاهرة فعليًا في نص الصفحة قبل توليد FAQPage schema.</p>
          )}
        </div>
      </div>

      <aside>
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

        <div className="sidebar-box">
          <h2>مقالات العنقود نفسه</h2>
          <ul className="related-list">
            {related.map((item) => (
              <li key={item.slug}><Link href={`/articles/${item.slug}`}>{item.title}</Link></li>
            ))}
          </ul>
        </div>

        <div className="sidebar-box">
          <h2>قالب المقال الفائز</h2>
          <ul>
            {winningArticleTemplate.map((item) => (
              <li key={item.step}>{item.step}</li>
            ))}
          </ul>
        </div>

        <div className="sidebar-box">
          <h2>العنقود</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 13.5 }}>
            <Link href={`/clusters/${cluster.slug}`}>{cluster.name}</Link> — {cluster.approach}
          </p>
        </div>
      </aside>
    </div>
  );
}
