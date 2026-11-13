"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { getQuestions, getService, validAnswer, type AnswerMap, type ChatTurn, chatPrivateFields, maxChatTurns } from "@/lib/service-orders";
import s from "../orders.module.css";

export function ServiceChat({ slug }: { slug: string }) {
  const service = getService(slug)!;
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState("");
  const [useAi, setUseAi] = useState(false);
  const [conversation, setConversation] = useState<ChatTurn[]>([]);
  const [message, setMessage] = useState("");
  const [generating, setGenerating] = useState(false);
  const conversationBusy = useRef(false);
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

  async function talk(value: string, mode: "inquiry" | "followup", updated: AnswerMap = answers) {
    if (!useAi || conversationBusy.current || conversation.length >= maxChatTurns - 1) return;
    conversationBusy.current = true;
    setGenerating(true);
    const turn: ChatTurn = { role: "customer", text: value };
    const thread = [...conversation, turn];
    if (mode === "inquiry") setMessage("");
    setConversation(thread);
    let reply = "تعذّر الحصول على رد الآن. يمكنك متابعة الطلب وسيطّلع الفريق على رسالتك.";
    try {
      const response = await fetch("/api/service-chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(9500),
        body: JSON.stringify({
          service: slug, consent: true, mode, message: value,
          history: conversation.slice(-6),
          answers: Object.fromEntries(Object.entries(updated).map(([id, answer]) =>
            [id, chatPrivateFields.has(id) ? "" : answer.slice(0, 300)])),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (typeof data.reply === "string") reply = data.reply;
      }
    } catch {
      // Keep the request usable when the assistant is unavailable.
    } finally {
      setConversation([...thread, { role: "assistant", text: reply }]);
      conversationBusy.current = false;
      setGenerating(false);
    }
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
    if (!question.options && !chatPrivateFields.has(question.id) &&
      ["business", "purpose", "goal", "campaign"].includes(question.id) && value.trim()) {
      void talk(value.trim().slice(0, 600), "followup", activeAnswers);
    }
    setDraft("");
    setError("");
    focusNext();
  }

  function edit(at: number) {
    setDraft(answers[questions[at].id] ?? "");
    const updated = { ...answers };
    delete updated[questions[at].id];
    setAnswers(updated);
    setError("");
    focusNext();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || conversationBusy.current) return;
    if (message.trim()) {
      setError("أرسل الرسالة المكتوبة أو امسحها قبل إرسال الطلب.");
      return;
    }
    inFlight.current = true;
    setBusy(true);
    setError("");
    requestId.current ||= crypto.randomUUID();
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/service-orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: slug, answers, conversation, id: requestId.current, website: form.get("website"), consent: form.get("consent") === "on" }),
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
    <label className={s.consent}>
      <input type="checkbox" checked={useAi} disabled={generating || busy} onChange={event => setUseAi(event.target.checked)} />
      {" "}تفعيل المحادثة مع المساعد الذكي
      <p>عند التفعيل، تُرسل رسائلك ومقتطفات من وصف المشروع إلى OpenRouter للرد عليك. تجنّب المعلومات السرية. <Link href="/privacy">سياسة الخصوصية</Link></p>
    </label>
    {(useAi || conversation.length > 0) && <section aria-label="المحادثة مع مساعد الخدمة">
      <div className={s.chatThread} role="log" aria-live="polite">
        {conversation.map((turn, i) => <div key={i} className={turn.role === "customer" ? s.previous : s.bubble}>
          <strong>{turn.role === "customer" ? "أنت" : "مساعد لوسيل"}</strong>
          <p>{turn.text}</p>
        </div>)}
        {generating && <p role="status">جارٍ إعداد الرد…</p>}
      </div>
      {useAi && conversation.length < maxChatTurns - 1 && <form onSubmit={event => {
        event.preventDefault();
        if (message.trim()) void talk(message.trim(), "inquiry");
      }}>
        <label>استفسار عن الخدمة أو رد على المساعد
          <textarea rows={2} maxLength={600} value={message} onChange={event => setMessage(event.target.value)}
            placeholder="اكتب استفسارك أو أضف تفاصيل عن مشروعك" required disabled={generating || busy} />
        </label>
        <button className={s.secondary} disabled={generating || busy || !message.trim()}>إرسال الرسالة</button>
      </form>}
      {useAi && conversation.length >= maxChatTurns - 1 && <p>يمكنك إضافة بقية التفاصيل في خانة الملاحظات ضمن الطلب.</p>}
    </section>}
    {question && index > 0 && <div className={s.previous}>
      <span>{questions[index - 1].label}</span>
      <p>{answers[questions[index - 1].id] || "تم التخطي"}</p>
    </div>}
    {question ? <fieldset key={question.id} disabled={generating || busy}>
      <div className={s.bubble} aria-live="polite">
        <h2 id="active-question">{question.label}</h2>
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
    </fieldset> : <form onSubmit={submit}>
      <dl className={s.review}>{questions.map((item, i) => <div key={item.id}>
        <dt>{item.label}</dt><dd>{answers[item.id] || "تم التخطي"}</dd>
        <button type="button" className={s.textButton} disabled={busy} onClick={() => edit(i)} aria-label={`تعديل إجابة: ${item.label}`}>تعديل</button>
      </div>)}</dl>
      <label className={s.trap} aria-hidden="true">اترك الحقل فارغًا<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className={s.consent}><input type="checkbox" name="consent" required /> أوافق على استخدام بياناتي لمراجعة الطلب والتواصل معي وفق <Link href="/privacy">سياسة الخصوصية</Link>.</label>
      <button className={s.primary} disabled={busy || generating}>{busy ? "جارٍ إرسال الطلب…" : "إرسال الطلب"}</button>
    </form>}
    {error && <p className={s.error} role="alert">{error}</p>}
  </div>;
}
