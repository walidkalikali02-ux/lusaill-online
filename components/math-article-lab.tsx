"use client";

import { useEffect, useRef, useState } from "react";
import type { MathLab } from "@/lib/math-article-labs";
import styles from "./math-article-lab.module.css";

export default function MathArticleLab({ lab }: { lab: MathLab }) {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [changed, setChanged] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const action = useRef<HTMLButtonElement>(null);
  const firstChoice = useRef<HTMLButtonElement>(null);
  const restart = useRef(false);
  const marks = changed ? lab.after : lab.before;
  const bars = changed ? lab.bars?.after : lab.bars?.before;

  useEffect(() => {
    if (prediction !== null) action.current?.focus();
    else if (restart.current) firstChoice.current?.focus();
  }, [prediction]);

  return (
    <section id="math-experiment" className={styles.lab} aria-labelledby="math-experiment-title">
      <header>
        <p className={styles.phase}>توقّع ← جرّب ← افهم</p>
        <h2 id="math-experiment-title">{lab.title}</h2>
        <p>{lab.goal}</p>
      </header>
      <div className={styles.layout}>
        <figure className={styles.figure}>
          <figcaption>{changed ? "بعد التجربة" : "قبل التجربة"}</figcaption>
          {lab.visual === "pie" && (
            <div className={styles.pie} data-quarter={changed} role="img" aria-label={changed ? "ربع دائرة مظلل" : "دائرة مقسمة إلى أربعة أرباع"} />
          )}
          {lab.visual === "part-whole" && (
            <div className={styles.blocks} aria-hidden="true" dir="ltr">
              {Array.from({length:12},(_,i)=><span key={i} data-part={changed && i >= 7} />)}
            </div>
          )}
          {lab.visual === "number-line" && (
            <div className={styles.numberLine} aria-hidden="true" dir="ltr">
              {Array.from({length:9},(_,i)=><span key={i} data-point={(changed ? [0,4,8] : [3,4,5]).includes(i)} />)}
            </div>
          )}
          <ul className={bars ? styles.bars : styles.marks} dir={marks.every(mark => /^[IV]+$/.test(mark)) ? "ltr" : undefined} aria-live="polite">
            {marks.map((mark, index) => (
              <li key={index}>
                {bars ? <span className={styles.bar} style={{height: bars[index] + "%"}} aria-hidden="true" /> : null}
                <bdi>{mark}</bdi>
              </li>
            ))}
          </ul>
        </figure>
        <div className={styles.controls}>
          <h3>{lab.question}</h3>
          <div className={styles.choices} role="group" aria-label="اختيارات التوقّع">
            {lab.options.map((choice, index) => (
              <button key={choice} ref={index === 0 ? firstChoice : undefined} type="button"
                aria-pressed={prediction === index} disabled={prediction !== null}
                onClick={() => setPrediction(index)}>{choice}</button>
            ))}
          </div>
          <div className={styles.actions}>
            {prediction !== null && (
              <button ref={action} className={styles.primary} type="button" onClick={() => {
                if (reviewed) setChanged(!changed);
                else if (!changed) setChanged(true);
                else setReviewed(true);
              }}>
                {reviewed ? changed ? "اعرض الرسم الأول" : lab.action : changed ? "شوف تفسير إجابتك" : lab.action}
              </button>
            )}
            {prediction !== null && (
              <button type="button" onClick={() => {
                restart.current = true;
                setPrediction(null);
                setChanged(false);
                setReviewed(false);
              }}>أعد المحاولة</button>
            )}
          </div>
          {!reviewed && <details><summary>تلميح</summary><p>{lab.hint}</p></details>}
          <div aria-live="polite">
            {reviewed && prediction !== null && (
              <div className={styles.feedback}>
                <strong>{prediction === lab.answer ? "توقّع صحيح" : "لنراجع التوقّع"}</strong>
                <p>{lab.feedback[prediction]}</p>
                <p>{lab.rule}</p>
                <details><summary>مثال آخر</summary><p>{lab.example}</p></details>
              </div>
            )}
          </div>
        </div>
      </div>
      <noscript><p>{lab.rule} {lab.example}</p></noscript>
    </section>
  );
}
