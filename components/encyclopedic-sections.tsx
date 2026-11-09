import Image from "next/image";
import { getEncyclopedicContent } from "@/lib/encyclopedic-content";

export function ArticleEncyclopedicExpansion({ slug }: { slug: string }) {
  const content = getEncyclopedicContent(slug);
  if (!content) return null;
  return (
    <section id="in-depth" className="encyclopedia-expansion">
      <div className="encyclopedia-intro">
        <span className="encyclopedia-eyebrow">توسع معرفي موثّق</span>
        <h2>شرح متعمق بحسب حالة القارئ</h2>
        <p><strong>لمن هذا القسم؟</strong> {content.audience}</p>
        <p><strong>ما الذي نساعدك على إنجازه؟</strong> {content.intent}</p>
        <nav aria-label="فصول الشرح المتعمق" className="encyclopedia-chapters">
          {content.sections.map((section, i) => <a key={section.id} href={`#${section.id}`}><span>{String(i + 1).padStart(2, "0")}</span>{section.title}</a>)}
        </nav>
      </div>
      {content.sections.map((section, index) => <section id={section.id} className="encyclopedia-chapter brief-box" key={section.id}>
        <span className="encyclopedia-chapter-number">الفصل {index + 1}</span>
        <h2>{section.title}</h2>
        {section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        {section.bullets?.length ? <div className="encyclopedia-checkpoints"><h3>نقاط عملية</h3><ul>{section.bullets.map((item, i) => <li key={i}>{item}</li>)}</ul></div> : null}
        {section.illustration && <figure className="encyclopedia-figure">
          <Image unoptimized src={section.illustration.src} alt={section.illustration.alt} width={1200} height={640} sizes="(max-width: 768px) calc(100vw - 32px), 760px"/>
          <figcaption>{section.illustration.caption}</figcaption>
        </figure>}
        {section.sourceUrls?.length ? <div className="encyclopedia-references"><strong>مراجع هذا الفصل:</strong> {section.sourceUrls.map((url, i) => <a href={url} key={url} target="_blank" rel="noopener noreferrer">المصدر {i+1}</a>)}</div> : null}
      </section>)}
      <section className="brief-box encyclopedia-source-index" id="encyclopedic-sources">
        <h2>المصادر الإضافية المستخدمة في البحث</h2>
        <p>هذه المصادر مرتبطة بالفصول أعلاه؛ وُضعت هنا لتسهيل مراجعة القارئ للنص الأصلي، ولا تعني أننا اختبرنا الإجراء على جهازه.</p>
        <ol>{content.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> — تحقق من المصدر: <time dateTime={source.checkedAt}>{source.checkedAt}</time></li>)}</ol>
      </section>
    </section>
  );
}
