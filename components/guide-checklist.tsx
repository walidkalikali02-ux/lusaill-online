"use client";

import { useState } from "react";

export function GuideChecklist({ steps }: { steps: string[] }) {
  const [checked, setChecked] = useState<number[]>([]);
  return <section id="checklist" className="brief-box guide-checklist">
    <h2>قائمة متابعة التنفيذ</h2>
    <p>علّم ما راجعته أثناء اتباع الدليل. هذه متابعة شخصية للخطوات؛ لا تؤكد قبول طلب أو اكتمال إجراء لدى الجهة الرسمية. تُمسح العلامات عند إعادة تحميل الصفحة.</p>
    <p role="status" aria-live="polite">راجعت {checked.length} من {steps.length} خطوات</p>
    <ul>{steps.map((title, index) => <li key={`${index}-${title}`}>
      <label><input type="checkbox" checked={checked.includes(index)} onChange={(event) => {
        setChecked((previous) => event.target.checked ? [...previous, index] : previous.filter((value) => value !== index));
      }} /> <span>{title}</span></label>
      <a href={`#step-${index + 1}`}>شرح الخطوة {index + 1}</a>
    </li>)}</ul>
    <div className="checklist-actions"><button className="button button-secondary" type="button" onClick={() => setChecked([])}>مسح العلامات</button>
      <button className="button button-secondary" type="button" onClick={() => window.print()}>طباعة الدليل</button></div>
  </section>;
}
