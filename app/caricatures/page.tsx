import type {Metadata} from "next";
import Link from "next/link";
import Image from "next/image";
import {pageAlternates} from "@/lib/page-alternates";
import {absoluteUrl} from "@/lib/site-config";
import s from "./caricatures.module.css";
const artwork="/images/caricatures/gaza-flooded-tents.svg";
export const metadata:Metadata={title:"الكاريكاتير | موسوعة لوسيل",description:"معرض الكاريكاتير الأصلي في موسوعة لوسيل: رسوم وقضايا إنسانية واجتماعية مع شرح دلالات الصورة وسياقها.",alternates:pageAlternates("/caricatures"),robots:{index:true,follow:true},openGraph:{title:"معرض الكاريكاتير | لوسيل",url:"/caricatures",images:[{url:artwork}]}};
export default function Page(){
const schema={"@context":"https://schema.org","@type":"CollectionPage",name:"معرض الكاريكاتير | لوسيل",url:absoluteUrl("/caricatures"),inLanguage:"ar",mainEntity:{"@type":"ItemList",numberOfItems:1,itemListElement:[{"@type":"ListItem",position:1,name:"غزة حين تغرق الخيام",url:absoluteUrl("/caricatures/gaza-flooded-tents")}]}};
return <main id="main-content" className={s.page}><div className={s.wrap}>
<nav className={s.crumb} aria-label="مسار التنقل"><Link href="/">الرئيسية</Link><span>/</span><span>الكاريكاتير</span></nav>
<section className={s.hero}><div><span className={s.eyebrow}>الفن يرى ما لا تقوله العناوين</span><h1>الكاريكاتير في موسوعة لوسيل</h1><p>مساحة للرسوم التحريرية الأصلية التي تناقش قضايا الإنسان والمجتمع من خلال الرموز والمجازات البصرية. كل عمل مرفق بوصف فني، وشرح للرسالة، وتنبيه واضح إلى أن الرسوم ليست توثيقًا فوتوغرافيًا للأحداث.</p><Link className={s.action} href="/caricatures/gaza-flooded-tents">شاهد أول عمل: غزة حين تغرق الخيام</Link></div><figure className={s.figure}><Image src={artwork} width={1200} height={760} unoptimized priority alt="رسم رمزي لخيام مغمورة بمياه الفيضان ومدنيين يحاولون النجاة في غزة"/></figure></section>
<section><h2 className={s.sectionTitle}>الأعمال المنشورة</h2><Link className={s.artCard} href="/caricatures/gaza-flooded-tents"><Image src={artwork} width={1200} height={760} unoptimized alt="كاريكاتير غزة حين تغرق الخيام"/><div className={s.artCopy}><span className={s.date}>قضايا إنسانية · 8 نوفمبر 2026</span><h2>غزة حين تغرق الخيام</h2><p>حيث يتحول المأوى المؤقت إلى مساحة مهددة بالمطر والمياه، تحاول العائلات إنقاذ ما تبقى من يومها. وصف دقيق للوحة ورموزها الفنية والإنسانية.</p></div></Link></section>
</div><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} /></main>;
}