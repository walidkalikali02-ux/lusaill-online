"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
type Suggestions = { query: string; items: { slug: string; title: string }[]; total: number; error?: boolean };
export function GuideSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<Suggestions>({ query: "", items: [], total: 0 });
  const id = useId();
  const showSuggestions = Boolean(query.trim()) && query !== initialQuery;
  useEffect(() => {
    if (!query.trim() || query === initialQuery) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      void fetch(`/api/guide-search?${new URLSearchParams({ q: query })}`, { signal: controller.signal })
        .then(async response => { if (!response.ok) throw Error("SEARCH_UNAVAILABLE"); return response.json(); })
        .then(data => { if (!controller.signal.aborted) setResult({ query, items: data.items, total: data.total }); })
        .catch(() => { if (!controller.signal.aborted) setResult({ query, items: [], total: 0, error: true }); });
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, initialQuery]);
  const ready = result.query === query;
  return <form className="search-bar" role="search" action="/search" method="get">
    <input name="q" type="search" maxLength={200} autoComplete="off" placeholder="مثال: تجديد رخصة القيادة أو فاتورة الكهرباء" aria-label="بحث في الأدلة" aria-controls={showSuggestions ? id : undefined} value={query} onChange={event => setQuery(event.target.value)} />
    <button className="button button-primary search-submit" type="submit">بحث</button>
    {showSuggestions && <div id={id} className="search-suggestions active" aria-live="polite" aria-busy={!ready}>
      {!ready ? <p className="search-suggestion">جارٍ البحث…</p> : result.error ? <p className="search-suggestion">تعذر عرض الاقتراحات. استخدم زر البحث لعرض النتائج.</p> : <>
        {result.items.map(article => <Link key={article.slug} className="search-suggestion" data-task-event="search_result_click" href={`/articles/${article.slug}`} onClick={() => setQuery("")}><div className="search-suggestion-title">{article.title}</div></Link>)}
        {result.total ? <Link className="search-suggestion" href={`/search?${new URLSearchParams({ q: query })}`}>عرض كل النتائج ({result.total})</Link> : <p className="search-suggestion">لم نجد نتيجة؛ جرّب اسم الخدمة أو <Link href="/categories">تصفح التصنيفات</Link>.</p>}
      </>}
    </div>}
  </form>;
}
