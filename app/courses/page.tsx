import type { Metadata } from "next";
import Link from "next/link";
import { pageAlternates } from "@/lib/page-alternates";
import { absoluteUrl } from "@/lib/site-config";
import { courseMeta, drivingLessons } from "@/lib/driving-course";
import { SiteIcon } from "@/components/site-icon";
import { CourseArt } from "@/components/course-art";
const description = "كورسات عربية بخطة واضحة ودروس يمكنك قراءتها على مهلك. تعرّف على المستوى والمحتوى قبل أن تبدأ، واختر من دروس كورس تعلم القيادة للمبتدئين.";
export const metadata: Metadata = {
 title: "كورسات لوسيل | تعلّم خطوة بخطوة", description, alternates: pageAlternates("/courses"),
 openGraph: { title: "كورسات لوسيل | تعلّم خطوة بخطوة", description, url: "/courses", type: "website" },
};
const shortcuts = [
 { index: 0, label: "من أين أبدأ؟", detail: "المقعد والمرايا وأدوات التحكم", icon: "car" as const },
 { index: 3, label: "أريد رؤية أوضح", detail: "المرايا والإشارات والبقع العمياء", icon: "shield" as const },
 { index: 5, label: "أراجع مهارة الوقوف", detail: "الرجوع والوقوف الموازي", icon: "grid" as const },
];
export default function CoursesPage() {
 const schemas = [
 { "@context": "https://schema.org", "@type": "CollectionPage", name: "كورسات لوسيل", description, url: absoluteUrl("/courses"), inLanguage: "ar", mainEntity: { "@type": "ItemList", numberOfItems: 1, itemListElement: [{ "@type": "ListItem", position: 1, name: courseMeta.title, url: absoluteUrl("/courses/learn-driving") }] } },
 { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "الكورسات", item: absoluteUrl("/courses") }] },
 ];
 return <main id="main-content" className="academy-catalog">
 <section className="academy-welcome academy-width"><div><span className="academy-eyebrow"><span /> مساحة للتعلّم، على مهلك</span><h1>مهارة جديدة.<br /><em>بداية أبسط.</em></h1><p>اختر ما تريد تعلّمه، تعرّف على الطريق، وابدأ بخطوة تناسبك. هنا لكل كورس خطة واضحة، ولكل درس هدف.</p><a className="academy-button" href="#available-courses">استعرض الكورسات <SiteIcon name="arrow" width="18" /></a></div><div className="academy-welcome-note"><SiteIcon name="book" width="30" height="30" /><strong>افهم. راجع. طبّق.</strong><p>دروس مكتوبة ورسوم توضيحية<br />تعود إليها وقتما تحتاج.</p><span>بالعربية · دون تسجيل</span></div></section>
 <section className="academy-width academy-selection" id="available-courses" aria-labelledby="courses-title"><div className="academy-section-heading"><div><span className="academy-eyebrow">ابدأ رحلتك</span><h2 id="courses-title">الكورسات المتاحة</h2></div><span className="academy-count">كورس واحد متاح الآن</span></div>
 <div className="academy-selection-grid"><article className="academy-course-card"><Link href="/courses/learn-driving" className="academy-card-art" aria-label="تفاصيل كورس تعلم القيادة"><CourseArt /><span className="academy-art-label">مهارات الحياة</span></Link><div className="academy-card-content"><div className="academy-card-meta"><span>للمبتدئين</span><span><SiteIcon name="book" width="15" /> {drivingLessons.length} دروس</span><span>قراءة وتمارين</span></div><h3><Link href="/courses/learn-driving">تعلم قيادة السيارة<br />من أول خطوة</Link></h3><p>من تجهيز المقعد والمرايا إلى الانطلاق والوقوف. افهم الأساسيات أولًا، ثم راجع التمرين مع مدرب مؤهل.</p><ul className="academy-checks"><li><SiteIcon name="check" width="16" /> دروس مرتبة من الأساسيات</li><li><SiteIcon name="check" width="16" /> تمارين وقوائم تحقق</li></ul><div className="academy-card-bottom"><span>مجاني <small>دون تسجيل</small></span><Link className="academy-button" href="/courses/learn-driving">تعرّف على الكورس <SiteIcon name="arrow" width="17" /></Link></div></div></article>
 <aside className="academy-choice-note"><span className="academy-note-symbol" aria-hidden="true">↗</span><h3>اختيارك يبدأ<br />من هدفك.</h3><p>قبل أن تبدأ، اقرأ خطة الكورس لتعرف المهارات التي يغطيها وما تحتاجه للتطبيق.</p><ol><li><b>01</b><span>تعرّف على المحتوى<strong>اطّلع على الدروس والمستوى.</strong></span></li><li><b>02</b><span>ابدأ بالأساسيات<strong>كل درس يمهّد للذي يليه.</strong></span></li><li><b>03</b><span>تعلّم بإيقاعك<strong>ارجع للشرح حين تحتاجه.</strong></span></li></ol><Link href="/courses/learn-driving#course-plan">شاهد خطة تعلم القيادة <span aria-hidden="true">←</span></Link></aside></div></section>
 <section className="academy-width academy-skills" aria-labelledby="skills-title"><div className="academy-section-heading"><div><span className="academy-eyebrow">داخل كورس القيادة</span><h2 id="skills-title">تبحث عن مهارة محددة؟</h2><p>يمكنك مراجعة درس مباشرة، أو اتباع الكورس كاملًا بالترتيب.</p></div></div><div className="academy-skill-grid">{shortcuts.map(({ index, label, detail, icon }) => <Link key={index} href={`/courses/learn-driving/${drivingLessons[index].slug}`}><span className="academy-skill-icon"><SiteIcon name={icon} width="24" height="24" /></span><h3>{label}</h3><p>{detail}</p><span className="academy-skill-link">انتقل إلى الدرس <SiteIcon name="arrow" width="16" /></span></Link>)}</div></section>
 <section className="academy-width academy-expectations"><div><span className="academy-eyebrow">اعرف ما ستحصل عليه</span><h2>تعلّم واضح، دون تعقيد.</h2></div><div><h3>محتوى مكتوب</h3><p>شرح ورسوم وتمارين، وليس دروس فيديو أو حصصًا مباشرة.</p></div><div><h3>تثقيف ومراجعة</h3><p>كورس القيادة لا يمنح رخصة أو شهادة، ولا يحل محل التدريب مع مدرب مؤهل.</p></div></section>
 {schemas.map((schema, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}</main>;
}
