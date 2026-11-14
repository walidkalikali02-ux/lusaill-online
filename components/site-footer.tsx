import Link from "next/link";

const groups: { title: string; links: [string, string][] }[] = [
  { title: "الشركة", links: [["/#company", "عن الشركة"], ["/#projects", "المشاريع"], ["/contact", "تواصل معنا"]] },
  { title: "المشاريع", links: [["/knowledge", "موسوعة لوسيل"], ["/articles", "الأدلة العملية"], ["/courses", "لوسيل تعلّم"], ["/services", "خدمات لوسيل"], ["/caricatures", "كاريكاتير لوسيل"]] },
  { title: "السياسات", links: [["/editorial-policy", "منهج التحرير"], ["/privacy", "الخصوصية"], ["/terms", "شروط الاستخدام"]] },
];

export function SiteFooter() {
  return <footer className="site-footer ds-footer"><div className="shell">
    <div className="ds-footer-top">
      <Link className="ds-footer-brand" href="/"><span className="ds-mark" aria-hidden="true">ل</span><span><strong>شركة لوسيل</strong><small className="ds-mono" dir="ltr">LUSAILL</small></span></Link>
      <p>المعرفة بداية. والأثر ما نبنيه.</p>
    </div>
    <div className="ds-footer-grid">
      {groups.map(group => <nav aria-label={group.title} key={group.title}>
        <h2>{group.title}</h2>
        {group.links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>)}
    </div>
    <div className="ds-footer-bottom"><span>© {new Date().getFullYear()} شركة لوسيل</span><span className="ds-mono" dir="ltr">LUSAILL / KNOWLEDGE &amp; DIGITAL</span></div>
  </div></footer>;
}
