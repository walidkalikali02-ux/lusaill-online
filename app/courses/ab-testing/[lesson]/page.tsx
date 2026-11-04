import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { abCourse as course,academyLessonPath } from '@/lib/academy-course';
import { pageAlternates } from '@/lib/page-alternates';
import { AcademyReader } from '@/components/academy-course-pages';
type Props={params:Promise<{lesson:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return course.lessons.map(l=>({lesson:l.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {lesson}=await params;const l=course.lessons.find(l=>l.slug===lesson);if(!l)return {robots:{index:false,follow:false}};return {title:l.title,description:l.description,alternates:pageAlternates(academyLessonPath(course,l.slug)),openGraph:{title:l.title,description:l.description,url:academyLessonPath(course,l.slug),type:'article',publishedTime:course.meta.publishedAt,modifiedTime:course.meta.updatedAt}};}
export default async function Page({params}:Props){const {lesson}=await params;const l=course.lessons.find(l=>l.slug===lesson);if(!l)notFound();return <AcademyReader course={course} lesson={l}/>;}
