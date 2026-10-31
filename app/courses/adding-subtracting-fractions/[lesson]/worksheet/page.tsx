import type {Metadata} from 'next';
import{notFound}from'next/navigation';
import{fractionCourse as course,academyWorksheetPath}from'@/lib/academy-course';
import{pageAlternates}from'@/lib/page-alternates';
import{AcademyWorksheet}from'@/components/academy-course-pages';
type Props={params:Promise<{lesson:string}>};export const dynamicParams=false;
export function generateStaticParams(){return course.lessons.filter(l=>l.worksheet).map(l=>({lesson:l.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {lesson}=await params;const l=course.lessons.find(l=>l.slug===lesson&&l.worksheet);if(!l)return {robots:{index:false,follow:false}};const title=`ورقة عمل: ${l.shortTitle}`,description = `ستة تمارين أصلية في ${l.shortTitle} مع حلول مشروحة وأسئلة قابلة للطباعة، للمراجعة بعد الدرس.`;return {title,description,alternates:pageAlternates(academyWorksheetPath(course,l.slug)),openGraph:{title,description,url:academyWorksheetPath(course,l.slug),type:'article'}};}
export default async function Page({params}:Props){const {lesson}=await params;const l=course.lessons.find(l=>l.slug===lesson&&l.worksheet);if(!l)notFound();return <AcademyWorksheet course={course} lesson={l}/>;}
