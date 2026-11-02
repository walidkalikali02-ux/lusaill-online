"use client";
import { useState } from "react";
import type { CmsReport } from "@/lib/cms/reports";
export function ReportImport({
  onImported,
}: {
  onImported: (report: CmsReport) => void;
}) {
  const [kind, setKind] = useState("performance"),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <details className="cms-panel cms-report-import">
      <summary>استيراد تقرير Search Console فعلي (CSV)</summary>
      <p>
        صدّر جدول الصفحات باللغة الإنجليزية. البيانات لقطة من الملف وليست
        اتصالًا مباشرًا؛ لا ترفع تقارير تخص موقعًا آخر.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget),
            file = f.get("file");
          if (!(file instanceof File) || file.size > 3000000) {
            setMessage("اختر CSV أصغر من 3 MB");
            return;
          }
          setBusy(true);
          try {
            const r = await fetch("/api/cms/reports", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                kind,
                from: f.get("from"),
                to: f.get("to"),
                reason: f.get("reason") || "",
                csv: await file.text(),
              }),
            });
            const data = await r.json();
            if (!r.ok) throw Error(data.error);
            onImported(data);
            setMessage(`تم استيراد ${data.rows.length} صفًا من الملف`);
          } catch (e) {
            setMessage(e instanceof Error ? e.message : "فشل الاستيراد");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          نوع التقرير
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="performance">أداء الصفحات</option>
            <option value="indexing">صفحات مستبعدة من الفهرسة</option>
          </select>
        </label>
        <label>
          بداية الفترة / تاريخ التقرير
          <input type="date" name="from" required />
        </label>
        <label>
          نهاية الفترة / تاريخ التقرير
          <input type="date" name="to" required />
        </label>
        {kind === "indexing" && (
          <label>
            سبب الاستبعاد الرسمي
            <input
              name="reason"
              required
              placeholder="Discovered – currently not indexed"
            />
          </label>
        )}
        <label>
          ملف CSV
          <input type="file" name="file" accept=".csv,text/csv" required />
        </label>
        <button disabled={busy}>
          {busy ? "جارٍ الاستيراد…" : "استيراد وحفظ"}
        </button>
        <p role="status">{message}</p>
      </form>
    </details>
  );
}
