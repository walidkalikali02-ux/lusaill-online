import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <span className="footer-brand">لوسيل</span>
          <p>دليل عربي عملي يساعدك على فهم الخدمات والإجراءات والمشكلات اليومية بلغة واضحة وخطوات عملية.</p>
        </div>
        <div>
          <h2>استكشف</h2>
          <Link href="/articles">كل الأدلة</Link>
          <Link href="/courses/learn-driving">كورس تعلم القيادة</Link>
          <Link href="/categories">التصنيفات</Link>
          <Link href="/entities">الجهات والخدمات</Link>
          <Link href="/articles">أحدث الأدلة</Link>
        </div>
        <div>
          <h2>عن لوسيل</h2>
          <Link href="/about">عن المشروع</Link>
          <Link href="/editorial-policy">منهج التحرير</Link>
          <Link href="/editorial-policy">سياسة المراجعة</Link>
          <Link href="/authors/editorial-team">فريق التحرير</Link>
        </div>
        <div>
          <h2>قانوني</h2>
          <Link href="/privacy">الخصوصية</Link>
          <Link href="/terms">الشروط</Link>
          <Link href="/contact">تواصل معنا</Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 لوسيل</span>
        <span>آخر تحديث: سبتمبر ٢٠٢٦</span>
      </div>
    </footer>
  );
}
