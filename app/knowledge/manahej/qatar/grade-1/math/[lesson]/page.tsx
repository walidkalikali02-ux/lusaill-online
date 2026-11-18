import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageAlternates } from "@/lib/page-alternates";
import { absoluteUrl, siteSocialImage } from "@/lib/site-config";
import {
  getQatarMathLesson, qatarGradeOneMathLessons, qatarMathBase, qatarMathLessonPath,
} from "@/lib/qatar-grade-one-math-lessons";

type Props = { params: Promise<{ lesson: string }> };
export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return qatarGradeOneMathLessons.map(({ slug }) => ({ lesson: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson: slug } = await params;
  const lesson = getQatarMathLesson(slug);
  if (!lesson) return { robots: { index: false, follow: false } };
  const title = `رياضيات الصف الأول في قطر: ${lesson.title}`;
  const description = `${lesson.goal} مثال محلول وسؤال للتدريب ونشاط تفاعلي أصلي ضمن دروس رياضيات الصف الأول في لوسيل.`;
  const path = qatarMathLessonPath(lesson.slug);
  return {
    title, description, alternates: pageAlternates(path),
    // Keep new educational notes discoverable to readers but out of the index until individually QA-reviewed.
    robots: { index: false, follow: true },
    openGraph: { title, description, url: path, type: "article", images: [siteSocialImage] },
    twitter: { card: "summary_large_image", title, description, images: [siteSocialImage.url] },
  };
}

export default async function QatarMathLessonPage({ params }: Props) {
  const { lesson: slug } = await params;
  const lesson = getQatarMathLesson(slug);
  if (!lesson) notFound();
  const next = qatarGradeOneMathLessons.find(item => item.id === lesson.id + 1);
  const previous = qatarGradeOneMathLessons.find(item => item.id === lesson.id - 1);
  const path = qatarMathLessonPath(lesson.slug);
  const structuredData = [
    {
      "@context": "https://schema.org", "@type": "LearningResource",
      name: `${lesson.title} — رياضيات الصف الأول`,
      description: lesson.goal, url: absoluteUrl(path), inLanguage: "ar",
      learningResourceType: "درس وتمارين تفاعلية",
      educationalLevel: "الصف الأول الابتدائي",
      isAccessibleForFree: true,
      teaches: lesson.rule,
      provider: { "@type": "Organization", name: "شركة لوسيل", url: absoluteUrl("/") },
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "مناهج قطر", item: absoluteUrl("/knowledge/manahej/qatar") },
        { "@type": "ListItem", position: 3, name: "رياضيات الصف الأول", item: absoluteUrl(qatarMathBase) },
        { "@type": "ListItem", position: 4, name: lesson.title, item: absoluteUrl(path) },
      ],
    },
  ];
  return (
    <main id="main-content" className="shell" style={{ paddingBlock: "2rem 4rem", maxWidth: "58rem" }}>
      <nav aria-label="مسار الصفحة">
        <Link href="/knowledge/manahej">المناهج</Link> / <Link href="/knowledge/manahej/qatar">قطر</Link> /
        <Link href={qatarMathBase}>رياضيات الصف الأول</Link> / <span>{lesson.title}</span>
      </nav>
      <article>
        <header>
          <p>مناهج قطر | الصف الأول | الفصل الدراسي {lesson.term === 1 ? "الأول" : "الثاني"} | الدرس {lesson.id} من ١٨</p>
          <h1>{lesson.title} — رياضيات الصف الأول</h1>
          <p>{lesson.goal} هذا شرح توضيحي وتمرين من إعداد لوسيل، وليس نقلًا لنص كتاب مدرسي أو ترتيبًا معتمدًا للحصص.</p>
        </header>
        <section aria-labelledby="concept"><h2 id="concept">الفكرة التي نتعلمها</h2><p>{lesson.rule}</p>
          <p>ابدأ بملاحظة الأشياء أو الأشكال أمامك، ثم اشرح طريقة الوصول للإجابة بالكلمات قبل الاعتماد على الرقم وحده.</p>
        </section>
        <section aria-labelledby="worked"><h2 id="worked">مثال محلول</h2><p>{lesson.example}</p>
          <p>يمكنك إعادة المثال باستخدام أدوات بسيطة مثل الأقلام والمكعبات أو رسم الأشكال على الورق، ثم مقارنة النتائج.</p>
        </section>
        <section aria-labelledby="practice"><h2 id="practice">تدريب سريع</h2>
          <p><strong>السؤال:</strong> {lesson.challenge}</p>
          <details><summary>اعرض الإجابة بعد المحاولة</summary><p>الإجابة: {lesson.answer}.</p></details>
          <p>بعد الإجابة، اشرح لماذا وصلت إليها، ثم غيّر الأعداد أو ترتيب الأشكال وجرّب المسألة مرة ثانية.</p>
        </section>
        <section aria-labelledby="interactive"><h2 id="interactive">جرّب النشاط التفاعلي</h2>
          <p>النشاط الأصلي يتيح توقع الإجابة، ثم تجربة الرسم ومراجعة التفسير خطوة بخطوة. يمكنك العودة إلى هذا الشرح بعد إكمال التجربة.</p>
          <p><Link href={`${qatarMathBase}#درس-${lesson.id}`}>افتح النشاط التفاعلي: {lesson.title} ←</Link></p>
        </section>
        <section aria-labelledby="sources"><h2 id="sources">المراجع وطبيعة المحتوى</h2>
          <p>هذه أنشطة تدريبية أصلية مبنية على موضوعات تعليمية للصف الأول، وقد يختلف ترتيب الموضوعات عن مقررات المدرسة.</p>
          <p>لمراجعة مواد التعليم، ارجع إلى <a href="https://tadribaty.com/math-g1-t1-student-book/" rel="noopener noreferrer" target="_blank">كتاب الطالب للفصل الأول</a> و<a href="https://tadribaty.com/math-g1-t2-student-book/" rel="noopener noreferrer" target="_blank">كتاب الطالب للفصل الثاني</a>.</p>
        </section>
      </article>
      <nav aria-label="التنقل بين الدروس" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
        {previous && <Link href={qatarMathLessonPath(previous.slug)}>الدرس السابق: {previous.title}</Link>}
        <Link href={qatarMathBase}>كل دروس الرياضيات</Link>
        {next && <Link href={qatarMathLessonPath(next.slug)}>الدرس التالي: {next.title}</Link>}
      </nav>
      {structuredData.map((schema, i) => <script key={i} type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />)}
    </main>
  );
}
