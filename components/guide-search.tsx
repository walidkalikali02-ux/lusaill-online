"use client";
import { useState } from "react";
import Link from "next/link";
type SearchItem = { slug: string; title: string; keyword: string; quickAnswer?: string };
const normalize = (value: string) => value.normalize("NFKC").replace(/[ً-ْ]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").toLowerCase();
export function GuideSearch({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  const matches = words.length ? items.filter((a) => words.every((word) => normalize(`${a.title} ${a.keyword} ${a.quickAnswer ?? ""}`).includes(word))).slice(0, 6) : [];
  return <div className="search-bar">
    <input type="search" placeholder="مثال: تجديد رخصة السيارة أو نسخ الهاتف" aria-label="بحث في الأدلة" aria-controls="guide-search-results" value={query} onChange={(e) => setQuery(e.target.value)} />
    {words.length > 0 && <div id="guide-search-results" className="search-suggestions active" aria-live="polite">
      {matches.length ? matches.map((a) => <Link key={a.slug} className="search-suggestion" href={`/articles/${a.slug}`} onClick={() => setQuery("")}><div className="search-suggestion-title">{a.title}</div><div className="search-suggestion-meta">{a.quickAnswer?.slice(0, 80) ?? a.keyword}</div></Link>) : <p className="search-suggestion">لم نجد نتيجة؛ جرّب اسم الخدمة أو <Link href="/categories">تصفح التصنيفات</Link>.</p>}
    </div>}
  </div>;
}
