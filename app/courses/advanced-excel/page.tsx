import type { Metadata } from 'next';
import { advancedExcelCourse as course,academyPath } from '@/lib/academy-course';
import { pageAlternates } from '@/lib/page-alternates';
import { AcademyLanding } from '@/components/academy-course-pages';
export const metadata:Metadata={title:course.meta.title,description:course.meta.description,alternates:pageAlternates(academyPath(course)),openGraph:{title:course.meta.title,description:course.meta.description,url:academyPath(course),type:'website'}};
export default function Page(){return <AcademyLanding course={course}/>;}
