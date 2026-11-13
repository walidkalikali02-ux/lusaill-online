"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./curriculum.module.css";

export default function TryMath({ lessonUrl }: { lessonUrl: string }) {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [reviewed, setReviewed] = useState(false);
  const nextAction = useRef<HTMLButtonElement>(null);
  const lessonLink = useRef<HTMLAnchorElement>(null);
  const total = 3;

  useEffect(() => {
    if (reviewed) lessonLink.current?.focus();
    else if (prediction !== null) nextAction.current?.focus();
  }, [prediction, reviewed]);

  return (
    <section className={styles.sample} aria-labelledby="sample-title">
      <div className={styles.sampleHeader}>
        <span>جرّب قبل ما تبدأ</span>
        <span>{reviewed ? "٣ · افهم" : prediction === null ? "١ · توقّع" : "٢ · جرّب"}</span>
      </div>
      <h2 id="sample-title">كم نجمة ترى؟</h2>
      <div className={styles.stars} role="img" aria-label="ثلاث نجوم">
        {Array.from({ length: total }, (_, index) => (
          <span key={index} data-counted={index < count} aria-hidden="true">
            {index < count ? ["١", "٢", "٣"][index] : "★"}
          </span>
        ))}
      </div>
      {prediction === null ? (
        <div className={styles.answers} role="group" aria-label="اختر عدد النجوم">
          {[2, 3, 4].map((number, index) => (
            <button key={number} type="button" onClick={() => setPrediction(number)}>{["٢", "٣", "٤"][index]}</button>
          ))}
        </div>
      ) : (
        <>
          <p aria-live="polite" className={styles.feedback}>
            {reviewed
              ? (prediction === total ? "توقّعك صح! " : prediction < total ? "بعد عدّ نجمتين بقيت نجمة واحدة. " : "بعد النجمة الثالثة لم تبقَ نجوم. ") +
                "عدَدْنا كل نجمة مرة واحدة. آخر عدد وصلنا إليه هو ٣."
              : count === 0 ? "عُدّ النجوم واحدة واحدة." : `عدَدْتَ ${["٠", "١", "٢", "٣"][count]} من ٣.`}
          </p>
          {reviewed ? (
            <Link ref={lessonLink} className={styles.sampleAction} href={lessonUrl}>ابدأ درس الأعداد ←</Link>
          ) : (
            <button ref={nextAction} className={styles.sampleAction} type="button" onClick={() => count < total ? setCount(count + 1) : setReviewed(true)}>
              {count < total ? "عُدّ نجمة" : "شوف تفسير إجابتك"}
            </button>
          )}
        </>
      )}
    </section>
  );
}
