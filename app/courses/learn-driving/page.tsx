import { pageAlternates } from "@/lib/page-alternates";
import type { Metadata } from "next";
import { CourseArt } from "@/components/course-art";
import Link from "next/link";
import { courseMeta, drivingLessons } from "@/lib/driving-course";
import { absoluteUrl, siteConfig, siteSocialImage } from "@/lib/site-config";

const coursePath = "/courses/learn-driving";

export const metadata: Metadata = {
  title: courseMeta.title,
  description: courseMeta.description,
  alternates: pageAlternates(coursePath),
  openGraph: {
    type: "website",
    title: courseMeta.title,
    description: courseMeta.description,
    url: coursePath,
    images: [siteSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: courseMeta.title,
    description: courseMeta.description,
    images: [siteSocialImage.url],
  },
};

export default function DrivingCoursePage() {
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${absoluteUrl(coursePath)}#course`,
    name: courseMeta.title,
    description: courseMeta.description,
    url: absoluteUrl(coursePath),
    inLanguage: "ar",
    provider: { "@id": `${siteConfig.url}/#organization` },
    datePublished: courseMeta.publishedAt,
    dateModified: courseMeta.updatedAt,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${drivingLessons.reduce((sum, lesson) => sum + Number.parseInt(lesson.duration, 10), 0)}M`,
    },
    syllabusSections: drivingLessons.map((lesson) => ({
      "@type": "Syllabus",
      position: lesson.order,
      name: lesson.title,
      description: lesson.quickAnswer,
    })),
  };
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: drivingLessons.map((lesson) => ({
      "@type": "ListItem",
      position: lesson.order,
      name: lesson.title,
      url: absoluteUrl(`${coursePath}/${lesson.slug}`),
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "الكورسات", item: absoluteUrl("/courses") },
      { "@type": "ListItem", position: 3, name: courseMeta.shortTitle, item: absoluteUrl(coursePath) },
    ],
  };

  return (
    <main id="main-content" className="course-page">
      <section className="course-hero">
        <div className="shell course-hero-grid">
          <div className="course-hero-copy">
            <div className="breadcrumbs course-breadcrumbs">
              <Link href="/">الرئيسية</Link><span>/</span><Link href="/courses">الكورسات</Link><span>/</span><span>تعلم القيادة</span>
            </div>
            <span className="course-kicker">مسار عملي من الصفر · {drivingLessons.length} دروس مترابطة</span>
            <h1>{courseMeta.title}</h1>
            <p>{courseMeta.description}</p>
            <div className="course-hero-actions">
              <Link className="button button-primary" href={`${coursePath}/${drivingLessons[0].slug}`}>ابدأ الدرس الأول</Link>
              <a className="button button-secondary" href="#course-plan">شاهد خطة الكورس</a>
            </div>
            <div className="course-facts" aria-label="معلومات الكورس">
              <span><strong>{drivingLessons.length}</strong> دروس</span>
              <span><strong>مبتدئ</strong> المستوى</span>
              <span><strong>مكتوب</strong> مع تمارين</span>
            </div>
          </div>
          <figure className="course-hero-visual">
            <CourseArt />
            <figcaption>دروس تقرؤها على مهلك، وتمارين تراجعها مع مدرب مؤهل.</figcaption>
          </figure>
        </div>
      </section>

      <section className="course-principles">
        <div className="shell course-principles-grid">
          <div><span>01</span><h2>افهم</h2><p>إجابة مباشرة ومبدأ واحد واضح قبل التفاصيل.</p></div>
          <div><span>02</span><h2>تصوّر</h2><p>صور ورسوم توضيحية تساعدك على فهم المهارة.</p></div>
          <div><span>03</span><h2>طبّق</h2><p>تمرين قصير ومعيار نجاح تنفذه مع مدرب مؤهل.</p></div>
        </div>
      </section>

      <section className="section" id="course-plan">
        <div className="shell">
          <div className="section-header course-plan-header">
            <span className="section-eyebrow">خطة واضحة من البداية إلى الطريق</span>
            <h2>دروس كورس تعلم القيادة</h2>
            <p>اتبع الدروس بالترتيب؛ كل درس يبني على المهارة التي قبله وينتهي بتمرين وقائمة تحقق.</p>
          </div>
          <ol className="lesson-list">
            {drivingLessons.map((lesson) => (
              <li key={lesson.slug}>
                <Link href={`${coursePath}/${lesson.slug}`} className="lesson-card">
                  <span className="lesson-order">{String(lesson.order).padStart(2, "0")}</span>
                  <div className="lesson-card-copy">
                    <span className="lesson-duration">الدرس {lesson.order} · {lesson.duration}</span>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.quickAnswer}</p>
                  </div>
                  <span className="lesson-arrow" aria-hidden="true">←</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-alt">
        <div className="shell course-safety">
          <span className="course-safety-icon" aria-hidden="true">!</span>
          <div>
            <h2>قبل التطبيق العملي</h2>
            <p>{courseMeta.safetyNote}</p>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
