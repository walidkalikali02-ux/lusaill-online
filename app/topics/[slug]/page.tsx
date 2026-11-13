import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { encyclopediaCategories, getEncyclopediaCategory } from "@/lib/encyclopedia-taxonomy";
import { getCategoryUrl, getEncyclopediaCategoryItems, getEncyclopediaSubtopicItems } from "@/lib/encyclopedia-catalog";
import { pageAlternates } from "@/lib/page-alternates";
import { absoluteUrl } from "@/lib/site-config";
import { isSearchReadyHref } from "@/lib/editorial-indexing";
import styles from "./topic.module.css";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ section?: string | string[]; page?: string | string[] }> };
export const dynamicParams = false;
export const revalidate = 3600;
export function generateStaticParams() { return encyclopediaCategories.map(category => ({ slug: category.slug })); }

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const category = getEncyclopediaCategory(slug);
  if (!category) return { robots: { index: false, follow: false } };
  const count = getEncyclopediaCategoryItems(category).filter(item => isSearchReadyHref(item.href)).length;
  const filtered = typeof query.section === "string" && category.subtopics.includes(query.section);
  const page = typeof query.page === "string" ? Number(query.page) : 1;
  return {
    title: `${category.title} | فئات موسوعة لوسيل`,
    description: `${category.summary} تصفح التخصصات الفرعية والمقالات المتاحة في قسم ${category.title} من موسوعة لوسيل.`,
    alternates: pageAlternates(getCategoryUrl(category)),
    robots: { index: count >= 2 && !filtered && !(page > 1), follow: true },
    openGraph: { title: `${category.title} | موسوعة لوسيل`, description: category.summary, url: getCategoryUrl(category), type: "website" },
  };
}

export default async function TopicPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const category = getEncyclopediaCategory(slug);
  if (!category) notFound();
  const section = typeof query.section === "string" && category.subtopics.includes(query.section) ? query.section : undefined;
  const fullList = getEncyclopediaCategoryItems(category);
  const results = section ? getEncyclopediaSubtopicItems(category, section) : fullList;
  const requestedPage = typeof query.page === "string" ? Number.parseInt(query.page, 10) : 1;
  const page = Number.isFinite(requestedPage) ? Math.max(1, Math.min(1000, requestedPage)) : 1;
  const perPage = 24;
  const totalPages = Math.max(1, Math.ceil(results.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const visible = results.slice((currentPage - 1) * perPage, currentPage * perPage);
  const pageUrl = (index: number) => {
    const base = getCategoryUrl(category, section);
    return `${base}${section ? "&" : "?"}page=${index}`;
  };
  const schema = {
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: category.title, url: absoluteUrl(getCategoryUrl(category)),
    description: category.summary, inLanguage: "ar",
    mainEntity: { "@type": "ItemList", numberOfItems: visible.length,
      itemListElement: visible.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.title, url: absoluteUrl(item.href) })),
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "فئات الموسوعة", item: absoluteUrl("/topics") },
      { "@type": "ListItem", position: 3, name: category.title, item: absoluteUrl(getCategoryUrl(category)) },
    ],
  };
  return <main id="main-content" className={styles.page}>
    <div className="shell">
      <nav aria-label="مسار التنقل" className={styles.breadcrumb}><Link href="/knowledge">رئيسية المشروع</Link><span>/</span><Link href="/topics">فئات الموسوعة</Link><span>/</span><span>{category.title}</span></nav>
      <header className={styles.hero}>
        <span className={styles.icon} aria-hidden="true">{category.symbol}</span>
        <div><p className={styles.kicker}>قسم من موسوعة لوسيل</p><h1>{category.title}</h1><p>{category.summary}</p>
          <span className={styles.count}>{fullList.length > 0 ? `${fullList.length} مادة منشورة في هذا المجال` : "يُجهّز محتوى هذا المجال للنشر"}</span></div>
      </header>
      <section className={styles.subsection} aria-labelledby="section-heading">
        <h2 id="section-heading">الموضوعات الفرعية</h2>
        <div className={styles.chips}><Link className={!section ? styles.activeChip : styles.chip} href={getCategoryUrl(category)}>كل موضوعات القسم</Link>
          {category.subtopics.map(item => getEncyclopediaSubtopicItems(category, item).length > 0
            ? <Link key={item} className={section === item ? styles.activeChip : styles.chip} href={getCategoryUrl(category, item)}>{item}</Link>
            : <span key={item} className={styles.waitingChip}>{item}</span>)}</div>
      </section>
      <section aria-labelledby="articles-heading" className={styles.content}>
        <div className={styles.contentHeader}><h2 id="articles-heading">{section ? `المقالات المرتبطة بـ ${section}` : "المقالات والأدلة المنشورة"}</h2><span>{results.length} نتيجة</span></div>
        {visible.length ? <div className={styles.articles}>{visible.map(item => <article key={item.href} className={styles.article}>
          <span className={styles.articleType}>{item.category ?? "مقال"}</span><h3><Link href={item.href}>{item.title}</Link></h3>
          {item.description && <p>{item.description.slice(0, 175)}</p>}
          <Link className={styles.read} href={item.href}>اقرأ الموضوع ←</Link>
        </article>)}</div> :
        <div className={styles.empty}><h3>لم تُنشر مقالات في هذا التخصص بعد</h3><p>هذا الموضوع جزء من خطة توسع الموسوعة. لا نعرض مقالات غير مرتبطة أو صفحات فارغة على أنها منشورة.</p><Link href="/topics">تصفّح الفئات الأخرى ←</Link></div>}
        {totalPages > 1 && <nav className={styles.pagination} aria-label="صفحات المقالات">
          {currentPage > 1 && <Link href={pageUrl(currentPage - 1)}>السابق</Link>}
          <span>صفحة {currentPage} من {totalPages}</span>
          {currentPage < totalPages && <Link href={pageUrl(currentPage + 1)}>التالي</Link>}
        </nav>}
      </section>
      {section && fullList.length > 0 && <section className={styles.other}><h2>من موضوعات {category.title} الأخرى</h2>
        <ul>{fullList.filter(item => !results.some(result => result.href === item.href)).slice(0, 5).map(item =>
          <li key={item.href}><Link href={item.href}>{item.title}</Link></li>)}</ul>
      </section>}
      <div className={styles.back}><Link href="/topics">العودة إلى فهرس الموسوعة الكامل ←</Link></div>
    </div>
    {fullList.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
  </main>;
}
