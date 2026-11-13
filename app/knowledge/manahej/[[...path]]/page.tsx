import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageAlternates } from "@/lib/page-alternates";
import TryMath from "./try-math";
import styles from "./curriculum.module.css";

const home = "/knowledge/manahej";
const qatar = home + "/qatar";
const math = qatar + "/grade-1/math";
const gradeNumbers = ["١", "٢", "٣", "٤", "٥", "٦"];
const grades = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس"];
type Props = { params: Promise<{ path?: string[] }> };

function locationFor(path: string[]) {
  if (!path.length) return { url: home, title: "مناهج" };
  if (path[0] !== "qatar") notFound();
  if (path.length === 1) return { url: qatar, title: "المنهج القطري" };
  const grade = grades.findIndex((_, index) => path[1] === `grade-${index + 1}`);
  if (path.length !== 2 || grade < 0) notFound();
  return { url: qatar + "/" + path[1], title: "الصف " + grades[grade], grade };
}

export function generateStaticParams() {
  return [{ path: [] }, { path: ["qatar"] }, ...grades.map((_, index) => ({
    path: ["qatar", `grade-${index + 1}`],
  }))];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path = [] } = await params;
  const { url, title, grade } = locationFor(path);
  return {
    title,
    description: "مناهج موسوعة لوسيل. أنشطة تفاعلية في رياضيات الصف الأول ضمن المنهج القطري.",
    alternates: pageAlternates(url),
    robots: { index: grade === undefined || grade === 0, follow: true },
  };
}

export default async function CurriculumPage({ params }: Props) {
  const { path = [] } = await params;
  const { url, title, grade } = locationFor(path);
  const showGrades = grade === undefined;
  const isHome = url === home;

  return (
    <main id="main-content" className={`shell ${styles.page}`}>
      <nav className="breadcrumbs" aria-label="مسار التنقل">
        <Link href="/knowledge">موسوعة لوسيل</Link>
        {!isHome && <><span>/</span><Link href={home}>مناهج</Link></>}
        {grade !== undefined && <><span>/</span><Link href={qatar}>المنهج القطري</Link></>}
        <span>/</span><span aria-current="page">{title}</span>
      </nav>
      {showGrades || grade === 0 ? (
        <div className={styles.hero}>
          <section>
            <span className={styles.eyebrow}>{isHome ? "المنهج القطري" : grade === 0 ? "المنهج القطري · الصف الأول" : "مناهج لوسيل"}</span>
            <h1>{grade === 0 ? "رياضيات الصف الأول" : title}</h1>
            <p>توقّع الإجابة، جرّب على الرسم، واعرف السبب. ابدأ بـ١٨ درسًا تفاعليًا في رياضيات الصف الأول.</p>
            <div className={styles.heroActions}>
              <Link href={math} className={styles.primary}>افتح دروس الرياضيات ←</Link>
              {showGrades && <a href="#grades" className={styles.secondary}>تصفّح الصفوف</a>}
            </div>
          </section>
          <TryMath lessonUrl={math + "#درس-1"} />
        </div>
      ) : (
        <section className="encyclopedia-welcome">
          <h1>{title}</h1>
          <p>الدروس قيد الإعداد لهذا الصف.</p>
          <Link href={qatar + "#grades"}>العودة إلى الصفوف ←</Link>
        </section>
      )}
      {showGrades && (
        <section id="grades" className={styles.section} aria-labelledby="grades-title">
          <h2 id="grades-title">اختر صفّك</h2>
          <p>{isHome ? <Link href={qatar}>المنهج القطري</Link> : "المرحلة الابتدائية"}</p>
          <ul className={styles.grades}>
            {grades.map((label, index) => (
              <li key={label}>
                <Link className={styles.grade} data-ready={index === 0} href={qatar + `/grade-${index + 1}`}>
                  <span className={styles.number} aria-hidden="true">{gradeNumbers[index]}</span>
                  <span><strong>الصف {label}</strong><small>{index === 0 ? "الرياضيات · ١٨ درسًا" : "الدروس قيد الإعداد"}</small></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
