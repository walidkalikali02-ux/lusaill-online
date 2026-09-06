import type { Metadata } from "next";
import { methodologyNotes, winningArticleTemplate } from "@/lib/content";

export const metadata: Metadata = {
  title: "منهج التحرير والمراجعة",
  description: "كيف يبني لوسيل الدقة في محتوى الخدمات الحكومية والمرافق: مصدر رسمي، تاريخ مراجعة، ومراجعة ربع سنوية لكل مقال.",
};

export default function EditorialPolicyPage() {
  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">سياسة التحرير</span>
        <h1>الدقة هنا ليست اختيارية</h1>
        <p className="text-lead">
          رسوم، مواعيد، أرقام هواتف، روابط بوابات — معلومة خاطئة واحدة تكفي لتفقد ثقة القارئ. لهذا نلتزم بمعيار
          واحد لكل مقال قبل نشره.
        </p>

        <div className="method-grid">
          {methodologyNotes.map((note) => (
            <div className="method-card" key={note.title}>
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 50 }}>
          <h2 style={{ fontSize: 26, marginBottom: 20 }}>قالب المقال الفائز</h2>
          <table className="article-table">
            <thead><tr><th>#</th><th>العنصر</th><th>التفاصيل</th></tr></thead>
            <tbody>
              {winningArticleTemplate.map((item, index) => (
                <tr key={item.step}>
                  <td className="num">{index + 1}</td>
                  <td>{item.step}</td>
                  <td className="kw">{item.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-cta">
          <div>
            <strong>جدول مراجعة ربع سنوي</strong>
            <p>كل مقال منشور يُراجَع كل ثلاثة أشهر على الأقل — الرسوم والبوابات والقوانين تتغير، ونحن نتابع.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
