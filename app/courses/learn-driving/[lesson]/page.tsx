import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courseMeta, drivingLessons, getAdjacentLessons, getDrivingLesson } from "@/lib/driving-course";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

const coursePath = "/courses/learn-driving";
type LessonPageProps = { params: Promise<{ lesson: string }> };

export function generateStaticParams() {
  return drivingLessons.map((lesson) => ({ lesson: lesson.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { lesson: slug } = await params;
  const lesson = getDrivingLesson(slug);
  if (!lesson) return { robots: { index: false, follow: false } };
  const path = `${coursePath}/${lesson.slug}`;
  return {
    title: lesson.title,
    description: lesson.metaDescription,
    alternates: { canonical: path },
    authors: [{ name: courseMeta.author, url: absoluteUrl("/authors/editorial-team") }],
    openGraph: {
      type: "article",
      title: lesson.title,
      description: lesson.metaDescription,
      url: path,
      publishedTime: courseMeta.publishedAt,
      modifiedTime: courseMeta.updatedAt,
      images: [{ url: lesson.image.src, width: lesson.image.width, height: lesson.image.height, alt: lesson.image.alt }],
    },
    twitter: { card: "summary_large_image", title: lesson.title, description: lesson.metaDescription, images: [lesson.image.src] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

export default async function DrivingLessonPage({ params }: LessonPageProps) {
  const { lesson: slug } = await params;
  const lesson = getDrivingLesson(slug);
  if (!lesson) notFound();
  const adjacent = getAdjacentLessons(lesson.slug);
  const path = `${coursePath}/${lesson.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": ["Article", "LearningResource"],
    "@id": `${absoluteUrl(path)}#article`,
    headline: lesson.title,
    description: lesson.metaDescription,
    url: absoluteUrl(path),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    inLanguage: "ar",
    educationalLevel: "مبتدئ",
    learningResourceType: "درس عملي",
    isPartOf: { "@id": `${absoluteUrl(coursePath)}#course` },
    datePublished: courseMeta.publishedAt,
    dateModified: courseMeta.updatedAt,
    image: { "@type": "ImageObject", url: lesson.image.src, width: lesson.image.width, height: lesson.image.height },
    author: { "@type": "Organization", name: courseMeta.author, url: absoluteUrl("/authors/editorial-team") },
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: lesson.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${absoluteUrl(path)}#practice`,
    name: lesson.practice.title,
    description: lesson.practice.intro,
    inLanguage: siteConfig.language,
    step: lesson.practice.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: `الخطوة ${index + 1}`,
      text: step,
      url: `${absoluteUrl(path)}#practice-step-${index + 1}`,
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: courseMeta.shortTitle, item: absoluteUrl(coursePath) },
      { "@type": "ListItem", position: 3, name: lesson.title, item: absoluteUrl(path) },
    ],
  };

  return (
    <main id="main-content" className="course-lesson-page">
      <div className="lesson-progress" aria-label={`الدرس ${lesson.order} من ${drivingLessons.length}`}>
        <span style={{ width: `${(lesson.order / drivingLessons.length) * 100}%` }} />
      </div>
      <div className="shell lesson-shell">
        <nav className="breadcrumbs">
          <Link href="/">الرئيسية</Link><span>/</span>
          <Link href={coursePath}>تعلم القيادة</Link><span>/</span>
          <span>الدرس {lesson.order}</span>
        </nav>

        <header className="lesson-header">
          <div className="lesson-number-block"><small>الدرس</small><strong>{String(lesson.order).padStart(2, "0")}</strong></div>
          <div>
            <span className="course-kicker">كورس تعلم القيادة · {lesson.duration}</span>
            <h1>{lesson.title}</h1>
            <div className="article-meta">
              <span className="article-meta-item">نُشر: {courseMeta.publishedAt}</span>
              <span className="article-meta-item">رُوجع: {courseMeta.updatedAt}</span>
              <span className="article-meta-item"><Link href="/authors/editorial-team">{courseMeta.author}</Link></span>
            </div>
          </div>
        </header>

        <div className="lesson-layout">
          <article className="lesson-content">
            <section className="lesson-answer" id="answer">
              <span>الإجابة المباشرة</span>
              <p>{lesson.quickAnswer}</p>
            </section>

            <figure className="lesson-figure">
              <Image src={lesson.image.src} alt={lesson.image.alt} width={lesson.image.width} height={lesson.image.height} priority sizes="(max-width: 960px) 100vw, 760px" unoptimized={lesson.image.src.endsWith(".svg")} />
              <figcaption>{lesson.image.caption} <a href={lesson.image.sourceUrl} target="_blank" rel="noreferrer">{lesson.image.credit} — {lesson.image.license}</a></figcaption>
            </figure>

            <section className="lesson-objectives" id="objectives">
              <span>بعد هذا الدرس ستستطيع</span>
              <ul>{lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
            </section>

            {lesson.sections.map((section) => (
              <section className="lesson-section" id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
              </section>
            ))}

            <section className="practice-card" id="practice">
              <div className="practice-heading"><span>تطبيق عملي</span><h2>{lesson.practice.title}</h2></div>
              <p>{lesson.practice.intro}</p>
              <ol>{lesson.practice.steps.map((step, index) => <li id={`practice-step-${index + 1}`} key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
              <div className="pass-rule"><strong>معيار النجاح</strong><p>{lesson.practice.passWhen}</p></div>
            </section>

            <section className="lesson-section" id="mistakes">
              <h2>أخطاء شائعة تجنّبها</h2>
              <ul className="mistake-list">{lesson.mistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul>
            </section>

            <section className="lesson-checklist" id="checklist">
              <h2>قائمة التحقق قبل الانتقال</h2>
              <ul>{lesson.checklist.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
            </section>

            <section className="lesson-safety-note">
              <strong>حدود الدرس</strong>
              <p>{courseMeta.safetyNote}</p>
            </section>

            <section className="lesson-section faq-section" id="faq">
              <h2>أسئلة شائعة</h2>
              {lesson.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
            </section>

            <section className="lesson-section sources-section" id="sources">
              <h2>المصادر والمراجعة</h2>
              <p>تم التحقق من المصادر التالية بتاريخ {courseMeta.updatedAt}. استُخدمت المبادئ العامة فقط، وتبقى قوانين بلدك وعلاماته هي المرجع الملزم.</p>
              <ul>{lesson.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a><span>{source.publisher} · تحقق {source.checkedAt}</span></li>)}</ul>
            </section>

            <nav className="lesson-pagination" aria-label="التنقل بين دروس الكورس">
              {adjacent.previous ? <Link href={`${coursePath}/${adjacent.previous.slug}`}><small>الدرس السابق</small><strong>→ {adjacent.previous.title}</strong></Link> : <span />}
              {adjacent.next ? <Link className="lesson-next" href={`${coursePath}/${adjacent.next.slug}`}><small>الدرس التالي</small><strong>{adjacent.next.title} ←</strong></Link> : <Link className="lesson-next" href={coursePath}><small>اكتمل المسار</small><strong>العودة إلى صفحة الكورس ←</strong></Link>}
            </nav>
          </article>

          <aside className="lesson-sidebar">
            <div className="course-outline">
              <span>محتويات الكورس</span>
              <ol>{drivingLessons.map((item) => <li className={item.slug === lesson.slug ? "active" : ""} key={item.slug}><Link href={`${coursePath}/${item.slug}`}><span>{String(item.order).padStart(2, "0")}</span>{item.title}</Link></li>)}</ol>
            </div>
            <nav className="lesson-toc" aria-label="محتويات الدرس">
              <span>في هذا الدرس</span>
              <a href="#answer">الإجابة المباشرة</a>
              {lesson.sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}
              <a href="#practice">التطبيق العملي</a>
              <a href="#mistakes">الأخطاء الشائعة</a>
              <a href="#faq">الأسئلة الشائعة</a>
              <a href="#sources">المصادر</a>
            </nav>
          </aside>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
