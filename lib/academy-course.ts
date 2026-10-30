import whole from './whole-numbers-course.json';
import marketing from './marketing-communications-course.json';
import adaptive from './adaptive-software-course.json';
import decimals from './decimal-operations-course.json';
import fractions from './fraction-operations-course.json';
import ab from './ab-course.json';
import accounting from './accounting-course.json';
import abbreviations from './abbreviations-course.json';
import type { FiveGLesson,FiveGSource } from './fiveg-course';
export type AcademyDataTable={headers:string[];rows:string[][]};
export type WorksheetItem={dataTable?:AcademyDataTable;prompt:string;expression:string;answer:string;explanation:string;task:string};
export type AcademyLesson=Omit<FiveGLesson,'reference'|'cases'>&{cases:(FiveGLesson['cases'][number]&{dataTable?:AcademyDataTable})[];dataTable?:AcademyDataTable;glossaryCategory?:string;worksheet?:WorksheetItem[]};
export type GlossaryEntry={term:string;expanded:string;meaning:string;category:string;context:string};
export type AcademyCourse={meta:{slug:string;title:string;description:string;publishedAt:string;updatedAt:string;level:string;subject:string;headline:string;audience:string;promise:string;displayTitle?:string;art?:string;planDescription?:string};lessons:AcademyLesson[];sources:Record<string,FiveGSource>;interviews?:{question:string;answer:string}[];glossary?:GlossaryEntry[];discussions?:{title:string;prompt:string;points:string[]}[]};
export const abCourse:AcademyCourse=ab;
export const abbreviationsCourse:AcademyCourse=abbreviations;
export const accountingCourse:AcademyCourse=accounting;
export const marketingCourse:AcademyCourse=marketing;
export const adaptiveCourse:AcademyCourse=adaptive;
export const decimalCourse:AcademyCourse=decimals;
export const fractionCourse:AcademyCourse=fractions;
export const wholeNumberCourse:AcademyCourse=whole;
export const addedCourses=[abCourse,abbreviationsCourse,accountingCourse,marketingCourse,adaptiveCourse,decimalCourse,fractionCourse,wholeNumberCourse];
export const academyPath=(course:AcademyCourse)=>`/courses/${course.meta.slug}`;
export const academyLessonPath=(course:AcademyCourse,slug:string)=>`${academyPath(course)}/${slug}`;

export function courseIdentity(c:AcademyCourse){const old:Record<string,{label:string;display:string;art:string;plan:string}>={
 'ab-testing':{label:'اختبارات A/B',display:'A/B Testing',art:'ab',plan:'من الفرضية والقياس إلى النتائج والأدوات والسيو، ثم المقابلات والدليل السريع والمراجع.'},
 'abbreviations':{label:'فهم الاختصارات',display:'فهم الاختصارات.',art:'letters',plan:'ست وحدات تأسيسية، ثم البحث بالاسم والحرف والمجال وقوائم المصطلحات.'},
 'accounting-basics':{label:'أساسيات المحاسبة',display:'أساسيات المحاسبة.',art:'accounting',plan:'المالية والتكاليف والإدارة، ثم الدليل والمراجع.'}};
 const fallback=old[c.meta.slug];return {label:fallback?.label??c.meta.displayTitle?.replace(/\.$/,'')??c.meta.title,display:c.meta.displayTitle??fallback?.display??c.meta.title,art:c.meta.art??fallback?.art??'ab',plan:c.meta.planDescription??fallback?.plan??'دروس مرتبة مع حالات واختبارات.'};}
export const academyWorksheetPath=(c:AcademyCourse,slug:string)=>`${academyLessonPath(c,slug)}/worksheet`;
