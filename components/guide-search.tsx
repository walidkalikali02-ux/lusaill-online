"use client";
import { useId, useState } from "react";
import Link from "next/link";
import { searchGuides, type SearchItem } from "@/lib/guide-search";
export function GuideSearch({ items, initialQuery = "" }: { items: SearchItem[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const id = useId();
  const matches = searchGuides(items, query);
  const showSuggestions = Boolean(query.trim()) && query !== initialQuery;
  return <form className="search-bar" role="search" action="/search" method="get">
    <input name="q" type="search" maxLength={200} placeholder="مثال: تجديد رخصة القيادة أو فاتورة الكهرباء" aria-label="بحث في الأدلة" aria-controls={showSuggestions ? id : undefined} value={query} onChange={(e) => setQuery(e.target.value)} />
    <button className="button button-primary search-submit" type="submit">بحث</button>
    {showSuggestions && <div id={id} className="search-suggestions active" aria-live="polite">
      {matches.slice(0, 6).map((a) => <Link key={a.slug} className="search-suggestion" data-task-event="search_result_click" href={`/articles/${a.slug}`} onClick={() => setQuery("")}><div className="search-suggestion-title">{a.title}</div></Link>)}
      {matches.length ? <Link className="search-suggestion" href={`/search?${new URLSearchParams({ q: query })}`}>عرض كل النتائج ({matches.length})</Link> : <p className="search-suggestion">لم نجد نتيجة؛ جرّب اسم الخدمة أو <Link href="/categories">تصفح التصنيفات</Link>.</p>}
    </div>}
  </form>;
}
