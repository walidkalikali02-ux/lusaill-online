"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteIcon } from "./site-icon";
export function SiteFrame({ children, footer }: { children: ReactNode; footer: ReactNode }) {
 const pathname = usePathname();
 const coursePlan = pathname.startsWith("/courses/accounting-basics") ? "/courses/accounting-basics#course-plan" : pathname.startsWith("/courses/ab-testing") ? "/courses/ab-testing#course-plan" : pathname.startsWith("/courses/abbreviations") ? "/courses/abbreviations#course-plan" : pathname.startsWith("/courses/6g-networks") ? "/courses/6g-networks#course-plan" : pathname.startsWith("/courses/3d-figures-volumes") ? "/courses/3d-figures-volumes#course-plan" : pathname.startsWith("/courses/5g") ? "/courses/5g#course-plan" : pathname.startsWith("/courses/learn-driving") ? "/courses/learn-driving#course-plan" : "/courses#available-courses";
 const isAcademy = pathname === "/courses" || pathname.startsWith("/courses/");
 if (!isAcademy) return <><SiteHeader />{children}{footer}</>;
 return <><header className="academy-header"><div className="academy-width academy-header-inner">
 <Link href="/courses" className="academy-brand" aria-label="كورسات لوسيل - الرئيسية"><span className="academy-brand-icon"><SiteIcon name="book" width="23" height="23" /></span><span><strong>لوسيل <em>تعلّم</em></strong><small>مساحتك لخطوة جديدة</small></span></Link>
 <nav aria-label="تنقل الكورسات" className="academy-nav"><Link href="/courses" aria-current={pathname === "/courses" ? "page" : undefined}>الكورسات</Link><Link href={coursePlan}>{pathname === "/courses" ? "اختر كورسك" : "خطة التعلّم"}</Link></nav>
 <Link href="/" className="academy-back">موقع لوسيل <SiteIcon name="arrow" width="16" /></Link></div></header>
 {children}<footer className="academy-footer"><div className="academy-width academy-footer-inner"><div><strong>لوسيل تعلّم</strong><p>تعلّم بفهم، وراجع على مهل، وطبّق بخطوات واضحة.</p></div><nav aria-label="روابط قسم الكورسات"><Link href="/courses">الكورسات</Link><Link href="/contact">تواصل معنا</Link><Link href="/editorial-policy">منهج التحرير</Link><Link href="/privacy">الخصوصية</Link><Link href="/">العودة إلى لوسيل</Link></nav></div></footer></>;
}
