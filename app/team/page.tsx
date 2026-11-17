import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { TeamAvatar } from "@/components/team-avatar";
import { getTeamPersonas, getTeamArticles } from "@/lib/team-domains";
import { teamRoles, teamPersonaAnchor } from "@/lib/team-personas";
import { pageAlternates } from "@/lib/page-alternates";
import { absoluteUrl, siteSocialImage } from "@/lib/site-config";
import styles from "./team.module.css";

const description = "تعرّف إلى المجالات المعرفية في موسوعة لوسيل عبر شخصيات توضيحية من العلوم والتعليم والتقنية والكتابة والبحث، مع روابط لمقالات كل تخصص. الأسماء والرسوم خيالية.";
export const metadata: Metadata = { title: "فريق لوسيل | وجوه المعرفة", description, alternates: pageAlternates("/team"), openGraph: { title: "فريق لوسيل", description, url: "/team", type: "website", images: [siteSocialImage] } };
export const revalidate = 3600;
export default function TeamPage() {
  // The public directory is static; filters run client-side to avoid no-store responses.
  const members = getTeamPersonas();
  const schemas = [
    { "@context": "https://schema.org", "@type": "CollectionPage", name: "فريق لوسيل — التخصصات", description, url: absoluteUrl("/team"), inLanguage: "ar" },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "فريق لوسيل", item: absoluteUrl("/team") }] },
  ];
  return <main id="main-content" className={styles.page}>
    <section className={`shell ${styles.hero}`} aria-labelledby="team-title">
      <div className={styles.heroText}><div className={styles.eyebrow}><span/> مساحة لوسيل للمعرفة</div><h1 id="team-title">فريق لوسيل.<br/><em>تخصصات تتكامل.</em></h1><p className={styles.lead}>تعرّف إلى الأسماء والتخصصات في لوسيل، من الهندسة والتعليم إلى الكتابة والبحث والتدقيق. لكل مجال زاوية نظر، ولكل سؤال طريق إلى المعرفة.</p><a href="#team-directory" className={styles.primary}>تعرّف إلى الفريق <span aria-hidden="true">↙</span></a><div className={styles.heroMeta}><strong>{members.length.toLocaleString("ar-EG")}</strong> مجالًا ممثلًا <span/> خمسة أدوار معرفية</div></div>
      <div className={styles.heroArt} aria-hidden="true"><div className={styles.orbit}/><div className={styles.portraitOne}><TeamAvatar seed={24} name="" role="engineer" decorative/></div><div className={styles.portraitTwo}><TeamAvatar seed={53} name="" role="teacher" decorative/></div><div className={styles.portraitThree}><TeamAvatar seed={76} name="" role="writer" decorative/></div><span className={styles.artTag}>نبحث. نبسّط. نراجع.</span><span className={styles.artStar}>✳</span></div>
    </section>
    <aside className={`shell ${styles.disclosure}`} aria-label="عن الشخصيات"><span className={styles.disclosureIcon} aria-hidden="true">i</span><p><strong>عن هذه الصفحة:</strong> الأسماء والرسوم شخصيات خيالية للتعريف بالتخصصات، ولا تمثل موظفين حقيقيين أو مؤهلات أو مراجعات بشرية. ربط الشخصية بمقالات في مجالها هو تصنيف موضوعي فقط، وليس نسبة تأليف أو تدقيق لهذه الشخصية. <Link href="/editorial-policy">اقرأ منهج التحرير والمصادر ←</Link></p></aside>
    <section className={`shell ${styles.directory}`} id="team-directory" aria-labelledby="directory-title">
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>لكل مجال زاوية نظر</span><h2 id="directory-title">تعرّف إلى التخصصات</h2></div><p>تخصص واضح، ونبذة قصيرة،<br/>وطريق يقودك إلى المحتوى.</p></div>
      <form id="team-filters" action="/team#team-directory" method="get" className={styles.filters}><div><label htmlFor="team-query">ابحث عن اسم أو تخصص</label><input id="team-query" name="q" type="search" maxLength={120} placeholder="جرّب: الكهرباء، الرياضيات، البحث…"/></div><div><label htmlFor="team-role">الدور</label><select id="team-role" name="role" defaultValue=""><option value="">كل الأدوار</option>{Object.entries(teamRoles).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></div><button type="submit" className={styles.primary}>عرض النتائج</button><Link href="/team#team-directory" id="team-reset" style={{display:"none"}} className={styles.reset}>مسح التصفية</Link></form>
      <p className={styles.resultCount} id="team-count">{members.length.toLocaleString("ar-EG")} من {members.length.toLocaleString("ar-EG")} ملفًا</p>
      {<div className={styles.grid} id="team-grid">{members.map(member => { const matches = getTeamArticles(member); return <article className={styles.card} key={member.id} id={teamPersonaAnchor(member)} data-team-role={member.role} data-team-search={`${member.name} ${member.title} ${teamRoles[member.role].label}`}>
        <div className={styles.cardTop}><span>{member.kind === "course" ? "التعلّم والكورسات" : "المقالات والأدلة"}</span><span className={styles.number} aria-hidden="true">✳</span></div>
        <div className={styles.avatar}><TeamAvatar seed={member.seed} name={member.name} role={member.role}/></div>
        <div className={styles.identity}><h3>{member.name}</h3></div>
        <p className={styles.specialty}>{member.title}</p><p className={styles.role}>{teamRoles[member.role].label} في لوسيل</p><p className={styles.focus}>{teamRoles[member.role].task}</p>
        <details className={styles.bio}><summary>اقرأ المزيد <span aria-hidden="true">⌄</span></summary><p>{member.bio}</p></details>
        <div className={styles.articleLinks}><h4>أدلة مرتبطة بالمجال <span>({matches.length.toLocaleString("ar-EG")})</span></h4>{matches.length ? <ul>{matches.slice(0, 5).map(article => <li key={article.href}><Link href={article.href}>{article.title}</Link></li>)}</ul> : <p>لم تُنشر أدلة مطابقة لهذا التخصص بعد.</p>}</div>
        {member.available !== false && <Link href={member.href} className={styles.domainLink}>{member.kind === "guide" ? "كل أدلة المجال" : "استكشف الكورس"} <span aria-hidden="true">↖</span></Link>}
      </article>; })}</div>}
      <div className={styles.empty} id="team-empty" style={{display:"none"}}><h3>لم نجد ملفًا بهذا البحث</h3><p>جرّب اسم المجال دون تفاصيل، أو اعرض جميع التخصصات.</p><Link href="/team#team-directory">عرض الفريق كاملًا ←</Link></div>
    </section>
    <section className={`shell ${styles.closing}`}><div><span className={styles.eyebrow}>المعرفة تبدأ بسؤال</span><h2>ما الذي تريد فهمه اليوم؟</h2><p>اختر دليلًا عمليًا أو ابدأ كورسًا، وارجع إلى المصادر المرفقة عند كل معلومة متغيرة.</p></div><div><Link href="/articles">تصفّح الأدلة ←</Link><Link href="/courses">اكتشف الكورسات ←</Link><Link href="/authors/editorial-team">عن هوية التحرير ←</Link></div></section>
    <Script src="/js/team-filters.js" strategy="afterInteractive" />
    {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}/>)}
  </main>;
}
