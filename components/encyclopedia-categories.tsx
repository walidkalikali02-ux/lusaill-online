import Link from "next/link";
import { encyclopediaCategories } from "@/lib/encyclopedia-taxonomy";
import { getCategoryUrl, getEncyclopediaCategoryCounts, getEncyclopediaSubtopicItems } from "@/lib/encyclopedia-catalog";
import styles from "./encyclopedia-categories.module.css";

type Props = { expanded?: boolean };

export function EncyclopediaCategories({ expanded = false }: Props) {
  const counts = getEncyclopediaCategoryCounts();
  const subtopicCount = encyclopediaCategories.reduce((total, category) => total + category.subtopics.length, 0);

  return <section className={styles.section} id="encyclopedia-categories" aria-labelledby="encyclopedia-categories-title">
    <div className={styles.heading}>
      <div>
        <span className={styles.overline}>دليل موضوعي للمعرفة</span>
        <h2 id="encyclopedia-categories-title">تصفّح جميع فئات موسوعة لوسيل</h2>
        <p>اختر مجالًا رئيسيًا أو موضوعًا فرعيًا. تظهر المقالات المنشورة داخل كل قسم، أما التخصصات الجديدة فنضيف إليها المحتوى تدريجيًا.</p>
      </div>
      {!expanded && <Link className={styles.allLink} href="/topics">الفهرس الكامل للفئات <span aria-hidden="true">←</span></Link>}
    </div>
    <div className={styles.stats} aria-label="إحصاءات فهرس التخصصات"><span>{encyclopediaCategories.length} مجالًا رئيسيًا</span><span>{subtopicCount} موضوعًا فرعيًا</span><span>مقالات مرتبطة بالمجال عند توفرها</span></div>
    <div className={styles.grid}>
      {encyclopediaCategories.map(category => {
        const count = counts[category.slug] ?? 0;
        const always = category.subtopics;
        return <article key={category.slug} className={styles.card}>
          <div className={styles.cardHeading}>
            <span className={styles.symbol} aria-hidden="true">{category.symbol}</span>
            <div>
              <h3><Link href={getCategoryUrl(category)}>{category.title}</Link></h3>
              <p className={styles.coverage}>{count ? `${count} مادة منشورة` : "المحتوى قيد الإعداد"}</p>
            </div>
          </div>
          <p className={styles.summary}>{category.summary}</p>
          <ul className={styles.subtopics}>{always.map(subtopic =>
            <li key={subtopic}>{getEncyclopediaSubtopicItems(category, subtopic).length > 0
              ? <Link href={getCategoryUrl(category, subtopic)}>{subtopic}</Link>
              : <span className={styles.planned}>{subtopic}</span>}</li>
          )}</ul>
          <Link className={styles.categoryLink} href={getCategoryUrl(category)}>استكشف {category.title} <span aria-hidden="true">←</span></Link>
        </article>;
      })}
    </div>
  </section>;
}
