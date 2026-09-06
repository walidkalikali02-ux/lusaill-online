import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="لوسيل - الرئيسية">
          <span className="brand-mark" aria-hidden="true">ل</span>
          <span>
            <strong>لوسيل</strong>
            <small>أدلة الخدمات المصرية اليومية</small>
          </span>
        </Link>
        <nav aria-label="التنقل الرئيسي">
          <Link href="/articles">كل المقالات</Link>
          <Link href="/clusters">العناقيد</Link>
          <Link href="/editorial-policy">منهج التحرير</Link>
          <Link className="nav-cta" href="/about">عن لوسيل</Link>
        </nav>
      </div>
    </header>
  );
}
