import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { pageAlternates } from "@/lib/page-alternates";
import { absoluteUrl } from "@/lib/site-config";
import { RomanConverter } from "./roman-converter";

const path="/knowledge/roman-numerals";
const title="الأرقام الرومانية من 1 إلى 100: الجدول الكامل والقواعد ومحول مجاني";
const description="تعلم الأرقام الرومانية من 1 إلى 100 بالجدول، وافهم رموز I وV وX وL وC وقواعد الجمع والطرح، واستخدم محولًا تفاعليًا دون تسجيل.";
export const metadata: Metadata={
  title, description, alternates:pageAlternates(path),
  openGraph:{title,description,url:path,type:"article",images:[{url:"/images/roman-numerals-education.svg",alt:"الرموز الأساسية للأرقام الرومانية"}]},
  robots:{index:true,follow:true},
};
export const revalidate=86400;
const base:[number,string][]=[[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
function roman(n:number):string{let s="";for(const [num,sym] of base){while(n>=num){s+=sym;n-=num}}return s;}
const rows=Array.from({length:100},(_,i)=>({number:i+1,roman:roman(i+1)}));
const box={background:"#fff",border:"1px solid #e5e7eb",padding:22,borderRadius:14} as const;
const h2={fontSize:26,fontWeight:700,marginTop:32,marginBottom:12} as const;
export default function RomanNumeralsPage(){
  const url=absoluteUrl(path);
  const schema={"@context":"https://schema.org","@type":"Article",headline:title,description,url,inLanguage:"ar",datePublished:"2026-11-06",
    author:{"@type":"Organization",name:"فريق لوسيل",url:absoluteUrl("/authors/editorial-team")},
    publisher:{"@type":"Organization",name:"لوسيل",url:absoluteUrl("/")},image:absoluteUrl("/images/roman-numerals-education.svg"),
    mainEntityOfPage:{"@type":"WebPage","@id":url}};
  return <main id="main-content" className="shell" style={{paddingBlock:44}}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "معارف وأدوات", item: absoluteUrl("/knowledge") },
          { "@type": "ListItem", position: 3, name: "الأرقام الرومانية", item: absoluteUrl(path) },
        ],
      }) }} />
      <nav aria-label="مسار التنقل" style={{color:"#64748b",marginBottom:18}}><Link href="/">الرئيسية</Link> / <Link href="/knowledge">معارف وأدوات</Link> / الأرقام الرومانية</nav>
    <article style={{maxWidth:950,margin:"auto"}}>
      <header><p style={{fontSize:14,color:"#475569"}}>رياضيات · شرح أصلي وأداة تعليمية</p>
        <h1 style={{fontSize:"clamp(29px,4vw,44px)",fontWeight:800,lineHeight:1.5,margin:"12px 0"}}>{title}</h1>
        <p style={{fontSize:18,lineHeight:1.9}}>الأرقام الرومانية طريقة لكتابة الأعداد باستخدام حروف لاتينية. مثلًا 1 = I، و4 = IV، و9 = IX، و40 = XL، و90 = XC، و100 = C. هذا النظام مختلف تمامًا عن كلمات اللغة الرومانية المعاصرة.</p>
        <p style={{color:"#64748b",fontSize:13}}>نشر: 6 نوفمبر 2026 · إعداد: فريق لوسيل · المجال: تعليم الرياضيات</p>
      </header>
      <figure style={{margin:"26px 0"}}><Image src="/images/roman-numerals-education.svg" alt="مخطط أصلي يوضح قيم الرموز الرومانية I وV وX وL وC وD وM وأمثلة الطرح" width={1200} height={630} unoptimized style={{borderRadius:16,width:"100%",height:"auto"}}/><figcaption style={{fontSize:13,color:"#64748b",marginTop:8}}>رسم توضيحي من إعداد لوسيل للقيم الأساسية والصيغ القياسية الحديثة.</figcaption></figure>
      <section style={box}><h2 style={{fontSize:23,fontWeight:700,marginBottom:8}}>الإجابة السريعة</h2>
        <p>رموز الأرقام الرومانية السبعة: <b dir="ltr">I = 1، V = 5، X = 10، L = 50، C = 100، D = 500، M = 1000</b>. تُجمع الرموز غالبًا من اليسار إلى اليمين، بينما تعني بعض التركيبات الخاصة الطرح مثل IV وIX.</p></section>
      <RomanConverter/>
      <h2 style={h2}>جدول الأرقام الرومانية من 1 إلى 100</h2>
      <p>يمكنك البحث في الجدول بعينك، أو استخدام المحول أعلاه للتحويل المباشر. الجدول مبني على الشكل القياسي الحديث للأرقام الرومانية.</p>
      <div style={{overflowX:"auto",marginTop:16,border:"1px solid #e5e7eb",borderRadius:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",textAlign:"center"}}>
          <caption style={{padding:10}}>مقابلات الأعداد من 1 حتى 100</caption>
          <thead style={{background:"#ecf4f7"}}><tr><th style={{padding:12}}>العدد</th><th>الروماني</th><th>العدد</th><th>الروماني</th><th>العدد</th><th>الروماني</th><th>العدد</th><th>الروماني</th></tr></thead>
          <tbody>{Array.from({length:25},(_,i)=><tr key={i} style={{background:i%2?"#f8fafc":"#fff"}}>{[i,i+25,i+50,i+75].map(index=><><td key={"num"+index} style={{padding:9,borderTop:"1px solid #e5e7eb"}}>{rows[index].number}</td><td key={"rom"+index} dir="ltr" style={{padding:9,borderTop:"1px solid #e5e7eb",fontWeight:700}}>{rows[index].roman}</td></>)}</tr>)}</tbody>
        </table>
      </div>
      <h2 style={h2}>كيف تقرأ الرقم الروماني؟</h2>
      <p>تبدأ من الرموز الأكبر إلى الأصغر، وتجمع القيم ما لم يأت رمز أصغر قبل رمز يسمح بطرح قيمته. فمثلًا VIII = 5 + 1 + 1 + 1 = 8، بينما IX = 10 − 1 = 9.</p>
      <h3 style={{fontSize:21,fontWeight:700,margin:"22px 0 8px"}}>متى نطرح بدل الجمع؟</h3>
      <p>في التدوين القياسي الشائع: I تسبق V أو X (IV، IX)، وX تسبق L أو C (XL، XC)، وC تسبق D أو M (CD، CM). لا تُستخدم VL لكتابة 45؛ الصيغة الصحيحة XLV.</p>
      <h3 style={{fontSize:21,fontWeight:700,margin:"22px 0 8px"}}>هل يُكتب الرقم 4 على الساعة IIII؟</h3>
      <p>قد يظهر IIII على بعض الساعات بوصفه اصطلاحًا تاريخيًا أو تصميميًا، لكن IV هي الصيغة القياسية الحديثة الشائعة في جداول التعليم والمحول هنا.</p>
      <h2 style={h2}>تدريبات محلولة</h2>
      <div style={{display:"grid",gap:12}}>
        {[["17","XVII","10 + 5 + 1 + 1"],["29","XXIX","10 + 10 + 9"],["44","XLIV","40 + 4"],["58","LVIII","50 + 5 + 3"],["99","XCIX","90 + 9"]].map(([number,result,explanation])=><p key={number} style={box}><b>{number} = {result}</b>؛ التفسير: {explanation}.</p>)}
      </div>
      <h2 style={h2}>أخطاء شائعة</h2>
      <p>لا تخلط الأرقام الرومانية بكلمات اللغة الرومانية. كما أن صفرًا لا يوجد له رمز تقليدي مقابل ضمن الرموز السبعة. وتجنب تكرار V أو L أو D أو جمع تراكيب غير قياسية؛ استخدم المحول للتحقق من الصيغ المدرسية.</p>
      <h2 style={h2}>المراجع</h2>
      <p>راجعت التعريف والرموز وقواعد الكتابة الحديثة مقابل <a style={{color:"#2563eb",textDecoration:"underline"}} href="https://mathworld.wolfram.com/RomanNumerals.html" target="_blank" rel="noopener noreferrer">Wolfram MathWorld — Roman Numerals</a>، وهو مصدر رياضي مرجعي. تختلف بعض الكتابات التاريخية عن الاصطلاحات القياسية المعاصرة.</p>
      <p style={{marginTop:30}}>اقرأ أيضًا: <Link style={{color:"#2563eb",textDecoration:"underline"}} href="/knowledge/learning-objectives">كيف تكتب أهدافًا تعليمية قابلة للقياس؟</Link></p>
    </article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
  </main>;
}
