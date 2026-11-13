"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { chatPrivateFields, getQuestions, getService, getServiceBrief, mergeServiceAnswers, validAnswer, type AnswerMap, type ChatTurn } from "@/lib/service-orders";
import studio from "../studio.module.css";
import s from "./request.module.css";

const skip = "تم التخطي";
const extraMessageLimit = 28;
const inquiryPattern = /[؟?]|^(هل|كم|كيف|متى|ما هو|ما هي|وش|ايش|إيش|ممكن)\s/u;

function Bubble({ role, children }: { role: ChatTurn["role"]; children: ReactNode }) {
  return <div className={s.bubble} data-role={role}>
    <span>{role === "customer" ? "أنت" : "مساعد لوسيل"}</span>
    {children}
  </div>;
}

export function ServiceChat({ slug }: { slug: string }) {
  const service = getService(slug)!;
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [conversation, setConversation] = useState<ChatTurn[]>(() => [
    { role: "assistant", text: getQuestions(service, {})[0].label },
  ]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [receipt, setReceipt] = useState("");
  const inFlight = useRef(false);
  const requestId = useRef("");
  const thread = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const panel = useRef<HTMLElement>(null);
  const review = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);

  const questions = getQuestions(service, answers);
  const question = questions.find(item => !(item.id in answers));
  const completed = questions.filter(item => item.id in answers).length;
  const brief = question ? "" : getServiceBrief(service, answers, conversation);

  useEffect(() => {
    if (thread.current) thread.current.scrollTop = thread.current.scrollHeight;
    if (!moveFocus.current || generating || busy) return;
    moveFocus.current = false;
    (receipt ? panel.current : question ? field.current : review.current)?.focus({ preventScroll: true });
  }, [conversation, question, generating, busy, receipt]);

  async function send(value: string, skipping = false) {
    const text = value.trim();
    if (inFlight.current || (!text && !skipping)) return;
    if (conversation.length >= extraMessageLimit && !question) {
      setError("راجع الملخص وأرسل الطلب. يمكنك تعديل أي إجابة من الملخص.");
      return;
    }

    const privateField = question && chatPrivateFields.has(question.id);
    const isInquiry = inquiryPattern.test(text);
    const exactOption = question?.options?.find(option => option === text);
    if (question?.email && !isInquiry && !validAnswer(question, text)) {
      setError("أدخل بريدًا إلكترونيًا صحيحًا.");
      return;
    }
    if (question?.id === "name" && !isInquiry && !validAnswer(question, text)) {
      setError("أدخل اسمك في 120 حرفًا أو أقل.");
      return;
    }

    const local = question && (skipping || exactOption || (privateField && !isInquiry))
      ? { [question.id]: skipping ? "" : text } : null;
    if (!local && conversation.length >= extraMessageLimit && (!question || isInquiry || !validAnswer(question, text))) {
      setError("تابع بالسؤال الحالي أو اختر أحد الخيارات المعروضة.");
      return;
    }
    if (conversation.length >= 49) {
      setError("وصلت المحادثة إلى الحد الأقصى. يمكنك مراجعة الطلب أو البدء من جديد.");
      return;
    }
    const turns: ChatTurn[] = [...conversation, { role: "customer", text: skipping ? skip : text }];
    setDraft("");
    setError("");
    setConversation(turns);
    moveFocus.current = true;
    inFlight.current = true;

    let additions: AnswerMap = local ?? {};
    let reply = "";
    if (!local) {
      setGenerating(true);
      try {
        if (conversation.length >= extraMessageLimit) throw new Error("limit");
        const response = await fetch("/api/service-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(11000),
          body: JSON.stringify({
            service: slug, consent: true, mode: "auto",
            // A contact field never enters the AI prompt. The server also scrubs free text.
            message: text,
            history: conversation.filter(turn => turn.role === "assistant").slice(-4),
            answers: Object.fromEntries(Object.entries(answers).map(([id, answer]) =>
              [id, chatPrivateFields.has(id) ? "" : answer.slice(0, 600)])),
          }),
        });
        if (!response.ok) throw new Error("assistant unavailable");
        const data = await response.json();
        additions = data.answers ?? {};
        reply = typeof data.reply === "string" ? data.reply : "";
      } catch {
        if (question && !isInquiry && validAnswer(question, text)) {
          additions = { [question.id]: text };
        } else {
          reply = "تعذّر الرد على رسالتك الآن. يمكنك متابعة الطلب وسيطّلع الفريق عليها.";
        }
      }
    }

    const updated = mergeServiceAnswers(service, answers, additions);
    const next = getQuestions(service, updated).find(item => !(item.id in updated));
    const assistantTurns: ChatTurn[] = [];
    if (reply) assistantTurns.push({ role: "assistant", text: reply });
    if (next && next.id !== question?.id) assistantTurns.push({ role: "assistant", text: next.label });
    if (!reply && next?.id === question?.id && !Object.keys(additions).length) setError("لم أجد إجابة واضحة للسؤال الحالي. أضف التفاصيل أو اختر أحد الخيارات المعروضة.");
    setAnswers(updated);
    setConversation([...turns, ...assistantTurns]);
    inFlight.current = false;
    setGenerating(false);
  }

  function edit(id: string) {
    if (inFlight.current) return;
    const item = questions.find(entry => entry.id === id);
    if (!item || conversation.length >= 46) return;
    const updated = { ...answers };
    delete updated[id];
    setAnswers(updated);
    setDraft(answers[id] ?? "");
    setError("");
    setConversation(turns => [...turns, { role: "assistant", text: item.label }]);
    moveFocus.current = true;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || question) return;
    if (draft.trim()) {
      setError("أرسل رسالتك المكتوبة أو امسحها قبل إرسال الطلب.");
      return;
    }
    inFlight.current = true;
    setBusy(true);
    setError("");
    requestId.current ||= crypto.randomUUID();
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/service-orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: slug, answers, conversation, id: requestId.current, website: form.get("website"), consent: form.get("consent") === "on" }),
      });
      const data = await response.json();
      if (!response.ok || typeof data.id !== "string") {
        setError(data.error ?? "تعذّر حفظ الطلب. جرّب مرة أخرى.");
        return;
      }
      moveFocus.current = true;
      setReceipt(data.id);
    } catch {
      setError("تعذّر الاتصال. إجاباتك ما زالت هنا، ويمكنك إعادة المحاولة.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  if (receipt) return <section className={s.chat} tabIndex={-1} ref={panel} aria-label="إيصال الطلب">
    <div className={s.receipt}>
      <span className={s.check} aria-hidden="true">✓</span>
      <h2>تم استلام طلبك</h2>
      <p>حُفظت المحادثة وملخص المتطلبات مع طلبك. سيُراجع الفريق التفاصيل ويتواصل معك على بريدك الإلكتروني.</p>
      <p><strong>رقم الطلب</strong> <bdi className={s.reference}>{receipt}</bdi></p>
      <Link className={studio.button} href={`/services/${slug}`}>العودة إلى تفاصيل الخدمة <span aria-hidden="true">←</span></Link>
    </div>
  </section>;


  return <section className={s.chat} tabIndex={-1} ref={panel} aria-label="محادثة طلب الخدمة">
    <header className={s.chatHeader}>
      <div className={s.identity}><span className={s.mark} aria-hidden="true">✳</span><div><h2>مساعد لوسيل</h2><p>محادثة طلب الخدمة</p></div></div>
      <span className={s.phase}>{question ? `${completed} من ${questions.length} إجابات` : "مراجعة وإرسال"}</span>
    </header>
    <progress className={s.progress} max={questions.length} value={completed} aria-label="تقدّم الطلب" />
    <div className={s.thread} role="log" aria-label="الرسائل" ref={thread} tabIndex={0}>
      {conversation.map((turn, index) => <Bubble key={index} role={turn.role}><p>{turn.text}</p></Bubble>)}
      {generating && <p className={s.wait} role="status">مساعد لوسيل يكتب…</p>}
    </div>
    <div className={s.composer}>
      <p className={s.settings} id="chat-privacy">أجب أو اسأل عن الخدمة في نفس الخانة. يمكنك ذكر أكثر من تفصيل في رسالة واحدة. يستخدم المساعد OpenRouter؛ تجنّب المعلومات السرية. <Link href="/privacy">سياسة الخصوصية</Link></p>
      {question && <div>
        <h3 id="active-question">{question.label}</h3>
        {question.hint && <p className={s.hint}>{question.hint}</p>}
        {question.options && <div className={s.choices} role="group" aria-labelledby="active-question">
          {question.options.map(option => <button key={option} type="button" disabled={generating || busy} onClick={() => void send(option)}>{option}</button>)}
        </div>}
      </div>}
      <form onSubmit={event => { event.preventDefault(); void send(draft); }}>
        <label className={s.srOnly} htmlFor="service-message">رسالتك للمساعد</label>
        <textarea id="service-message" ref={field} rows={2} maxLength={600} value={draft} disabled={generating || busy}
          aria-describedby="chat-privacy" placeholder="اكتب إجابتك أو استفسارك…" onChange={event => setDraft(event.target.value)} />
        <div className={s.actions}>
          <button className={studio.button} disabled={generating || busy || !draft.trim()}>إرسال الرسالة <span aria-hidden="true">←</span></button>
          {question?.optional && <button type="button" className={s.textButton} disabled={generating || busy} onClick={() => void send("", true)}>تخطّي</button>}
        </div>
      </form>
      {!question && <form className={s.review} onSubmit={submit}>
        <h3 ref={review} tabIndex={-1}>ملخص طلبك قبل الإرسال</h3>
        <p>راجع هذا الملخص. سيُحفظ مع المحادثة عند إرسال الطلب.</p>
        <p className={s.brief}>{brief}</p>
        <details>
          <summary>تعديل الإجابات وبيانات التواصل</summary>
          <dl className={s.review}>{questions.map(item => <div key={item.id}>
            <dt>{item.label}</dt><dd>{answers[item.id] || skip}</dd>
            <button type="button" className={s.textButton} disabled={generating || busy} onClick={() => edit(item.id)} aria-label={`تعديل إجابة: ${item.label}`}>تعديل</button>
          </div>)}</dl>
        </details>
        <label className={s.trap} aria-hidden="true">اترك الحقل فارغًا<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <label className={s.approval}><input type="checkbox" name="consent" required /> أوافق على استخدام بياناتي لمراجعة الطلب والتواصل معي وفق <Link href="/privacy">سياسة الخصوصية</Link>.</label>
        <button className={studio.button} disabled={busy || generating}>{busy ? "جارٍ إرسال الطلب…" : "إرسال الطلب"} <span aria-hidden="true">←</span></button>
      </form>}
      {error && <p className={s.error} role="alert">{error}</p>}
    </div>
  </section>;
}
