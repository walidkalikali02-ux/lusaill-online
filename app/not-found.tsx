import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content">
      <div className="shell not-found">
        <span>٤٠٤</span>
        <h1>هذه الصفحة غير موجودة</h1>
        <p>ربما تغيّر رابط المقال أو لم يُنشر بعد. جرّب البحث في دليل المقالات أو العودة إلى الرئيسية.</p>
        <Link className="button button-primary" href="/articles">تصفح كل المقالات</Link>
      </div>
    </main>
  );
}
