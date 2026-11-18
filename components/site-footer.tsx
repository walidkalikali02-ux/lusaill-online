import Link from "next/link";
import { LusailMark } from "./lusail-mark";

export function SiteFooter() {
  return <footer className="site-footer"><div className="shell project-masthead-inner">
    <Link className="project-brand" href="/"><LusailMark size={36} light className="project-brand-icon" /><span className="project-brand-wordmark"><strong>لوسيل</strong><small>المعرفة والخدمات والمشاريع</small></span></Link>
    <nav aria-label="روابط الشركة"><Link href="/#company">عن الشركة</Link><Link href="/#projects">المشاريع</Link><Link href="/contact">تواصل معنا</Link><Link href="/privacy">الخصوصية</Link><Link href="/terms">شروط الاستخدام</Link></nav>
  </div></footer>;
}
