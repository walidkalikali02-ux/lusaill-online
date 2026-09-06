"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/content";
import type { Cluster } from "@/lib/clusters";
import { StatusBadge } from "@/components/status-badge";

export function ArticleDirectory({ articles, clusters }: { articles: Article[]; clusters: Cluster[] }) {
  const [query, setQuery] = useState("");
  const [clusterFilter, setClusterFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");

  const filtered = useMemo(() => {
    return articles.filter((article) => {
      if (clusterFilter !== "all" && article.clusterCode !== clusterFilter) return false;
      if (monthFilter !== "all" && String(article.month) !== monthFilter) return false;
      if (query.trim()) {
        const q = query.trim();
        return article.title.includes(q) || article.keyword.includes(q);
      }
      return true;
    });
  }, [articles, clusterFilter, monthFilter, query]);

  return (
    <div>
      <div className="directory-toolbar">
        <input
          type="search"
          placeholder="ابحث بعنوان المقال أو الكلمة المفتاحية…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="بحث في المقالات"
          style={{ flex: 1, minWidth: 220 }}
        />
        <select value={clusterFilter} onChange={(event) => setClusterFilter(event.target.value)} aria-label="تصفية حسب العنقود">
          <option value="all">كل العناقيد</option>
          {clusters.map((cluster) => (
            <option key={cluster.code} value={cluster.code}>{cluster.name}</option>
          ))}
        </select>
        <select value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)} aria-label="تصفية حسب الشهر">
          <option value="all">كل الأشهر</option>
          {[1, 2, 3, 4, 5, 6].map((month) => (
            <option key={month} value={month}>الشهر {month}</option>
          ))}
        </select>
      </div>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 14 }}>{filtered.length} من {articles.length} مقالاً</p>
      <table className="article-table">
        <thead>
          <tr>
            <th>#</th>
            <th>المقال</th>
            <th>الكلمة الأساسية</th>
            <th>الحجم</th>
            <th>KD</th>
            <th>الشهر</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((article) => (
            <tr key={article.slug}>
              <td className="num">{article.id}</td>
              <td><Link href={`/articles/${article.slug}`}>{article.title}</Link></td>
              <td className="kw">{article.keyword}</td>
              <td className="num">{article.volume.toLocaleString("ar-EG")}</td>
              <td className="num">{article.kd ?? "—"}</td>
              <td className="num">{article.month}</td>
              <td><StatusBadge status={article.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
