"use client";
import {Suspense,useEffect,useState} from "react";
import {usePathname,useSearchParams} from "next/navigation";
import {publicHeatmapPath} from "@/lib/heatmap/public";
import "./tracker.css";
const choiceKey="lusaill.heatmap.consent.v1";
export function HeatmapTracker(){
 return <Suspense fallback={null}><HeatmapRoute/></Suspense>;
}
function HeatmapRoute(){
 const rawPath=usePathname(),query=useSearchParams().toString();let path=rawPath;try{path=decodeURIComponent(rawPath);}catch{}const [sizeRevision,setSizeRevision]=useState(0);
 useEffect(()=>{let width=innerWidth;const resize=()=>{if(innerWidth!==width){width=innerWidth;setSizeRevision(n=>n+1);}};window.addEventListener("resize",resize,{passive:true});return ()=>window.removeEventListener("resize",resize);},[]);
 return <HeatmapPageTracker key={`${path}?${query}:${sizeRevision}`} path={path}/>;
}
function HeatmapPageTracker({path}:{path:string}){
 const [enabled,setEnabled]=useState(false),[consent,setConsent]=useState(""),[open,setOpen]=useState(false),[test,setTest]=useState(false),[message,setMessage]=useState("");
 useEffect(()=>{let active=true;const controller=new AbortController();
 if(!publicHeatmapPath(path)||window.self!==window.top||navigator.doNotTrack==="1"||(navigator as Navigator&{globalPrivacyControl?:boolean}).globalPrivacyControl||document.querySelector('meta[name="robots"]')?.getAttribute("content")?.includes("noindex"))return;
 const q=new URLSearchParams(location.search);const isTest=q.get("heatmap_test")==="1";if([...q.keys()].some(k=>!k.startsWith("utm_")&&!["gclid","fbclid","heatmap_test"].includes(k)))return;
 if(!isTest&&!['www.lusaill.online','localhost','127.0.0.1'].includes(location.hostname))return;
 let choice="";try{choice=localStorage.getItem(choiceKey)??"";}catch{}
 const run=()=>void fetch("/api/heatmap/config",{signal:controller.signal}).then(r=>r.json()).then(data=>{if(active){setEnabled(Boolean(data.configured&&(data.enabled||isTest)));setTest(isTest);setConsent(isTest?"yes":choice);setOpen(false);}}).catch(()=>{});
 const id=window.setTimeout(run,1200);return ()=>{active=false;clearTimeout(id);controller.abort();};
 },[path]);
 useEffect(()=>{const storage=(e:StorageEvent)=>{if(e.key===choiceKey&&!test){setConsent(e.newValue??"");setOpen(false);}};window.addEventListener("storage",storage);return ()=>window.removeEventListener("storage",storage);},[test]);
 useEffect(()=>{if(!enabled||consent!=="yes")return;const controller=new AbortController();let cleanup:(()=>void)|undefined;let removed=false;
 const run=()=>void import("@/lib/heatmap/client").then(m=>m.beginHeatmap(path,test,controller.signal,setMessage)).then(fn=>{if(removed)fn();else cleanup=fn;}).catch(()=>{if(!removed)setMessage("تعذر بدء قياس التفاعل");});
 const id=window.setTimeout(run,100);return ()=>{removed=true;clearTimeout(id);cleanup?.();controller.abort();};
 },[enabled,consent,path,test]);
 function choose(value:string){try{localStorage.setItem(choiceKey,value);}catch{}setConsent(value);setOpen(false);}
 if(!enabled)return null;
 return <aside data-heatmap-control className={`hm-consent ${open?"hm-consent-open":""}`} aria-label="إعدادات قياس التفاعل" dir="rtl">{test?<span role="status">{message||"وضع اختبار الخرائط — منفصل عن بيانات الزوار"}</span>:open?<><strong>هل تسمح بقياس التفاعل؟</strong><p>نجمع مواضع النقر والتمرير بشكل مجمّع لتحسين الشرح. لا نسجل محتوى النماذج أو فيديو الجلسة. الاختيار اختياري ويمكن تغييره هنا.</p><a href="/privacy">سياسة الخصوصية</a><div><button onClick={()=>choose("yes")}>السماح بقياس التفاعل</button><button onClick={()=>choose("no")}>عدم السماح</button></div></>:<button onClick={()=>setOpen(true)}>إعدادات قياس التفاعل</button>}</aside>;
}
