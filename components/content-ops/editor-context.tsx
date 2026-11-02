"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {stageLabels,text,type OpsRecord} from "@/lib/content-ops/model";
import type {CmsDocument} from "@/lib/cms/model";
type Context={rows:{content_items:OpsRecord[];content_briefs:OpsRecord[];content_outlines:OpsRecord[];source_claims:OpsRecord[]};role:string};
export function EditorialContext({document,onChange}:{document:CmsDocument;onChange:(patch:Partial<CmsDocument>)=>void}){
 const [data,setData]=useState<Context|null>(null),[error,setError]=useState("");
 useEffect(()=>{const controller=new AbortController();void fetch("/api/admin/content-ops",{cache:"no-store",signal:controller.signal}).then(async response=>{const result=await response.json();if(!response.ok)throw Error(result.error?.message??"تعذر تحميل الموجز");setData(result);}).catch(e=>{if(!controller.signal.aborted)setError(e.message);});return ()=>controller.abort();},[]);
 if(error)return <section role="alert"><h2>السياق التحريري</h2><p>{error}</p><Link href="/admin/content-ops">عمليات المحتوى</Link></section>;
 if(!data)return <section aria-busy="true"><h2>السياق التحريري</h2><p>تحميل الموجز والهيكل…</p></section>;
 const selected=data.rows.content_items.find(item=>item.id===document.operationsItemId||(!document.operationsItemId&&item.data.publicPath===`/articles/${document.slug}`));
 return <section><h2>الموجز والهيكل والمصادر</h2><label>عملية الإنتاج<select value={document.operationsItemId??selected?.id??""} onChange={e=>onChange({operationsItemId:e.target.value||undefined})}><option value="">اختر عملية معتمدة</option>{data.rows.content_items.filter(item=>item.data.kind==="article").map(item=><option key={item.id} value={item.id}>{text(item.data.title)} · {stageLabels[text(item.data.stage)]}</option>)}</select></label><Link href="/admin/content-ops">فتح عمليات المحتوى ←</Link>
 {!selected&&<p>اربط المقال بعملية إنتاج لاعتماد الموجز والهيكل والمراجعات قبل النشر.</p>}
 {selected&&<><p>المرحلة: {stageLabels[text(selected.data.stage)]}</p>{data.rows.content_briefs.filter(record=>record.item_id===selected.id).map(record=><details key={record.id}><summary>الموجز: {text(record.data.title)} ({text(record.data.status)})</summary>{["problem","audience","country","keyword","searchIntent","informationGain","officialSources","readerOutcome"].map(key=><p key={key} style={{whiteSpace:"pre-wrap"}}>{text(record.data[key])}</p>)}</details>)}{data.rows.content_outlines.filter(record=>record.item_id===selected.id).map(record=><details key={record.id}><summary>الهيكل: {text(record.data.title)} ({text(record.data.status)})</summary><ol>{Array.isArray(record.data.sections)&&record.data.sections.map((section,index)=>{const value=section as Record<string,unknown>;return <li key={index}>H{text(String(value.level))} · {text(value.title)}<p>{text(value.questions)}</p><p>{text(value.sources)}</p></li>;})}</ol></details>)}<h3>ادعاءات تحتاج تحققًا</h3>{data.rows.source_claims.filter(record=>record.item_id===selected.id).map(record=><p key={record.id}>{text(record.data.title)} · {text(record.data.status)} · {text(record.data.url)}</p>)}</>}
 {data.role==="admin"&&<label>سبب استثناء بدء مسودة دون موجز (للمدير فقط)<textarea maxLength={3000} value={document.editorialOverrideReason??""} onChange={e=>onChange({editorialOverrideReason:e.target.value})}/><small>يسجل السبب في تاريخ التدقيق. الاستثناء لا يسمح بتجاوز إخفاقات المراجعة عند النشر.</small></label>}
 </section>;
}
