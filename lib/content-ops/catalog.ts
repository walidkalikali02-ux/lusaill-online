import { articles } from "../content";
import { guidePaths } from "../guide-paths";
import { addedCourses,academyPath,academyLessonPath } from "../academy-course";
import { courseMeta,drivingLessons } from "../driving-course";
import { geometryMeta,geometryLessons,geometryPath,geometryLessonPath } from "../geometry-course";
import { fivegMeta,fivegLessons,fivegPath,fivegLessonPath } from "../fiveg-course";
import { sixgMeta,sixgLessons,sixgPath,sixgLessonPath } from "../sixg-course";
export const contentCatalog = [
 ...articles.map(a=>({title:a.title,href:`/articles/${a.slug}`,kind:"article",status:a.status})),
 ...guidePaths.map(p=>({title:p.title,href:`/guides/${p.slug}`,kind:"guide",status:"published"})),
 ...addedCourses.flatMap(c=>[{title:c.meta.title,href:academyPath(c),kind:"course",status:"published"},...c.lessons.map(l=>({title:l.title,href:academyLessonPath(c,l.slug),kind:"lesson",status:"published"}))]),
 {title:courseMeta.title,href:"/courses/learn-driving",kind:"course",status:"published"},
 ...drivingLessons.map(l=>({title:l.title,href:`/courses/learn-driving/${l.slug}`,kind:"lesson",status:"published"})),
 ...[{meta:geometryMeta,lessons:geometryLessons,path:geometryPath,lessonPath:geometryLessonPath},{meta:fivegMeta,lessons:fivegLessons,path:fivegPath,lessonPath:fivegLessonPath},{meta:sixgMeta,lessons:sixgLessons,path:sixgPath,lessonPath:sixgLessonPath}].flatMap(c=>[{title:c.meta.title,href:c.path,kind:"course",status:"published"},...c.lessons.map(l=>({title:l.title,href:c.lessonPath(l.slug),kind:"lesson",status:"published"}))]),
];
