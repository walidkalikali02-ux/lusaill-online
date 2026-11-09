import Link from "next/link";
import type { VerifiedServiceHub } from "@/lib/verified-service-hubs";

const textColor = { color: "#24415a", lineHeight: 1.95 } as const;

export function VerifiedServiceHubContent({ hub, slugs }: { hub: VerifiedServiceHub; slugs: Set<string> }) {
  return <article aria-label={hub.title}>
    <section className="brief-box" aria-labelledby="decision-intro">
      <p style={{ fontWeight: 700, color: "#0c6a6b", marginBottom: 8 }}>{hub.eyebrow}</p>
      <h2 id="decision-intro">من أين تبدأ؟</h2>
      <p style={textColor}>{hub.intro}</p>
      <p role="note" style={{ fontSize: 14, color: "#7b4100" }}>تنويه تحريري: المصادر روابط رسمية مرجعية، لكن قد تتغير واجهات الخدمات والرسوم والمواعيد. لا نقدم صور شاشة أو تجربة تقديم فعلية لم نتحقق منها، ولا ننسب المحتوى لمراجع حكومي أو مختص بشري دون توثيق.</p>
    </section>

    <section aria-labelledby="decision-choices" style={{ marginBlock: 28 }}>
      <h2 id="decision-choices">اختر معاملتك حسب حالتك</h2>
      <p style={textColor}>بدل قراءة عدة مقالات متشابهة دون معرفة أيها ينطبق عليك، ابدأ من الحالة المكتوبة أدناه ثم انتقل إلى الدليل المتخصص عند الحاجة.</p>
      <div className="trust-grid">{hub.choices.filter((choice) => slugs.has(choice.slug)).map((choice) =>
        <section key={choice.slug} className="trust-card">
          <h3>{choice.when}</h3>
          <p style={textColor}>{choice.detail}</p>
          <p><Link href={`/articles/${choice.slug}`}>{choice.label}</Link></p>
        </section>)}</div>
    </section>

    <section className="brief-box" aria-labelledby="service-facts">
      <h2 id="service-facts">معلومات موثقة وحدودها</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 570, textAlign: "start" }}>
          <thead><tr><th scope="col" style={{ padding: 12, borderBottom: "2px solid #d9e4ee" }}>السؤال</th><th scope="col" style={{ padding: 12, borderBottom: "2px solid #d9e4ee" }}>ما الذي نعرفه؟</th><th scope="col" style={{ padding: 12, borderBottom: "2px solid #d9e4ee" }}>المصدر</th></tr></thead>
          <tbody>{hub.factRows.map((fact) => <tr key={fact.label}>
            <th scope="row" style={{ padding: 12, verticalAlign: "top", borderBottom: "1px solid #e2e8f0" }}>{fact.label}</th>
            <td style={{ padding: 12, verticalAlign: "top", borderBottom: "1px solid #e2e8f0", ...textColor }}>{fact.value}</td>
            <td style={{ padding: 12, verticalAlign: "top", borderBottom: "1px solid #e2e8f0" }}>
              <a href={hub.references[fact.source].url} target="_blank" rel="noopener noreferrer">مرجع رسمي</a>
            </td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>

    <section aria-label="الخطوات والقرارات الأساسية" style={{ marginBlock: 32 }}>
      {hub.sections.map((section, index) => <section key={section.heading} className="brief-box" style={{ marginBottom: 16 }}>
        <h2>{section.heading}</h2><p style={textColor}>{section.body}</p>
        {index === 0 ? <p style={{ fontSize: 13 }}><a href="#official-references">انتقل إلى المصادر الرسمية</a></p> : null}
      </section>)}
    </section>

    <section className="brief-box" aria-labelledby="mistakes-to-avoid">
      <h2 id="mistakes-to-avoid">أخطاء يجب تجنبها قبل التقديم</h2>
      <ul style={{ paddingInlineStart: 26, ...textColor }}>{hub.pitfalls.map((text) => <li key={text} style={{ marginBottom: 7 }}>{text}</li>)}</ul>
    </section>
    <section className="brief-box" id="official-references" aria-labelledby="official-references-heading" style={{ marginBlock: 22 }}>
      <h2 id="official-references-heading">المراجع الرسمية المرتبطة بهذا الدليل</h2>
      <p style={textColor}>هذه روابط مرجعية للجهات المختصة وليست إثباتًا بأننا فتحنا حسابًا أو أنجزنا معاملة. إذا تعذّر فتح رابط، ادخل إلى البوابة الرئيسية للجهة وابحث عن اسم الخدمة.</p>
      <ul style={{ paddingInlineStart: 26 }}>{hub.references.map((source) => <li key={source.url} style={{ marginBlock: 8 }}>
        <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
      </li>)}</ul>
      <p><Link href="/contact">أبلغ عن معلومة أو رابط يحتاج تحديثًا</Link></p>
    </section>
  </article>;
}
