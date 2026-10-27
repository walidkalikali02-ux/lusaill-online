import type { Metadata } from "next";
import Link from "next/link";
import { GuideSearch } from "@/components/guide-search";
import { articles } from "@/lib/content";
import { searchGuides } from "@/lib/guide-search";
import { pageAlternates } from "@/lib/page-alternates";
export const metadata: Metadata = { title: "البحث في الأدلة", description: "ابحث عن الإجراء أو الخدمة التي تحتاجها في أدلة لوسيل.", robots: { index: false, follow: true }, alternates: pageAlternates("/search") };
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const query = (typeof params.q === "string" ? params.q : "").trim().slice(0, 200);
  const published = articles.filter((a) => a.status === "published");
  const results = searchGuides(published, query);
  return <main id="main-content" className="category-page"><div className="shell"><div className="breadcrumbs"><Link href="/">الرئيسية</Link><span>/</span><span>البحث</span></div><h1>البحث في الأدلة</h1>
    <GuideSearch key={query} initialQuery={query} items={published.map(({slug,title,keyword}) => ({slug,title,keyword}))} />
    <p role="status">{query ? `${results.length} نتيجة لعبارة «${query}»` : "اكتب اسم الخدمة أو المشكلة لعرض الأدلة المناسبة."}</p>
    <div className="articles-grid">{results.map((a) => <Link className="article-card" data-task-event="search_result_click" href={`/articles/${a.slug}`} key={a.slug}><h2>{a.title}</h2><p>{a.metaDescription ?? a.quickAnswer?.slice(0,160)}</p><span>اقرأ الدليل ←</span></Link>)}</div>
    {query && !results.length && <p>جرّب كلمات أقل أو <Link href="/categories">تصفح التصنيفات</Link>.</p>}
  </div></main>;
}
