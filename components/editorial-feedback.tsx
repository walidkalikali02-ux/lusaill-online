"use client";
import { useState } from "react";
export function EditorialFeedback() {
  const [page, setPage] = useState("");
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState("تصحيح معلومة");
  const body = `نوع الملاحظة: ${kind}\nرابط الصفحة: ${page}\n\n${message}\n\nهذه ملاحظة عامة عن محتوى الموقع، دون بيانات شخصية.`;
  const href = `https://github.com/walidkalikali02-ux/lusaill-online/issues/new?${new URLSearchParams({ title: `${kind} في لوسيل`, body })}`;
  return <section className="feedback-form"><h2>جهّز ملاحظتك</h2>
    <p>تكتب الملاحظة هنا ثم تراجعها على GitHub قبل إرسالها. لا يُرسل شيء عند الكتابة، وقد تحتاج إلى حساب GitHub؛ البلاغ النهائي علني.</p>
    <label>نوع الملاحظة<select value={kind} onChange={(e) => setKind(e.target.value)}><option>تصحيح معلومة</option><option>رابط معطل</option><option>مشكلة عرض</option><option>اقتراح دليل</option></select></label>
    <label>رابط صفحة لوسيل<input type="url" value={page} onChange={(e) => setPage(e.target.value)} placeholder="https://www.lusaill.online/articles/..." maxLength={500} /></label>
    <label>الملاحظة العامة<textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} maxLength={2000} placeholder="صف المشكلة وأضف المصدر الرسمي إن وجد. لا تكتب بيانات شخصية." /></label>
    {message.trim() ? <a className="button button-primary" href={href} target="_blank" rel="noopener noreferrer">راجع البلاغ على GitHub</a> : <p>اكتب وصفًا للمشكلة لإعداد البلاغ.</p>}
  </section>;
}
