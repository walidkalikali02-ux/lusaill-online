"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SiteIcon, type IconName } from "./site-icon";
const navigation: {href:string;label:string;icon:IconName}[] = [
  {href:"/",label:"الرئيسية",icon:"grid"},
  {href:"/categories/fawatir-alkahraba",label:"فواتير الكهرباء",icon:"bolt"},
  {href:"/categories/bawabat-misr-alraqmeya",label:"الخدمات الحكومية",icon:"document"},
  {href:"/categories/rokhas-alqiyada-walmoror",label:"القيادة والمرور",icon:"car"},
  {href:"/categories/shehadat-almilad-walsijil-almadani",label:"السجل المدني",icon:"book"},
  {href:"/categories/digital-life",label:"الحياة الرقمية",icon:"screen"},
];
export function SiteHeader() {
  const [menuOpen,setMenuOpen]=useState(false);
  const pathname=usePathname();
  useEffect(()=>{if(!menuOpen)return;const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setMenuOpen(false);};window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close);},[menuOpen]);
  return <header className="site-header">
    <div className="utility-bar"><div className="shell utility-inner"><span>معلومة واضحة، وخطوة تعرف كيف تبدأها</span><div><Link href="/editorial-policy">منهج التحرير والمصادر</Link><Link href="/contact">اقترح موضوعًا أو تصحيحًا</Link><Link href="/about">عن لوسيل</Link></div></div></div>
    <div className="shell header-inner">
      <Link className="brand" href="/" aria-label="لوسيل - الرئيسية"><span className="brand-mark" aria-hidden="true"><SiteIcon name="book" width="25" height="25" /></span><span><strong>لوسيل</strong><small>LUSAILL</small></span></Link>
      <form className="masthead-search" role="search" action="/search" method="get"><SiteIcon name="search" /><input type="search" name="q" maxLength={200} aria-label="بحث الموقع" placeholder="ابحث عن خدمة، إجراء، أو حل لمشكلتك…" /><button type="submit">ابحث</button></form>
      <div className="header-actions"><Link href="/guides" className="header-guide-link"><SiteIcon name="book" />اختر مهمتك</Link><Link href="/search" className="header-search-btn" aria-label="بحث"><SiteIcon name="search" /></Link><button className="mobile-menu-btn" aria-label={menuOpen?"إغلاق القائمة":"القائمة"} aria-expanded={menuOpen} aria-controls="site-menu" onClick={()=>setMenuOpen(!menuOpen)}><SiteIcon name={menuOpen?"close":"menu"} /></button></div>
    </div>
    <div className="category-nav-wrap"><nav className="shell category-nav" aria-label="التنقل الرئيسي">{navigation.map(item=><Link key={item.href} href={item.href} aria-current={pathname===item.href?"page":undefined}><SiteIcon name={item.icon} width="17" height="17" />{item.label}</Link>)}<Link href="/articles" aria-current={pathname==="/articles"?"page":undefined}>كل الأدلة <span aria-hidden="true">↙</span></Link></nav></div>
    {menuOpen&&<nav id="site-menu" className="mobile-nav" aria-label="روابط إضافية"><div className="shell">{[{href:"/guides",label:"مسارات المهام"},{href:"/courses/learn-driving",label:"كورس تعلم القيادة"},{href:"/categories",label:"كل التصنيفات"},{href:"/entities",label:"الجهات والخدمات"},{href:"/editorial-policy",label:"منهج التحرير"},{href:"/about",label:"عن لوسيل"},{href:"/contact",label:"تواصل معنا"}].map(item=><Link key={item.href} href={item.href} onClick={()=>setMenuOpen(false)}>{item.label}<SiteIcon name="arrow" width="16" height="16" /></Link>)}</div></nav>}
  </header>;
}
