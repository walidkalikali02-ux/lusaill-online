import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageAlternates } from "@/lib/page-alternates";

const home = "/knowledge/manahej";
const qatar = home + "/qatar";
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
  const items = url === home
    ? [{ href: qatar, title: "المنهج القطري", detail: "من الصف الأول إلى الصف السادس" }]
    : url === qatar
      ? grades.map((label, index) => ({
          href: qatar + `/grade-${index + 1}`,
          title: "الصف " + label,
          detail: index === 0 ? "الرياضيات · ١٨ درسًا تفاعليًا" : "الدروس قيد الإعداد",
        }))
      : grade === 0
        ? [{ href: url + "/math", title: "الرياضيات", detail: "١٨ درسًا تفاعليًا موزعة على فصلين" }]
        : [];

  return (
    <main id="main-content" className="shell" style={{ paddingBlock: 48 }}>
      <nav className="breadcrumbs" aria-label="مسار التنقل">
        <Link href="/knowledge">موسوعة لوسيل</Link>
        {url !== home && <><span>/</span><Link href={home}>مناهج</Link></>}
        {grade !== undefined && <><span>/</span><Link href={qatar}>المنهج القطري</Link></>}
        <span>/</span><span aria-current="page">{title}</span>
      </nav>
      <section className="encyclopedia-welcome">
        <h1>{title}</h1>
        <p>{url === home ? "دروس مدرسية تفاعلية باللغة العربية." : url === qatar ? "اختر صفّك." : grade === 0 ? "توقّع الإجابة، جرّب على الرسم، واعرف السبب." : "الدروس قيد الإعداد."}</p>
      </section>
      {items.length > 0 && (
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 14, padding: 0, listStyle: "none" }}>
          {items.map(item => (
            <li key={item.href}>
              <Link href={item.href} className="brief-box" style={{ display: "grid", gap: 6, height: "100%" }}>
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
