import type { Metadata } from "next";
import Link from "next/link";
import { GuideSearch } from "@/components/guide-search";
import { getSiteSearchItems } from "@/lib/site-search";
import { searchGuides } from "@/lib/guide-search";
import { pageAlternates } from "@/lib/page-alternates";

export const metadata: Metadata = {
  title: "البحث في موسوعة لوسيل",
  description: "ابحث في مقالات الموسوعة والأدلة والكورسات في العلوم والصحة والتعليم والتقنية والحياة اليومية.",
  robots: { index: false, follow: true },
  alternates: pageAlternates("/search"),
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const query = (typeof params.q === "string" ? params.q : "").trim().slice(0, 200);
  const items = getSiteSearchItems();
  const results = searchGuides(items, query);
  return <main id="main-content" className="category-page"><div className="shell">
    <div className="breadcrumbs"><Link href="/">الرئيسية</Link><span>/</span><span>البحث</span></div>
    <h1>ابحث في موسوعة لوسيل</h1>
    <p>ابحث بين المقالات المعرفية والأدلة العملية والكورسات المتاحة حاليًا.</p>
    <GuideSearch key={query} initialQuery={query} items={items} />
    <p role="status">{query ? `${results.length} نتيجة لعبارة «${query}»` : "اكتب موضوعًا أو سؤالًا للعثور على المحتوى المناسب."}</p>
    <div className="articles-grid">{results.map(item => <Link className="article-card" data-task-event="search_result_click" href={item.href ?? `/articles/${item.slug}`} key={item.slug}>
      {item.category && <span className="article-card-tag">{item.category}</span>}
      <h2>{item.title}</h2><p>{item.description ?? item.quickAnswer?.slice(0, 160) ?? "اكتشف هذا الموضوع في الموسوعة."}</p><span>اقرأ الموضوع ←</span>
    </Link>)}</div>
    {query && !results.length && <p>جرّب كلمات أقل، أو تصفح <Link href="/knowledge">المعارف</Link> و<Link href="/categories">تصنيفات الأدلة</Link>.</p>}
  </div></main>;
}
