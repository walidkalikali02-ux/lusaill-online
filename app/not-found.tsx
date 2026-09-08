import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  description: "الصفحة التي تبحث عنها غير موجودة أو تغيّر رابطها. تصفح مقالاتنا أو عد إلى الصفحة الرئيسية.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main-content">
      <div className="shell not-found">
        <span>٤٠٤</span>
        <h1>هذه الصفحة غير موجودة</h1>
        <p>ربما تغيّر رابط المقال أو لم يُنشر بعد. جرّب البحث في دليل المقالات أو العودة إلى الرئيسية.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
          <Link className="button button-primary" href="/articles">تصفح كل المقالات</Link>
          <Link className="button button-secondary" href="/categories">تصفح التصنيفات</Link>
          <Link className="button button-secondary" href="/">العودة للرئيسية</Link>
        </div>
      </div>
    </main>
  );
}
