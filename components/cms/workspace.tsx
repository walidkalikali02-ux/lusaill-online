"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  emptyDocument,
  normalizeTopic,
  statuses,
  statusLabels,
  warnings,
  type CmsDocument,
} from "@/lib/cms/model";
import { ReportImport } from "./report-import";
import type { CmsReport } from "@/lib/cms/reports";
import { browserCms } from "@/lib/cms/browser";
const Editor = dynamic(() => import("./editor").then((m) => m.CmsEditor), {
  loading: () => <p>تحميل المحرر…</p>,
});
export function CmsWorkspace({ initial }: { initial: CmsDocument[] }) {
  const router = useRouter();
  const [documents, setDocuments] = useState(initial),
    [selected, setSelected] = useState<CmsDocument | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [filter, setFilter] = useState({
    query: "",
    status: "",
    category: "",
    author: "",
    from: "",
    to: "",
  });
  const [reports, setReports] = useState<CmsReport[]>([]);
  const [widgets, setWidgets] = useState([
    "status",
    "tasks",
    "schedule",
    "sources",
    "seo",
    "search",
  ]);
  useEffect(() => {
    fetch("/api/cms/reports")
      .then((r) => (r.ok ? r.json() : []))
      .then(setReports)
      .catch(() => setError("تعذر تحميل تقارير البحث"));
  }, []);
  useEffect(() => {
    fetch("/api/cms/documents")
      .then(async (r) => {
        if (!r.ok)
          throw Error("تعذر تحميل المسودات؛ تحقق من اتصال قاعدة البيانات");
        const rows: CmsDocument[] = await r.json();
        const saved = localStorage.getItem("lusaill-cms-widgets");
        if (saved) {
          try {
            setWidgets(JSON.parse(saved));
          } catch {}
        }
        setDocuments((prev) => [
          ...rows,
          ...prev.filter((p) => !rows.some((r) => r.id === p.id)),
        ]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const visible = useMemo(
    () =>
      documents.filter(
        (d) =>
          (!filter.query ||
            normalizeTopic(d.title).includes(normalizeTopic(filter.query))) &&
          (!filter.status || d.status === filter.status) &&
          (!filter.category || d.category === filter.category) &&
          (!filter.author || d.author === filter.author) &&
          (!filter.from || d.updatedAt.slice(0, 10) >= filter.from) &&
          (!filter.to || d.updatedAt.slice(0, 10) <= filter.to),
      ),
    [documents, filter],
  );
  const scheduled = visible.filter(
      (d) => d.status === "scheduled" || d.deadline,
    ),
    pending = visible.filter((d) =>
      ["approval", "verification"].includes(d.status),
    ),
    outdated = visible.filter((d) =>
      warnings(d).some((w) => w.includes("مصدر") || w.includes("متأخرة")),
    );
  const urls = new Set(
    visible.map((d) => `https://www.lusaill.online/articles/${d.slug}`),
  );
  const performance = reports.find((r) => r.kind === "performance");
  const performanceRows =
    performance?.rows.filter((r) => urls.has(r.url)) ?? [];
  const clicks = performanceRows.reduce((n, r) => n + (r.clicks ?? 0), 0),
    impressions = performanceRows.reduce((n, r) => n + (r.impressions ?? 0), 0);
  const position = impressions
    ? performanceRows.reduce(
        (n, r) => n + (r.position ?? 0) * (r.impressions ?? 0),
        0,
      ) / impressions
    : null;
  const indexing = reports.find((r) => r.kind === "indexing");
  const indexingRows = indexing?.rows.filter((r) => urls.has(r.url)) ?? [];
  if (selected)
    return (
      <Editor
        key={selected.id}
        initial={selected}
        documents={documents}
        onClose={() => setSelected(null)}
        onSaved={(d) => {
          setDocuments((prev) => [d, ...prev.filter((p) => p.id !== d.id)]);
        }}
      />
    );
  return (
    <div className="cms-shell">
      <aside className="cms-nav">
        <Link className="cms-brand" href="/admin">
          لوسيل <small>إدارة المحتوى</small>
        </Link>
        <p className="cms-nav-active">▦ لوحة التحرير</p>
        <a href="#cms-articles">▤ مكتبة المقالات</a>
        <a href="#cms-tasks">✓ التحقق والاعتماد</a>
        <a href="#cms-schedule">◷ النشر والمواعيد</a>
        <div className="cms-nav-bottom">
          <span>حساب مدير واحد</span>
          <Link href="/">عرض الموقع ↗</Link>
          <button
            onClick={async () => {
              await browserCms().auth.signOut();
              router.replace("/admin/login");
            }}
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>
      <main id="main-content" className="cms-main">
        <header className="cms-top">
          <div>
            <span className="cms-eyebrow">مساحة العمل / نظرة عامة</span>
            <h1>غرفة التحرير</h1>
            <p>محتوى موثّق، مراجعات واضحة، وخطوة تالية لكل مقال.</p>
          </div>
          <button onClick={() => setSelected(emptyDocument())}>
            ＋ مقال جديد
          </button>
        </header>
        {error && (
          <p role="alert" className="cms-notice">
            {error}
          </p>
        )}
        <section className="cms-filters" aria-label="تصفية المقالات">
          <input
            aria-label="بحث بالعنوان"
            placeholder="ابحث عن مقال…"
            value={filter.query}
            onChange={(e) => setFilter({ ...filter, query: e.target.value })}
          />
          {(["status", "category", "author"] as const).map((key) => (
            <select
              key={key}
              aria-label={
                key === "status"
                  ? "الحالة"
                  : key === "category"
                    ? "التصنيف"
                    : "الكاتب"
              }
              value={filter[key]}
              onChange={(e) => setFilter({ ...filter, [key]: e.target.value })}
            >
              <option value="">
                {key === "status"
                  ? "كل الحالات"
                  : key === "category"
                    ? "كل التصنيفات"
                    : "كل الكتّاب"}
              </option>
              {(key === "status"
                ? [...statuses]
                : [...new Set(documents.map((d) => d[key]))]
              )
                .filter(Boolean)
                .map((v) => (
                  <option key={v} value={v}>
                    {key === "status" ? statusLabels[v] : v}
                  </option>
                ))}
            </select>
          ))}
          <label>
            من
            <input
              aria-label="من تاريخ"
              type="date"
              value={filter.from}
              onChange={(e) => setFilter({ ...filter, from: e.target.value })}
            />
          </label>
          <label>
            إلى
            <input
              aria-label="إلى تاريخ"
              type="date"
              value={filter.to}
              onChange={(e) => setFilter({ ...filter, to: e.target.value })}
            />
          </label>
        </section>
        <details className="cms-customize">
          <summary>تخصيص لوحة المدير</summary>
          {["status", "tasks", "schedule", "sources", "seo", "search"].map(
            (w) => (
              <label key={w}>
                <input
                  type="checkbox"
                  checked={widgets.includes(w)}
                  onChange={() => {
                    const next = widgets.includes(w)
                      ? widgets.filter((x) => x !== w)
                      : [...widgets, w];
                    setWidgets(next);
                    localStorage.setItem(
                      "lusaill-cms-widgets",
                      JSON.stringify(next),
                    );
                  }}
                />
                {
                  {
                    status: "الإحصاءات",
                    tasks: "المهام",
                    schedule: "المواعيد",
                    sources: "المصادر",
                    seo: "السيو",
                    search: "أداء البحث",
                  }[w]
                }
              </label>
            ),
          )}
        </details>
        {widgets.includes("status") && (
          <section className="cms-stats">
            {statuses.map((s) => (
              <button
                key={s}
                className="cms-stat"
                onClick={() => setFilter({ ...filter, status: s })}
              >
                <span>{statusLabels[s]}</span>
                <strong>{visible.filter((d) => d.status === s).length}</strong>
                <small>مقال</small>
              </button>
            ))}
          </section>
        )}
        <ReportImport onImported={(r) => setReports((prev) => [r, ...prev])} />
        <div className="cms-panels">
          {widgets.includes("tasks") && (
            <section className="cms-panel" id="cms-tasks">
              <span className="cms-eyebrow">المراجعة أولًا</span>
              <h2>
                بانتظار التحقق والاعتماد <b>{pending.length}</b>
              </h2>
              {pending.slice(0, 5).map((d) => (
                <button
                  className="cms-row"
                  key={d.id}
                  onClick={() => setSelected(d)}
                >
                  {d.title}
                  <span>{statusLabels[d.status]}</span>
                </button>
              ))}
              {!pending.length && <p>لا توجد مهام معلقة ضمن التصفية.</p>}
            </section>
          )}
          {widgets.includes("schedule") && (
            <section className="cms-panel" id="cms-schedule">
              <span className="cms-eyebrow">تقويم المحتوى</span>
              <h2>النشر والمواعيد النهائية</h2>
              {scheduled.slice(0, 5).map((d) => (
                <button
                  className="cms-row"
                  key={d.id}
                  onClick={() => setSelected(d)}
                >
                  {d.title}
                  <time>{d.scheduledAt || d.deadline}</time>
                </button>
              ))}
              {!scheduled.length && (
                <p>لا توجد منشورات مجدولة أو مواعيد مسجلة.</p>
              )}
            </section>
          )}
          {widgets.includes("sources") && (
            <section className="cms-panel">
              <h2>
                مصادر ومحتوى يحتاج مراجعة <b>{outdated.length}</b>
              </h2>
              {outdated.slice(0, 4).map((d) => (
                <button
                  className="cms-row"
                  key={d.id}
                  onClick={() => setSelected(d)}
                >
                  {d.title}
                  <span>
                    {warnings(d).find(
                      (w) => w.includes("مصدر") || w.includes("متأخرة"),
                    )}
                  </span>
                </button>
              ))}
            </section>
          )}
          {widgets.includes("seo") && (
            <section className="cms-panel">
              <h2>تنبيهات السيو التحريرية</h2>
              <p>
                {visible.filter((d) => warnings(d).length).length} مقالًا يحتاج
                فحصًا. هذه مراجعة بيانات المقال وليست تقرير فهرسة Google.
              </p>
              <p className="cms-muted">
                {indexing
                  ? `${indexingRows.length} رابطًا في تقرير: ${indexing.reason} · تاريخ ${indexing.to}`
                  : "حالة الفهرسة: لم يتم استيراد تقرير Search Console بعد."}
              </p>
            </section>
          )}
          {widgets.includes("search") && (
            <section className="cms-panel cms-search-metrics">
              <h2>أداء البحث العضوي للمقالات في التصفية</h2>
              <div>
                {[
                  ["النقرات", performance ? clicks : "—"],
                  ["مرات الظهور", performance ? impressions : "—"],
                  [
                    "CTR",
                    impressions
                      ? `${((clicks / impressions) * 100).toFixed(2)}%`
                      : "—",
                  ],
                  ["متوسط الترتيب المحسوب", position?.toFixed(1) ?? "—"],
                ].map(([name, value]) => (
                  <p key={name}>
                    {name}
                    <strong>{value}</strong>
                  </p>
                ))}
              </div>
              <p>
                {performance
                  ? `لقطة من ملف الصفحات: ${performance.from} — ${performance.to} · ${performanceRows.length} صفًا مطابقًا للتصفية · استيراد ${performance.importedAt.slice(0, 10)}`
                  : "استورد ملف أداء الصفحات لعرض قياسات فعلية. لا يوجد اتصال مباشر حاليًا."}
              </p>
            </section>
          )}
        </div>
        <section className="cms-panel" id="cms-articles">
          <div className="cms-section-head">
            <h2>مكتبة المقالات</h2>
            <span>
              {visible.length} مقالًا {loading ? "· تحميل المسودات…" : ""}
            </span>
          </div>
          <div className="cms-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>المقال</th>
                  <th>الحالة</th>
                  <th>التصنيف</th>
                  <th>آخر تعديل</th>
                  <th>المراجعة</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <button
                        className="cms-title-button"
                        onClick={() => setSelected(d)}
                      >
                        {d.title}
                      </button>
                      <small dir="ltr">/{d.slug}</small>
                    </td>
                    <td>
                      <span className={`cms-badge cms-${d.status}`}>
                        {statusLabels[d.status]}
                      </span>
                    </td>
                    <td>{d.category || "غير محدد"}</td>
                    <td>{d.updatedAt.slice(0, 10) || "غير مسجل"}</td>
                    <td>
                      {warnings(d).length
                        ? `${warnings(d).length} تنبيه`
                        : "جاهز للمراجعة"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!visible.length && <p>لا توجد نتائج تطابق التصفية.</p>}
        </section>
      </main>
    </div>
  );
}
