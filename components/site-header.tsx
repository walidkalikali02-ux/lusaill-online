import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="لوسيل - الرئيسية">
          <span className="brand-mark" aria-hidden="true">ل</span>
          <span>
            <strong>لوسيل</strong>
            <small>دليل عربي موثوق للحياة اليومية</small>
          </span>
        </Link>
        <nav aria-label="التنقل الرئيسي">
          <Link href="/articles">كل المقالات</Link>
          <Link href="/categories">التصنيفات</Link>
          <Link href="/editorial-policy">منهج التحرير</Link>
          <Link className="nav-cta" href="/about">عن الموسوعة</Link>
        </nav>
      </div>
    </header>
  );
}
