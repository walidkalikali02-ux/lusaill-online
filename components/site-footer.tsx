import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <span className="footer-brand">لوسيل</span>
          <p>موسوعة عربية شاملة للخدمات والإجراءات الحكومية — رسوم ومواعيد وخطوات حقيقية مع مصدر رسمي وتاريخ مراجعة.</p>
        </div>
        <div>
          <h2>استكشف</h2>
          <Link href="/articles">دليل المقالات</Link>
          <Link href="/categories">التصنيفات</Link>
          <Link href="/about">عن المشروع</Link>
        </div>
        <div>
          <h2>الثقة</h2>
          <Link href="/editorial-policy">سياسة التحرير والمراجعة</Link>
          <span>مراجعة ربع سنوية لكل مقال منشور</span>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 لوسيل</span>
        <span>محتوى إرشادي عام لا يغني عن مراجعة الجهة الرسمية المختصة.</span>
      </div>
    </footer>
  );
}
