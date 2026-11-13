import Link from "next/link";

const navigation = [["/#company", "عن الشركة"], ["/#projects", "مشاريعنا"], ["/contact", "تواصل معنا"]];

export function SiteHeader() {
  return <header className="site-header identity-header company-header"><div className="shell project-masthead-inner">
    <Link href="/" className="brand" aria-label="شركة لوسيل - الرئيسية"><span className="brand-mark" aria-hidden="true">ل</span><span><strong>شركة لوسيل</strong><small>LUSAILL</small></span></Link>
    <nav aria-label="تنقل الشركة">{navigation.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}</nav>
  </div></header>;
}
