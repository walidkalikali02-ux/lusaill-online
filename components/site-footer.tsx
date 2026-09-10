import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <span className="footer-brand">لوسيل</span>
          <p>دليل عربي موثوق للحياة اليومية — رسوم ومواعيد وخطوات حقيقية مع مصدر رسمي وتاريخ مراجعة.</p>
        </div>
        <div>
          <h2>استكشف</h2>
          <Link href="/articles">دليل المقالات</Link>
          <Link href="/categories">الأبواب الرئيسية</Link>
          <Link href="/about">عن المشروع</Link>
          <Link href="/editorial-policy">سياسة التحرير والمراجعة</Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 لوسيل</span>
        <span>آخر تحديث: سبتمبر ٢٠٢٦</span>
      </div>
    </footer>
  );
}
