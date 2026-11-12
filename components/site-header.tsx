"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SiteIcon } from "./site-icon";
const primary=[{href:"/#company",label:"عن الشركة"},{href:"/#projects",label:"مشاريعنا"},{href:"/knowledge",label:"الموسوعة"},{href:"/services",label:"الخدمات"},{href:"/contact",label:"تواصل معنا"}];
const additional=[{href:"/guides",label:"مسارات المهام"},{href:"/food-safety",label:"الصحة وسلامة الغذاء"},{href:"/team#team-directory",label:"التخصصات"},{href:"/categories/fawatir-alkahraba",label:"فواتير الكهرباء"},{href:"/categories/rokhas-alqiyada-walmoror",label:"القيادة والمرور"},{href:"/categories/shehadat-almilad-walsijil-almadani",label:"السجل المدني"},{href:"/categories/bawabat-misr-alraqmeya",label:"الخدمات الحكومية"},{href:"/categories/digital-life",label:"الحياة الرقمية"},{href:"/entities",label:"الجهات والخدمات"},{href:"/editorial-policy",label:"منهج التحرير"}];
export function SiteHeader(){
 const [menuOpen,setMenuOpen]=useState(false);const pathname=usePathname();
 useEffect(()=>{if(!menuOpen)return;const close=(e:KeyboardEvent)=>{if(e.key==="Escape")setMenuOpen(false);};window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close);},[menuOpen]);
 return <header className="site-header identity-header company-header"><div className="shell header-inner">
 <Link href="/" className="brand" aria-label="شركة لوسيل - الرئيسية"><span className="brand-mark" aria-hidden="true">ل</span><span><strong>شركة لوسيل</strong><small>LUSAILL</small></span></Link>
 <nav className="identity-nav" aria-label="التنقل الرئيسي">{primary.map(item=><Link key={item.href} href={item.href} aria-current={pathname===item.href?"page":undefined}>{item.label}</Link>)}</nav>
 <form className="masthead-search" role="search" action="/search" method="get"><SiteIcon name="search" width="17"/><input name="q" type="search" maxLength={200} aria-label="بحث الموقع" placeholder="ما الموضوع الذي تريد معرفته؟"/><button type="submit">بحث</button></form>
 <div className="header-actions"><Link className="header-search-btn" href="/search" aria-label="بحث"><SiteIcon name="search"/></Link><button className="mobile-menu-btn" aria-label={menuOpen?"إغلاق القائمة":"القائمة"} aria-expanded={menuOpen} aria-controls="site-menu" onClick={()=>setMenuOpen(!menuOpen)}><SiteIcon name={menuOpen?"close":"menu"}/></button></div>
 </div>{menuOpen&&<nav id="site-menu" className="mobile-nav" aria-label="روابط إضافية"><div className="shell">{[...primary,...additional].map(item=><Link key={item.href} href={item.href} onClick={()=>setMenuOpen(false)}>{item.label}<SiteIcon name="arrow" width="16"/></Link>)}</div></nav>}</header>;
}
