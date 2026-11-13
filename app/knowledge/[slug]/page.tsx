import type { Metadata } from "next";
import Link from "next/link";
import { EditorialCover } from "@/components/editorial-cover";
import Image from "next/image";
import { editorialImagePath } from "@/lib/editorial-image-url";
import { notFound } from "next/navigation";
import { pageAlternates } from "@/lib/page-alternates";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { knowledgeTopics, getKnowledgeTopic } from "@/lib/knowledge-expansion-data";
import { KnowledgeInteractiveTool } from "@/components/knowledge-interactive-tools";
import { isKnowledgeSearchReady, isMedicalKnowledgeTopic } from "@/lib/editorial-indexing";

export const dynamicParams = false;
export const revalidate = 86400;
export function generateStaticParams() {
  return knowledgeTopics.filter(t=>Boolean(t.directAnswer?.trim()) && t.sections.length>0).map(t=>({slug:t.slug}));
}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const topic=getKnowledgeTopic(slug);
  if(!topic || !topic.directAnswer?.trim() || !topic.sections.length)return {robots:{index:false,follow:false}};
  const path="/knowledge/"+topic.slug;
  const cover = editorialImagePath("knowledge", topic.slug);
  return {title:topic.title,description:topic.description,alternates:pageAlternates(path),
    robots:{index:isKnowledgeSearchReady(topic),follow:true},
    openGraph:{title:topic.title,description:topic.description,url:path,type:"article",publishedTime:topic.publishedAt,
      images:[{url:cover,alt:"غلاف تحريري: "+topic.title,width:1200,height:630}]},
    twitter:{card:"summary_large_image",title:topic.title,description:topic.description,images:[cover]}};
}
const tableCell={padding:"12px 14px",borderBottom:"1px solid #e2e8f0",verticalAlign:"top" as const};
export default async function KnowledgeTopicPage({params}:{params:Promise<{slug:string}>}){
const {slug}=await params;const topic=getKnowledgeTopic(slug);
if(!topic || !topic.directAnswer?.trim() || !topic.sections.length)notFound();
const path="/knowledge/"+topic.slug;const url=absoluteUrl(path);
const cover=editorialImagePath("knowledge",topic.slug);
const articleSchema={"@context":"https://schema.org","@type":"Article","@id":url+"#article",headline:topic.title,description:topic.description,url,inLanguage:"ar",articleSection:topic.category,datePublished:topic.publishedAt,dateModified:topic.publishedAt,
 author:{"@type":"Organization",name:siteConfig.publisher,url:absoluteUrl("/team")},publisher:{"@type":"Organization",name:siteConfig.name,url:absoluteUrl("/")},mainEntityOfPage:{"@type":"WebPage","@id":url},image:{"@type":"ImageObject",url:absoluteUrl(cover),width:1200,height:630}};
const breadcrumbSchema={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[
 {"@type":"ListItem",position:1,name:"الرئيسية",item:absoluteUrl("/")},
 {"@type":"ListItem",position:2,name:"معارف وأدوات",item:absoluteUrl("/knowledge")},
 {"@type":"ListItem",position:3,name:topic.title,item:url}
]};
return <main id="main-content" className="shell" style={{paddingBlock:45}}>
<nav aria-label="مسار التنقل" style={{color:"#64748b",marginBottom:18}}><Link href="/knowledge">رئيسية المشروع</Link> / <Link href="/knowledge">معارف وأدوات</Link> / {topic.category}</nav>
<article style={{maxWidth:990,margin:"auto",lineHeight:1.95,color:"#14273b"}}>
<header>
<p style={{color:"#0f766e",fontWeight:700}}>{topic.category} · دليل أصلي بمصادر واضحة</p>
<h1 style={{fontSize:"clamp(29px,4vw,43px)",fontWeight:800,lineHeight:1.5,marginBlock:14}}>{topic.title}</h1>
<p style={{fontSize:18}}>{topic.intro}</p>
<p style={{fontSize:13,color:"#64748b",marginBlock:13}}>إعداد: فريق لوسيل · تاريخ النشر: <time dateTime={topic.publishedAt}>{topic.publishedAt}</time></p>
{isMedicalKnowledgeTopic(topic) && <p role="note" style={{background:"#fff7ed",padding:12,borderRadius:8,fontSize:14}}>هذه معلومات عامة، ولم تُوثَّق لهذا المقال مراجعة تخصصية مستقلة حتى الآن. لا تستخدمه بدل التقييم الطبي أو تعليمات الجهات الصحية الرسمية.</p>}
</header>
<EditorialCover
  title={topic.title}
  category={topic.category}
  image={topic.image}
  imageAlt={topic.imageAlt}
  imageUrl={cover}
  priority
  description="مفهوم واضح · شرح متعمق · تطبيق عملي"
/>
<section aria-labelledby="direct-answer" style={{background:"#eff8f6",border:"1px solid #9fd5c9",borderRadius:14,padding:23}}>
<h2 id="direct-answer" style={{fontSize:24,fontWeight:800,marginBottom:9}}>الإجابة المختصرة</h2><p style={{fontSize:17}}>{topic.directAnswer}</p>
</section>
{topic.sections.length >= 2 ? <figure className="guide-figure" style={{marginBlock:27}}>
  <Image
    src={editorialImagePath("knowledge",topic.slug,"map")}
    alt={"خريطة مرئية لعناوين محاور " + topic.title}
    width={1200}
    height={730}
    unoptimized
    sizes="(max-width: 768px) calc(100vw - 32px), 880px"
    loading="lazy"
    style={{width:"100%",height:"auto",borderRadius:14}}
  />
  <figcaption>خريطة تحريرية تلخص محاور المقال كما وردت في أقسامه؛ ليست نتيجة تجربة أو بيانات إحصائية.</figcaption>
</figure> : null}
<nav aria-label="محتويات الدليل" style={{marginBlock:23,padding:18,border:"1px solid #e2e8f0",borderRadius:14}}>
<strong>محتويات الدليل</strong><ul style={{paddingInlineStart:22,columns:2,columnWidth:"270px",marginTop:8}}>
{topic.sections.map(s=><li key={s.id}><a href={"#"+s.id} style={{color:"#0d7490",textDecoration:"underline"}}>{s.heading}</a></li>)}
<li><a href="#interactive-tool" style={{color:"#0d7490",textDecoration:"underline"}}>الأداة التفاعلية</a></li>
</ul></nav>
{topic.sections.map(section=><section key={section.id} id={section.id} style={{marginBlock:30,scrollMarginTop:35}}>
<h2 style={{fontSize:26,fontWeight:800,lineHeight:1.55,marginBottom:13}}>{section.heading}</h2>
{section.paragraphs?.map((p,i)=><p key={i} style={{marginBlock:13,fontSize:17}}>{p}</p>)}
{section.points?.length ? <ul style={{paddingInlineStart:27,marginBlock:12}}>{section.points.map((point,i)=><li key={i} style={{marginBottom:8}}>{point}</li>)}</ul> : null}
{section.table && <div style={{overflowX:"auto",border:"1px solid #e2e8f0",borderRadius:12,marginBlock:17}}>
<table style={{width:"100%",minWidth:600,borderCollapse:"collapse",textAlign:"start"}}>
<caption style={{padding:10,color:"#475569",fontSize:13}}>{section.table.caption}</caption>
<thead><tr style={{background:"#e6f0f4"}}>{section.table.headers.map(h=><th scope="col" key={h} style={tableCell}>{h}</th>)}</tr></thead>
<tbody>{section.table.rows.map((row,i)=><tr key={i} style={{background:i%2?"#f8fafc":"#fff"}}>{row.map((v,j)=>j===0?<th scope="row" key={j} style={tableCell}>{v}</th>:<td key={j} style={tableCell}>{v}</td>)}</tr>)}</tbody>
</table></div>}
{section.note && <aside style={{borderRight:"4px solid #f59e0b",background:"#fffbeb",padding:18,borderRadius:7,marginTop:14}}><strong>تنبيه</strong><p>{section.note}</p></aside>}
</section>)}
<KnowledgeInteractiveTool kind={topic.tool} slug={topic.slug}/>
<section id="frequently-asked-questions" style={{marginBlock:32}}>
<h2 style={{fontSize:26,fontWeight:800,marginBottom:15}}>أسئلة شائعة</h2>
{topic.faq.map((faq,i)=><details key={i} style={{marginBlock:10,border:"1px solid #e2e8f0",padding:16,borderRadius:10}}>
<summary style={{fontWeight:700,cursor:"pointer"}}>{faq.question}</summary><p style={{marginTop:10}}>{faq.answer}</p></details>)}
</section>
<section id="sources" style={{borderTop:"1px solid #e2e8f0",paddingTop:20,marginTop:24}}>
<h2 style={{fontSize:25,fontWeight:800,marginBottom:12}}>المراجع والمصادر</h2>
<p>هذه مراجع للاطلاع، لكن لم تُفحص صلاحية جميع روابطها في جولة التدقيق الحالية. تحقق من أحدث نسخة للمصدر قبل الاعتماد على معلومة متغيرة؛ والأمثلة والأدوات التعليمية لا تُعد نتائج تجارب ميدانية فعلية.</p>
<ul style={{paddingInlineStart:24,marginTop:10}}>
{topic.sources.map(item=><li key={item.url} style={{marginBottom:7}}><a href={item.url} target="_blank" rel="noopener noreferrer" style={{color:"#0d7490",textDecoration:"underline"}}>{item.label}</a></li>)}</ul>
</section>
<section aria-label="مقالات مرتبطة" style={{marginBlock:25,padding:18,background:"#f8fafc",borderRadius:13}}>
<h2 style={{fontSize:21,fontWeight:750,marginBottom:10}}>أكمل التعلم</h2>
<ul style={{paddingInlineStart:23}}>{topic.related.map(link=><li key={link.href}><Link href={link.href} style={{color:"#0d7490",textDecoration:"underline"}}>{link.label}</Link></li>)}</ul>
<p><Link href="/knowledge">العودة إلى جميع الأدلة والأدوات</Link></p></section>
</article>
<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(articleSchema).replace(/</g,"\\u003c")}}/>
<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,"\\u003c")}}/>
</main>;
}
