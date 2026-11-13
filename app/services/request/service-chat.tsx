"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { getQuestions, getService, validAnswer, type AnswerMap } from "@/lib/service-orders";
import s from "../orders.module.css";

export function ServiceChat({ slug }: { slug: string }) {
  const service = getService(slug)!;
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState("");
  const [useAi, setUseAi] = useState(false);
  const [generated, setGenerated] = useState<{ id: string; question: string } | null>(null);
  const [generating, setGenerating] = useState(false);
  const generation = useRef<AbortController | null>(null);
  const requestId = useRef("");
  const inFlight = useRef(false);
  const field = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const questions = getQuestions(service, answers);
  const index = questions.findIndex(question => !(question.id in answers));
  const question = questions[index];

  function focusNext() {
    requestAnimationFrame(() => (field.current ?? panel.current)?.focus());
  }

  function cancelGeneration() {
    generation.current?.abort();
    generation.current = null;
    setGenerated(null);
    setGenerating(false);
  }

  function generateQuestion(updated: AnswerMap) {
    cancelGeneration();
    const next = getQuestions(service, updated).find(item => !(item.id in updated));
    if (!useAi || !next || next.options || ["name", "email", "references", "current", "footage-link"].includes(next.id)) return;

    const controller = new AbortController();
    generation.current = controller;
    setGenerating(true);
    void fetch("/api/service-chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        service: slug, consent: true,
        answers: Object.fromEntries(Object.entries(updated).map(([id, answer]) =>
          [id, ["name", "email", "references", "current", "footage-link"].includes(id) ? "" : answer])),
      }),
    }).then(async response => {
      if (!response.ok) return;
      const data = await response.json();
      if (!controller.signal.aborted && data.id === next.id && typeof data.question === "string") {
        setGenerated({ id: next.id, question: data.question });
      }
    }).catch(() => {
      // The standard question remains available when generation fails.
    }).finally(() => {
      if (!controller.signal.aborted) setGenerating(false);
    });
  }

  function reply(value: string) {
    if (!question || !validAnswer(question, value.trim())) {
      setError("تحقق من الإجابة وأكمل الحقل المطلوب.");
      return;
    }
    const updated = { ...answers, [question.id]: value.trim() };
    const activeIds = new Set(getQuestions(service, updated).map(item => item.id));
    const activeAnswers = Object.fromEntries(Object.entries(updated).filter(([id]) => activeIds.has(id)));
    setAnswers(activeAnswers);
    generateQuestion(activeAnswers);
    setDraft("");
    setError("");
    focusNext();
  }

  function edit(at: number) {
    cancelGeneration();
    setDraft(answers[questions[at].id] ?? "");
    const updated = { ...answers };
    delete updated[questions[at].id];
    setAnswers(updated);
    setError("");
    focusNext();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    requestId.current ||= crypto.randomUUID();
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/service-orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: slug, answers, id: requestId.current, website: form.get("website"), consent: form.get("consent") === "on" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "تعذّر حفظ الطلب. جرّب مرة أخرى.");
        return;
      }
      setReceipt(data.id);
      focusNext();
    } catch {
      setError("تعذّر الاتصال. إجاباتك ما زالت هنا، ويمكنك إعادة المحاولة.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  if (receipt) return <div className={s.panel} tabIndex={-1} ref={panel}>
    <h2>تم استلام طلبك</h2>
    <p>احتفظ برقم الطلب. سيراجع الفريق إجاباتك ويتواصل معك على البريد الذي أدخلته.</p>
    <p><strong>رقم الطلب</strong> <bdi className={s.reference}>{receipt}</bdi></p>
    <Link className={s.back} href="/services">العودة إلى الخدمات</Link>
  </div>;

  return <div className={s.panel} tabIndex={-1} ref={panel}>
    <div className={s.progress}>
      <strong>{question ? "مساعد طلب الخدمة" : "راجع طلبك"}</strong>
      <span>{question ? `السؤال ${index + 1} من ${questions.length}` : "قبل الإرسال"}</span>
    </div>
    <progress max={questions.length} value={question ? index : questions.length} aria-label="تقدّم الطلب" />
    {question && <label className={s.consent}>
      <input type="checkbox" checked={useAi} onChange={event => {
        setUseAi(event.target.checked);
        cancelGeneration();
      }} /> خصّص أسئلتي بالذكاء الاصطناعي
      <p>عند التفعيل، نرسل مقتطفات من وصف المشروع إلى OpenRouter لصياغة الأسئلة. تجنّب إدخال معلومات سرية. <Link href="/privacy">سياسة الخصوصية</Link></p>
    </label>}
    {question && index > 0 && <div className={s.previous}>
      <span>{questions[index - 1].label}</span>
      <p>{answers[questions[index - 1].id] || "تم التخطي"}</p>
    </div>}
    {question ? <div key={question.id}>
      <div className={s.bubble} aria-live="polite">
        <h2 id="active-question">{generated?.id === question.id ? generated.question : question.label}</h2>
        {generated?.id === question.id && <p>{question.label}</p>}
        {generating && <p role="status">جارٍ تخصيص السؤال…</p>}
        {question.hint && <p>{question.hint}</p>}
      </div>
      {question.options ? <div className={s.choices} role="group" aria-labelledby="active-question">
        {question.options.map((option, i) => <button ref={i === 0 ? element => { field.current = element; } : undefined} key={option} type="button" onClick={() => reply(option)}>{option}</button>)}
      </div> : <form onSubmit={event => { event.preventDefault(); reply(draft); }}>
        {question.email
          ? <input ref={element => { field.current = element; }} aria-labelledby="active-question" type="email" autoComplete="email" dir="ltr" maxLength={254} required value={draft} onChange={event => setDraft(event.target.value)} />
          : <textarea ref={element => { field.current = element; }} aria-labelledby="active-question" rows={3} maxLength={question.id === "name" ? 120 : 1600} required={!question.optional} value={draft} onChange={event => setDraft(event.target.value)} placeholder="اكتب إجابتك هنا" />}
        <div className={s.actions}><button className={s.primary}>{question.optional && !draft.trim() ? "تخطّي" : "متابعة"} ←</button></div>
      </form>}
      {index > 0 && <button className={s.textButton} type="button" onClick={() => edit(index - 1)}>السؤال السابق</button>}
    </div> : <form onSubmit={submit}>
      <dl className={s.review}>{questions.map((item, i) => <div key={item.id}>
        <dt>{item.label}</dt><dd>{answers[item.id] || "تم التخطي"}</dd>
        <button type="button" className={s.textButton} disabled={busy} onClick={() => edit(i)} aria-label={`تعديل إجابة: ${item.label}`}>تعديل</button>
      </div>)}</dl>
      <label className={s.trap} aria-hidden="true">اترك الحقل فارغًا<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className={s.consent}><input type="checkbox" name="consent" required /> أوافق على استخدام بياناتي لمراجعة الطلب والتواصل معي وفق <Link href="/privacy">سياسة الخصوصية</Link>.</label>
      <button className={s.primary} disabled={busy}>{busy ? "جارٍ إرسال الطلب…" : "إرسال الطلب"}</button>
    </form>}
    {error && <p className={s.error} role="alert">{error}</p>}
  </div>;
}
