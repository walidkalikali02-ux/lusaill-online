import Link from "next/link";
import { fivegLessons,fivegPath,fivegLessonPath } from "@/lib/fiveg-course";
export function TelecomOutline({slug}:{slug:string}){return <nav className="geometry-outline" aria-label="وحدات كورس 5G"><strong>مسارك في الكورس</strong><ol>{fivegLessons.map(l=><li key={l.slug}><Link href={fivegLessonPath(l.slug)} aria-current={l.slug===slug?'page':undefined}><span>{String(l.order).padStart(2,'0')}</span>{l.shortTitle}</Link></li>)}</ol><Link className="geometry-outline-back" href={fivegPath}>صفحة الكورس ←</Link></nav>}
