import Link from "next/link";
import { sixgLessons,sixgPath,sixgLessonPath } from "@/lib/sixg-course";
export function SixGOutline({slug}:{slug:string}){return <nav className="geometry-outline" aria-label="وحدات كورس 6G"><strong>مسارك في الكورس</strong><ol>{sixgLessons.map(l=><li key={l.slug}><Link href={sixgLessonPath(l.slug)} aria-current={l.slug===slug?'page':undefined}><span>{String(l.order).padStart(2,'0')}</span>{l.shortTitle}</Link></li>)}</ol><Link className="geometry-outline-back" href={sixgPath}>صفحة الكورس ←</Link></nav>}
