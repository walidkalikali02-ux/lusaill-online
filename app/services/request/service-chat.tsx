"use client";

import { Fragment, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { getQuestions, getService, validAnswer, type AnswerMap, type ChatTurn, chatPrivateFields } from "@/lib/service-orders";
import studio from "../studio.module.css";
import s from "./request.module.css";

type VisibleTurn = ChatTurn & { id?: string };
type Exchange = ChatTurn & { anchor: string; timing: "before" | "after" };
const followupFields: Readonly<Record<string, readonly string[]>> = {
  "website-design": ["business", "goal"],
  "video-editing": ["purpose", "style"],
  excel: ["goal", "output"],
  "social-design": ["platforms", "campaign"],
};
const reviewAnchor = "review";
const extraTurnLimit = 12;

function Bubble({ role, children }: { role: ChatTurn["role"]; children: ReactNode }) {
  return <div className={s.bubble} data-role={role}>
    <span>{role === "customer" ? "أنت" : "مساعد لوسيل"}</span>
    {children}
  </div>;
}

export function ServiceChat({ slug }: { slug: string }) {
  const service = getService(slug)!;
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [draft, setDraft] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [mode, setMode] = useState<"answer" | "inquiry">("answer");
  const [followup, setFollowup] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [receipt, setReceipt] = useState("");
  const inFlight = useRef(false);
  const requestId = useRef("");
  const thread = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLElement>(null);
  const moveFocus = useRef(false);

  const questions = getQuestions(service, answers);
  const question = questions.find(item => !(item.id in answers));
  const completed = questions.filter(item => item.id in answers).length;
  const activeAnchor = followup ?? question?.id ?? reviewAnchor;
  const canAsk = exchanges.length <= extraTurnLimit - 2;

  const visibleTurns = questions.flatMap<VisibleTurn>(item => {
    const answered = item.id in answers;
    if (question && questions.indexOf(item) > questions.indexOf(question)) return [];
    if (!answered && item.id !== question?.id) return [];
    if (followup && questions.indexOf(item) > questions.findIndex(entry => entry.id === followup)) return [];
    return [
      { role: "assistant" as const, text: item.label, id: item.id },
      ...exchanges.filter(turn => turn.anchor === item.id && turn.timing === "before"),
      ...(answered ? [{ role: "customer" as const, text: answers[item.id] || "تم التخطي", id: item.id }] : []),
      ...exchanges.filter(turn => turn.anchor === item.id && turn.timing === "after"),
    ];
  }).concat(exchanges.filter(turn => turn.anchor === reviewAnchor));

  useEffect(() => {
    if (!moveFocus.current) return;
    if (thread.current) thread.current.scrollTop = thread.current.scrollHeight;
    if (generating || busy) return;
    moveFocus.current = false;
    (field.current ?? panel.current)?.focus({ preventScroll: true });
  }, [answers, exchanges, followup, mode, generating, busy, receipt]);

  async function talk(value: string, kind: "inquiry" | "followup", anchor: string, updated: AnswerMap, timing: Exchange["timing"], showCustomer: boolean) {
    if (inFlight.current || !canAsk) return;
    inFlight.current = true;
    setGenerating(true);
    setError("");
    moveFocus.current = true;
    if (showCustomer) setExchanges(old => [...old, { role: "customer", text: value, anchor, timing }]);
    let reply = "لم أتمكن من الرد الآن. يمكنك متابعة الطلب وسيطّلع الفريق على التفاصيل التي أرسلتها.";
    let answered = false;
    try {
      const response = await fetch("/api/service-chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(9500),
        body: JSON.stringify({
          service: slug, consent: true, mode: kind, message: value,
          history: exchanges.slice(-6).map(({ role, text }) => ({ role, text })),
          answers: Object.fromEntries(Object.entries(updated).map(([id, answer]) =>
            [id, chatPrivateFields.has(id) ? "" : answer.slice(0, 300)])),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (typeof data.reply === "string") {
          reply = data.reply;
          answered = true;
        }
      }
    } catch {
      // The guided questions remain available.
    } finally {
      setExchanges(old => [...old, { role: "assistant", text: reply, anchor, timing }]);
      if (answered && /[؟?]/.test(reply) && kind === "followup" && !showCustomer && exchanges.length <= extraTurnLimit - 2) {
        setFollowup(anchor);
      }
      inFlight.current = false;
      setGenerating(false);
    }
  }

  function accept(value: string) {
    if (inFlight.current || !question) return;
    if (!validAnswer(question, value.trim())) {
      setError("أكمل الإجابة قبل المتابعة.");
      return;
    }
    const answer = value.trim();
    const updated = { ...answers, [question.id]: answer };
    const activeIds = new Set(getQuestions(service, updated).map(item => item.id));
    const activeAnswers = Object.fromEntries(Object.entries(updated).filter(([id]) => activeIds.has(id)));
    setAnswers(activeAnswers);
    setExchanges(old => old.filter(turn => turn.anchor === reviewAnchor || activeIds.has(turn.anchor)));
    setDraft("");
    setError("");
    moveFocus.current = true;
    if (answer && followupFields[slug]?.includes(question.id)) {
      void talk(answer.slice(0, 600), "followup", question.id, activeAnswers, "after", false);
    }
  }

  function edit(id: string) {
    if (inFlight.current) return;
    const updated = { ...answers };
    delete updated[id];
    setExchanges(old => old.filter(turn => turn.anchor !== id || turn.timing === "before"));
    setAnswers(updated);
    setDraft(answers[id] ?? "");
    setError("");
    setMode("answer");
    setFollowup(null);
    moveFocus.current = true;
  }

  function sendInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = inquiry.trim();
    if (!value || inFlight.current || !canAsk) return;
    setInquiry("");
    void talk(value, "inquiry", activeAnchor, answers, followup ? "after" : "before", true);
  }

  function answerFollowup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!followup || !draft.trim() || inFlight.current) return;
    const text = draft.trim();
    setDraft("");
    setFollowup(null);
    moveFocus.current = true;
    setExchanges(old => [...old, { role: "customer", text, anchor: followup, timing: "after" }]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || question || followup) return;
    if (inquiry.trim() && canAsk) {
      setError("أرسل استفسارك المكتوب أو امسحه قبل إرسال الطلب.");
      return;
    }
    inFlight.current = true;
    setBusy(true);
    setError("");
    requestId.current ||= crypto.randomUUID();
    const form = new FormData(event.currentTarget);
    try {
      const conversation = visibleTurns.map(({ role, text }) => ({ role, text }));
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
      <span className={s.phase}>{question || followup ? `${completed} من ${questions.length} إجابات` : "مراجعة وإرسال"}</span>
    </header>
    <progress className={s.progress} max={questions.length} value={completed} aria-label="تقدّم الطلب" />
    <div className={s.thread} role="log" aria-label="الرسائل" ref={thread} tabIndex={0}>
      {visibleTurns.map((turn, index) => <Bubble key={index} role={turn.role}>
        {question && turn.role === "assistant" && turn.id === question.id
          ? <><h3 id="active-question">{turn.text}</h3>{question.hint && <p className={s.hint}>{question.hint}</p>}</>
          : <p>{turn.text}</p>}
      </Bubble>)}
      {generating && <p className={s.wait} role="status">مساعد لوسيل يكتب…</p>}
    </div>
    <div className={s.composer}>
      <p className={s.settings}>يمكنك الإجابة أو سؤال المساعد عن الخدمة. يستخدم المساعد OpenRouter للرد على الاستفسارات وطرح أسئلة متابعة بناءً على وصفك. تجنّب إرسال معلومات سرية. <Link href="/privacy">سياسة الخصوصية</Link></p>
      {(canAsk || mode === "inquiry") && !followup && <div className={s.modes} aria-label="نوع الرسالة">
        <button type="button" aria-pressed={mode === "answer"} disabled={generating || busy} onClick={() => { setMode("answer"); moveFocus.current = true; }}>{question ? "إجابة السؤال" : "مراجعة الطلب"}</button>
        <button type="button" aria-pressed={mode === "inquiry"} disabled={generating || busy} onClick={() => { setMode("inquiry"); moveFocus.current = true; }}>اسأل عن الخدمة</button>
      </div>}
      {mode === "inquiry" ? <form onSubmit={sendInquiry}>
        <label htmlFor="service-inquiry">ما الذي تود أن تعرفه؟</label>
        <textarea id="service-inquiry" ref={node => { field.current = node; }} rows={2} maxLength={600} value={inquiry} disabled={generating || busy || !canAsk} onChange={event => setInquiry(event.target.value)} placeholder="مثلاً: هل يمكن طلب أكثر من مقاس؟" />
        <button className={studio.button} disabled={generating || busy || !canAsk || !inquiry.trim()}>إرسال الاستفسار <span aria-hidden="true">←</span></button>
        {!canAsk && <p>يمكنك إضافة بقية التفاصيل في ملاحظات الطلب.</p>}
      </form> : followup ? <form onSubmit={answerFollowup}>
        <label htmlFor="followup-answer">أجب عن سؤال المتابعة أو تابع الطلب</label>
        <textarea id="followup-answer" ref={node => { field.current = node; }} rows={2} maxLength={600} value={draft} onChange={event => setDraft(event.target.value)} />
        <div className={s.actions}>
          <button className={studio.button} disabled={!draft.trim()}>إرسال الإجابة <span aria-hidden="true">←</span></button>
          <button type="button" className={s.textButton} onClick={() => { setFollowup(null); setDraft(""); moveFocus.current = true; }}>تخطّي سؤال المتابعة</button>
        </div>
      </form> : question ? <Fragment key={question.id}>
        {question.options ? <div className={s.choices} role="group" aria-labelledby="active-question">
          {question.options.map((option, index) => <button key={option} type="button" disabled={generating || busy} ref={index === 0 ? node => { field.current = node; } : undefined} onClick={() => accept(option)}>{option}</button>)}
        </div> : <form onSubmit={event => { event.preventDefault(); accept(draft); }}>
          <label className={s.srOnly} htmlFor="guided-answer">{question.label}</label>
          {question.email || question.id === "name"
            ? <input id="guided-answer" ref={node => { field.current = node; }} type={question.email ? "email" : "text"} autoComplete={question.email ? "email" : "name"} dir={question.email ? "ltr" : "auto"} maxLength={question.email ? 254 : 120} required value={draft} disabled={generating || busy} onChange={event => setDraft(event.target.value)} />
            : <textarea id="guided-answer" ref={node => { field.current = node; }} rows={2} maxLength={800} required={!question.optional} value={draft} disabled={generating || busy} onChange={event => setDraft(event.target.value)} placeholder="اكتب إجابتك هنا" />}
          <button className={studio.button} disabled={generating || busy}>{question.optional && !draft.trim() ? "تخطّي" : "إرسال الإجابة"} <span aria-hidden="true">←</span></button>
        </form>}
        {completed > 0 && <button className={s.textButton} type="button" disabled={generating || busy} onClick={() => {
          const previous = questions.slice(0, questions.indexOf(question)).reverse().find(item => item.id in answers);
          if (previous) edit(previous.id);
        }}>تعديل الإجابة السابقة</button>}
      </Fragment> : <form onSubmit={submit}>
        <h3>راجع تفاصيل طلبك</h3>
        <p>ستُحفظ الإجابات والمحادثة مع ملخص المتطلبات عند إرسال الطلب.</p>
        <dl className={s.review}>{questions.map(item => <div key={item.id}>
          <dt>{item.label}</dt><dd>{answers[item.id] || "تم التخطي"}</dd>
          <button type="button" className={s.textButton} disabled={busy} onClick={() => edit(item.id)} aria-label={`تعديل إجابة: ${item.label}`}>تعديل من هنا</button>
        </div>)}</dl>
        <label className={s.trap} aria-hidden="true">اترك الحقل فارغًا<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <label className={s.approval}><input type="checkbox" name="consent" required /> أوافق على استخدام بياناتي لمراجعة الطلب والتواصل معي وفق <Link href="/privacy">سياسة الخصوصية</Link>.</label>
        <button className={studio.button} disabled={busy || generating}>{busy ? "جارٍ إرسال الطلب…" : "إرسال الطلب"} <span aria-hidden="true">←</span></button>
      </form>}
      {error && <p className={s.error} role="alert">{error}</p>}
    </div>
  </section>;
}
