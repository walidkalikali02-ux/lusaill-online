import Link from "next/link";
import { geometryLessons, geometryLessonPath, geometryPath } from "@/lib/geometry-course";
export function GeometryOutline({slug}:{slug:string}) {
 return <nav className="geometry-outline" aria-label="دروس المجسّمات والحجوم"><strong>مسارك في الكورس</strong><ol>{geometryLessons.map(l=><li key={l.slug}><Link href={geometryLessonPath(l.slug)} aria-current={l.slug===slug?"page":undefined}><span>{String(l.order).padStart(2,"0")}</span>{l.shortTitle}</Link></li>)}</ol><Link className="geometry-outline-back" href={geometryPath}>صفحة الكورس ←</Link></nav>;
}
export function GeometryMobileOutline({slug}:{slug:string}) { return <details className="geometry-mobile-outline"><summary>عرض خطة الكورس والتنقّل بين الدروس</summary><GeometryOutline slug={slug}/></details>; }
