import type { Metadata } from "next";
import Link from "next/link";
import { TeamAvatar } from "@/components/team-avatar";
import { getTeamPersonas } from "@/lib/team-domains";
import { teamRoles, type TeamRole } from "@/lib/team-personas";
import { pageAlternates } from "@/lib/page-alternates";
import { absoluteUrl } from "@/lib/site-config";
import styles from "./team.module.css";

const description = "تعرف إلى شخصيات لوسيل التمثيلية في الهندسة والتعليم والكتابة والبحث والتدقيق. أسماء مستعارة ورسوم كرتونية لكل مجال من الأدلة والكورسات.";
export const metadata: Metadata = { title: "فريق لوسيل | وجوه المعرفة", description, alternates: pageAlternates("/team"), openGraph: { title: "فريق لوسيل", description, url: "/team", type: "website" } };
type Query = { q?: string | string[]; role?: string | string[] };
const normalize = (value: string) => value.normalize("NFKC").replace(/[ً-ْ]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").toLowerCase();
export default async function TeamPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const q = (typeof params.q === "string" ? params.q : "").trim().slice(0, 120);
  const role = typeof params.role === "string" && Object.hasOwn(teamRoles, params.role) ? params.role as TeamRole : "";
  const members = getTeamPersonas();
  const visible = members.filter(member => (!role || member.role === role) && (!q || normalize(`${member.name} ${member.title} ${teamRoles[member.role].label}`).includes(normalize(q))));
  const schemas = [
    { "@context": "https://schema.org", "@type": "CollectionPage", name: "فريق لوسيل — شخصيات تمثيلية", description, url: absoluteUrl("/team"), inLanguage: "ar" },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "فريق لوسيل", item: absoluteUrl("/team") }] },
  ];
  return <main id="main-content" className={styles.page}>
    <section className={`shell ${styles.hero}`} aria-labelledby="team-title">
      <div className={styles.heroText}><div className={styles.eyebrow}><span/> مساحة لوسيل للمعرفة</div><h1 id="team-title">وجوه مختلفة.<br/><em>فضول واحد.</em></h1><p className={styles.lead}>من سؤال صغير إلى فكرة واضحة؛ تعرّف إلى الشخصيات التي تمثّل تخصصات لوسيل، من الهندسة والتعليم إلى الكتابة والبحث والتدقيق.</p><a href="#team-directory" className={styles.primary}>تعرّف إلى الفريق <span aria-hidden="true">↙</span></a><div className={styles.heroMeta}><strong>{members.length.toLocaleString("ar-EG")}</strong> مجالًا ممثلًا <span/> خمسة أدوار معرفية</div></div>
      <div className={styles.heroArt} aria-hidden="true"><div className={styles.orbit}/><div className={styles.portraitOne}><TeamAvatar seed={24} name="" role="engineer" decorative/></div><div className={styles.portraitTwo}><TeamAvatar seed={53} name="" role="teacher" decorative/></div><div className={styles.portraitThree}><TeamAvatar seed={76} name="" role="writer" decorative/></div><span className={styles.artTag}>نبحث. نبسّط. نراجع.</span><span className={styles.artStar}>✳</span></div>
    </section>
    <aside className={`shell ${styles.disclosure}`} aria-label="عن الشخصيات"><span className={styles.disclosureIcon} aria-hidden="true">i</span><p><strong>شخصيات تمثيلية، وأسماء مستعارة.</strong> الرسوم والأسماء للتعريف بالمجالات؛ لا تمثل أشخاصًا حقيقيين أو شهادات مهنية وأكاديمية، ولا تعني أن المحتوى خضع لمراجعة بشرية متخصصة. <Link href="/editorial-policy">اقرأ منهج التحرير والمصادر ←</Link></p></aside>
    <section className={`shell ${styles.directory}`} id="team-directory" aria-labelledby="directory-title">
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>لكل مجال زاوية نظر</span><h2 id="directory-title">تعرّف إلى التخصصات</h2></div><p>أسماء مستعارة، وتخصص واضح،<br/>وطريق يقودك إلى المحتوى.</p></div>
      <form action="/team#team-directory" method="get" className={styles.filters}><div><label htmlFor="team-query">ابحث عن اسم أو تخصص</label><input id="team-query" name="q" type="search" maxLength={120} defaultValue={q} placeholder="جرّب: الكهرباء، الرياضيات، البحث…"/></div><div><label htmlFor="team-role">الدور التمثيلي</label><select id="team-role" name="role" defaultValue={role}><option value="">كل الأدوار</option>{Object.entries(teamRoles).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></div><button type="submit" className={styles.primary}>عرض النتائج</button>{q || role ? <Link href="/team#team-directory" className={styles.reset}>مسح التصفية</Link> : null}</form>
      <p className={styles.resultCount}>{visible.length.toLocaleString("ar-EG")} من {members.length.toLocaleString("ar-EG")} شخصية تمثيلية</p>
      {visible.length ? <div className={styles.grid}>{visible.map(member => <article className={styles.card} key={member.id}>
        <div className={styles.cardTop}><span>{member.kind === "course" ? "التعلّم والكورسات" : "الأدلة والخدمات"}</span><span className={styles.number} aria-hidden="true">✳</span></div>
        <div className={styles.avatar}><TeamAvatar seed={member.seed} name={member.name} role={member.role}/></div>
        <div className={styles.identity}><span className={styles.role}>{teamRoles[member.role].label} <span>· دور تمثيلي</span></span><h3>{member.name}</h3><span className={styles.pseudonym}>اسم مستعار</span></div>
        <p className={styles.specialty}>{member.title}</p><p className={styles.focus}>{teamRoles[member.role].focus}</p>
        <details className={styles.bio}><summary>عن الشخصية والتخصص <span aria-hidden="true">+</span></summary><p>{member.bio}</p></details>
        <Link href={member.href} className={styles.domainLink}>استكشف المجال <span aria-hidden="true">↖</span></Link>
      </article>)}</div> : <div className={styles.empty}><h3>لم نجد شخصية بهذا البحث</h3><p>جرّب اسم المجال دون تفاصيل، أو اعرض جميع التخصصات.</p><Link href="/team#team-directory">عرض الفريق كاملًا ←</Link></div>}
    </section>
    <section className={`shell ${styles.closing}`}><div><span className={styles.eyebrow}>المعرفة تبدأ بسؤال</span><h2>ما الذي تريد فهمه اليوم؟</h2><p>اختر دليلًا عمليًا أو ابدأ كورسًا، وارجع إلى المصادر المرفقة عند كل معلومة متغيرة.</p></div><div><Link href="/articles">تصفّح الأدلة ←</Link><Link href="/courses">اكتشف الكورسات ←</Link><Link href="/authors/editorial-team">عن هوية التحرير ←</Link></div></section>
    {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}/>)}
  </main>;
}
