import MathArticleLab from "@/components/math-article-lab";
import { getMathArticleLab } from "@/lib/math-article-labs";
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
const knowledgeIllustrations = [
  {
    "slug": "ai-vs-machine-learning-vs-deep-learning",
    "section": "section-1",
    "src": "https://upload.wikimedia.org/wikipedia/commons/b/bb/AI-ML-DL.svg",
    "width": 748,
    "height": 826,
    "maxWidth": 480,
    "alt": "ثلاث مساحات متداخلة: الذكاء الاصطناعي يضم تعلم الآلة، وتعلم الآلة يضم التعلم العميق",
    "caption": "يمثل الرسم العلاقة بين المجالات الثلاثة: التعلم العميق جزء من تعلم الآلة، وتعلم الآلة جزء من الذكاء الاصطناعي.",
    "credit": "Avimanyu786 وTukijaaliwa",
    "source": "https://commons.wikimedia.org/wiki/File:AI-ML-DL.svg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "ai-vs-machine-learning-vs-deep-learning",
    "section": "section-2",
    "src": "https://upload.wikimedia.org/wikipedia/commons/9/91/Multi-Layer_Neural_Network-Vector.svg",
    "width": 957,
    "height": 567,
    "maxWidth": 620,
    "alt": "عقد مترابطة مرتبة في طبقات تبدأ بالمدخلات وتنتهي بالمخرجات",
    "caption": "رسم مبسّط لشبكة عصبية متعددة الطبقات. تمثل الدوائر عقدًا تُمرّر القيم من طبقة إلى التالية؛ ولا يوضح الرسم بنية نموذج فرز بعينه.",
    "credit": "Offnfopt",
    "source": "https://commons.wikimedia.org/wiki/File:Multi-Layer_Neural_Network-Vector.svg",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "types-of-artificial-intelligence",
    "section": "section-1",
    "src": "https://upload.wikimedia.org/wikipedia/commons/b/be/Deep_Blue.jpg",
    "width": 400,
    "height": 601,
    "maxWidth": 360,
    "alt": "خزانة حاسوب Deep Blue من آي بي إم معروضة في متحف تاريخ الحاسوب",
    "caption": "حاسوب Deep Blue من آي بي إم في متحف تاريخ الحاسوب. تفوّق حاسوب من هذا النوع على غاري كاسباروف في مباراة عام 1997، وهو مثال على الأداء المتخصص في الشطرنج.",
    "credit": "James the photographer",
    "source": "https://commons.wikimedia.org/wiki/File:Deep_Blue.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    "slug": "what-is-an-algorithm",
    "section": "inputs-and-steps",
    "src": "https://upload.wikimedia.org/wikipedia/commons/d/da/If_Flowchart-ar.svg",
    "width": 855,
    "height": 1682,
    "maxWidth": 315,
    "alt": "مخطط انسيابي بالعربية يوضح تفرع خطوات التنفيذ بحسب تحقق شرط",
    "caption": "يوضح المخطط كيف يتغير مسار التنفيذ تبعًا لنتيجة الشرط. في مثال الطلبات، يحدد التطابق هل ينتهي البحث أم يستمر.",
    "credit": "Michel Bakni",
    "source": "https://commons.wikimedia.org/wiki/File:If_Flowchart-ar.svg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "what-is-an-algorithm",
    "section": "binary-search",
    "src": "https://upload.wikimedia.org/wikipedia/commons/6/64/Binary_search_into_array_-_example.svg",
    "width": 382,
    "height": 244,
    "maxWidth": 490,
    "alt": "رسم يوضح تقلص نطاق البحث الثنائي في مصفوفة مرتبة",
    "caption": "مثال مستقل على البحث الثنائي. تضيق المقارنات المتتابعة نطاق البحث في القائمة المرتبة حتى الوصول إلى العنصر المطلوب.",
    "credit": "LoStrangolatore",
    "source": "https://commons.wikimedia.org/wiki/File:Binary_search_into_array_-_example.svg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "big-data-and-artificial-intelligence",
    "section": "volume-velocity-variety",
    "src": "https://upload.wikimedia.org/wikipedia/commons/e/ee/Big_Data.png",
    "width": 612,
    "height": 422,
    "maxWidth": 612,
    "alt": "رسم يوضح تراكم بيانات من مصادر مختلفة وزيادة حجمها وسرعة تدفقها وتنوعها",
    "caption": "تتجمع البيانات من مصادر متعددة. يوضح الرسم الخصائص الثلاث التي تؤثر في طريقة جمع السجلات ومعالجتها.",
    "credit": "Ender005",
    "source": "https://commons.wikimedia.org/wiki/File:Big_Data.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "big-data-and-artificial-intelligence",
    "section": "prepare-training-data",
    "src": "https://upload.wikimedia.org/wikipedia/commons/b/bb/ML_dataset_training_validation_test_sets.png",
    "width": 1280,
    "height": 558,
    "maxWidth": 780,
    "alt": "مخطط يقارن تقسيم البيانات إلى مجموعتي تدريب واختبار بتقسيمها إلى تدريب وتحقق واختبار",
    "caption": "طريقتان لتقسيم البيانات. في مثال توقع المبيعات، يُطبَّق التقسيم حسب ترتيب الأسابيع، ويُحجز الاختبار لتقييم النموذج بعد اختيار إعداداته.",
    "credit": "Km121220",
    "source": "https://commons.wikimedia.org/wiki/File:ML_dataset_training_validation_test_sets.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "what-is-labeled-data",
    "section": "meaning",
    "src": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Image-segmentation-example.jpg",
    "width": 1200,
    "height": 900,
    "maxWidth": 520,
    "alt": "الصورة الأصلية لحاسوب محمول وكأس على طاولة خشبية",
    "caption": "الصورة الأصلية. هي المدخل الذي تظهر فيه أجسام مختلفة قبل إسناد وسوم إلى مناطقها.",
    "credit": "MartinThoma",
    "source": "https://commons.wikimedia.org/wiki/File:Image-segmentation-example.jpg",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "what-is-labeled-data",
    "section": "meaning",
    "src": "https://upload.wikimedia.org/wikipedia/commons/1/19/Image-segmentation-example-segmented.png",
    "width": 1200,
    "height": 900,
    "maxWidth": 520,
    "alt": "تمثيل ملون للمشهد نفسه يفصل مناطق الحاسوب والكأس والطاولة",
    "caption": "نسخة مقسمة من المشهد نفسه. تمثل الألوان مناطق مختلفة، وتوضح كيف يمتد وسم الصورة إلى مناطق بداخلها.",
    "credit": "MartinThoma",
    "source": "https://commons.wikimedia.org/wiki/File:Image-segmentation-example-segmented.png",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  }
];

function KnowledgeIllustrations({slug, section}: {slug: string; section: string}) {
  return knowledgeIllustrations.filter(item => item.slug === slug && item.section === section).map(item => (
    <figure className="guide-figure" data-sourced-illustration key={item.src} style={{marginBlock:24}}>
      <Image src={item.src} width={item.width} height={item.height} alt={item.alt}
        unoptimized loading="lazy" referrerPolicy="no-referrer"
        style={{display:"block", width:"100%", maxWidth:item.maxWidth, height:"auto", marginInline:"auto"}} />
      <figcaption style={{fontSize:15,lineHeight:1.7,textAlign:"center",marginTop:8}}>
        {item.caption}{" "}
        <a href={item.source} rel="noopener noreferrer" target="_blank">{item.credit} · ويكيميديا كومنز</a>
        {" · "}<a href={item.licenseUrl} rel="noopener noreferrer" target="_blank"><bdi>{item.license}</bdi></a>.
      </figcaption>
    </figure>
  ));
}

const tableCell={padding:"12px 14px",borderBottom:"1px solid #e2e8f0",verticalAlign:"top" as const};
export default async function KnowledgeTopicPage({params}:{params:Promise<{slug:string}>}){
const {slug}=await params;const topic=getKnowledgeTopic(slug);
if(!topic || !topic.directAnswer?.trim() || !topic.sections.length)notFound();
const lab=getMathArticleLab(topic.slug);
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
{lab && <MathArticleLab lab={lab} />}
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
{lab && <li><a href="#math-experiment" style={{color:"#0d7490",textDecoration:"underline"}}>توقّع وجرّب على الرسم</a></li>}
{topic.tool && <li><a href="#interactive-tool" style={{color:"#0d7490",textDecoration:"underline"}}>الأداة التفاعلية</a></li>}
</ul></nav>
{topic.sections.map(section=><section key={section.id} id={section.id} style={{marginBlock:30,scrollMarginTop:35}}>
<h2 style={{fontSize:26,fontWeight:800,lineHeight:1.55,marginBottom:13}}>{section.heading}</h2>
{!section.blocks && section.paragraphs?.map((p,i)=><p key={i} style={{marginBlock:13,fontSize:17}}>{p}</p>)}
{section.blocks?.map((block,i)=> {
 if(block.kind === "heading") return <h3 key={i} style={{fontSize:21,fontWeight:700,marginBlock:18}}>{block.text}</h3>;
 if(block.kind === "paragraph") return <p key={i} style={{marginBlock:13,fontSize:17}}>{block.text}</p>;
 if(block.kind === "diagram") return <pre key={i} style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere",padding:18,background:"#f1f5f9",borderRadius:12}}>{block.text}</pre>;
 if(block.kind === "list") return <ul key={i} style={{paddingInlineStart:27}}>{block.items.map((item,j)=><li key={j}>{item}</li>)}</ul>;
 if(block.kind === "table") return <div key={i} style={{overflowX:"auto",marginBlock:18}}><table style={{width:"100%",minWidth:600,borderCollapse:"collapse",textAlign:"start"}}><caption>{section.heading}</caption><thead><tr>{block.headers.map((h,j)=><th key={j} scope="col" style={tableCell}>{h}</th>)}</tr></thead><tbody>{block.rows.map((row,j)=><tr key={j}>{row.map((cell,k)=>k===0?<th scope="row" key={k} style={tableCell}>{cell}</th>:<td key={k} style={tableCell}>{cell}</td>)}</tr>)}</tbody></table></div>;
})}
{section.points?.length ? <ul style={{paddingInlineStart:27,marginBlock:12}}>{section.points.map((point,i)=><li key={i} style={{marginBottom:8}}>{point}</li>)}</ul> : null}
{section.table && <div style={{overflowX:"auto",border:"1px solid #e2e8f0",borderRadius:12,marginBlock:17}}>
<table style={{width:"100%",minWidth:600,borderCollapse:"collapse",textAlign:"start"}}>
<caption style={{padding:10,color:"#475569",fontSize:13}}>{section.table.caption}</caption>
<thead><tr style={{background:"#e6f0f4"}}>{section.table.headers.map(h=><th scope="col" key={h} style={tableCell}>{h}</th>)}</tr></thead>
<tbody>{section.table.rows.map((row,i)=><tr key={i} style={{background:i%2?"#f8fafc":"#fff"}}>{row.map((v,j)=>j===0?<th scope="row" key={j} style={tableCell}>{v}</th>:<td key={j} style={tableCell}>{v}</td>)}</tr>)}</tbody>
</table></div>}
{section.note && <aside style={{borderRight:"4px solid #f59e0b",background:"#fffbeb",padding:18,borderRadius:7,marginTop:14}}><strong>تنبيه</strong><p>{section.note}</p></aside>}
<KnowledgeIllustrations slug={topic.slug} section={section.id}/>
</section>)}
{topic.tool && <KnowledgeInteractiveTool kind={topic.tool} slug={topic.slug}/>}
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
