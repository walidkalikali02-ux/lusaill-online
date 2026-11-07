"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import type { BranchId, LabInput, LabResult } from "@/lib/reality-lab/model";
import { DEFAULT_LAB_INPUT } from "@/lib/reality-lab/model";
import "./dashboard.css";

type Tab="overview"|"experiments"|"data"|"history";
type RunRecord={id:string;at:string;label:string;input:LabInput;served:number;revenue:number;lost:number};
type Calibration={orders:Partial<Record<BranchId,number>>;rows:number;days:number;name:string};
type ApiResponse={result?:LabResult;run?:{elapsedMs:number;executedAt:string;modelVersion:string};error?:string};
const BRANCH_OPTIONS:{id:BranchId;name:string}[]=[
  {id:"muaither",name:"المعيذر"},{id:"mesaimeer",name:"وَقود مسيمير"},
  {id:"hilal",name:"الهلال / المنتزه"},{id:"alkhor",name:"الخور"},
  {id:"rawdat",name:"وَقود روضة الحمامة"}
];
const NAV:{id:Tab;title:string;icon:string;sub:string}[]=[
  {id:"overview",title:"لوحة المتابعة",icon:"▦",sub:"Overview"},
  {id:"experiments",title:"مختبر السيناريوهات",icon:"◈",sub:"Simulations"},
  {id:"data",title:"مركز البيانات",icon:"▤",sub:"Data Sources"},
  {id:"history",title:"سجل التشغيل",icon:"◷",sub:"Run History"}
];
const fmt=(n:number,digits=0)=>n.toLocaleString("en-US",{maximumFractionDigits:digits,minimumFractionDigits:digits});
const signed=(value:number,unit="")=>(value>0?"+":"")+fmt(value,1)+unit;
const defaultInputs:LabInput={...DEFAULT_LAB_INPUT};

function exportFile(content:string,name:string,type:string){
  const blob=new Blob([content],{type});
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();
  URL.revokeObjectURL(url);
}
function TinyIcon({name}:{name:string}){
  if(name==="factory")return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V9l6 3V9l6 3V4h6v17H3Z"/><path d="M7 17h2m3 0h2m3 0h2"/></svg>;
  if(name==="activity")return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12h4l3-7 5 14 3-7h5"/></svg>;
  if(name==="box")return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 7 9-4 9 4v10l-9 4-9-4V7Zm0 0 9 5 9-5M12 12v9"/></svg>;
  if(name==="chart")return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5m0 14h16M8 15l4-5 3 3 5-7"/></svg>;
  if(name==="arrow")return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 12 5 5 7-10"/></svg>;
  return <span aria-hidden="true">◈</span>;
}
function Metric({title,value,unit,detail,trend,icon}:{title:string;value:string;unit?:string;detail:string;trend?:string;icon:string}){
  return <div className="rl-metric">
    <div className="rl-metric-top"><span>{title}</span><span className="rl-metric-icon"><TinyIcon name={icon}/></span></div>
    <div className="rl-metric-value">{value}<small>{unit}</small></div>
    <div className="rl-metric-bottom"><span>{detail}</span>{trend&&<b>{trend}</b>}</div>
  </div>;
}
function LineChart({data}:{data:LabResult["daily"]}){
  const max=Math.max(1,...data.map(d=>d.requested))*1.16;
  const x=(i:number)=>54+(i/Math.max(1,data.length-1))*714;
  const y=(v:number)=>229-(v/max)*196;
  const line=(field:"served"|"requested")=>data.map((d,i)=>fmt(x(i),2)+","+fmt(y(d[field]),2)).join(" ");
  const area="54,229 "+line("served")+" 768,229";
  const ticks=[0,.25,.5,.75,1];
  return <div className="rl-chart-holder"><svg viewBox="0 0 790 276" role="img" aria-label="مخطط الطلبات المستلمة والمنفذة يوميًا داخل النموذج">
    <defs><linearGradient id="rlChartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#18a999" stopOpacity=".17"/><stop offset="1" stopColor="#18a999" stopOpacity="0"/></linearGradient></defs>
    {ticks.map(t=><g key={t}><line x1="54" x2="768" y1={y(t*max)} y2={y(t*max)} stroke="#e7ecef" strokeDasharray="4 6"/><text x="47" y={y(t*max)+4} fontSize="11" textAnchor="end" fill="#8794a0">{fmt(t*max)}</text></g>)}
    <polygon points={area} fill="url(#rlChartFill)"/>
    <polyline points={line("requested")} fill="none" stroke="#a4b1c1" strokeWidth="2.3" strokeDasharray="7 6" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points={line("served")} fill="none" stroke="#13a493" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    {data.map((d,i)=><g key={d.day}><circle cx={x(i)} cy={y(d.served)} r="3.2" fill="#13a493"/>{(i%Math.max(1,Math.ceil(data.length/7))===0||i===data.length-1)&&<text x={x(i)} y="255" textAnchor="middle" fontSize="11" fill="#8794a0">{d.day}</text>}</g>)}
  </svg></div>;
}
function SectionHeading({title,subtitle,children}:{title:string;subtitle:string;children?:ReactNode}){
  return <div className="rl-section-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><div className="rl-section-actions">{children}</div></div>;
}
function BranchTable({data}:{data:LabResult["branches"]}){
  return <div className="rl-table-scroll"><table className="rl-table">
    <thead><tr><th>الفرع</th><th>طلبات منفذة</th><th>فاقد بسبب البن</th><th>انتظار P90</th><th>المبيعات الافتراضية</th><th>مخزون نهائي</th></tr></thead>
    <tbody>{data.map((b,i)=><tr key={b.id}><td><span className={"rl-avatar rl-avatar-"+i}>{b.name.slice(0,1)}</span><strong>{b.name}</strong></td><td>{fmt(b.served)}</td><td><span className={b.lostStock>40?"rl-cell-warning":""}>{fmt(b.lostStock)}</span></td><td>{fmt(b.p90WaitMinutes,1)} د</td><td>{fmt(b.revenueQar)} ر.ق</td><td>{fmt(b.endingStockKg,2)} كجم</td></tr>)}</tbody>
  </table></div>;
}
function parseAggregatedCsv(text:string,fileName:string):Calibration{
  const lines=text.replace(/^\uFEFF/,"").trim().split(/\r?\n/);
  if(lines.length<2||lines.length>10001)throw new Error("CSV يجب أن يتضمن رأس الجدول وصفوف بيانات بحد أقصى 10,000 صف");
  const head=lines[0].split(",").map(s=>s.trim().toLowerCase());
  const columns=["date","branch","orders"];
  for(const c of columns)if(!head.includes(c))throw new Error("أعمدة CSV المطلوبة: date,branch,orders");
  const idx=columns.map(c=>head.indexOf(c));
  const totals=new Map<BranchId,number>(),dates=new Set<string>();
  for(let i=1;i<lines.length;i++){
    if(!lines[i].trim())continue;
    const row=lines[i].split(",").map(s=>s.trim());
    const date=row[idx[0]],branch=row[idx[1]],orders=Number(row[idx[2]]);
    const match=BRANCH_OPTIONS.find(b=>b.id===branch||b.name===branch);
    if(!match||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isInteger(orders)||orders<0||orders>500)throw new Error("صف CSV غير صالح عند السطر "+(i+1));
    dates.add(date);totals.set(match.id,(totals.get(match.id)??0)+orders);
  }
  if(!dates.size)throw new Error("الملف لا يحتوي على بيانات صالحة");
  const orders:Partial<Record<BranchId,number>>={};
  for(const [key,val] of totals.entries())orders[key]=Math.max(1,val/dates.size);
  return {orders,rows:lines.length-1,days:dates.size,name:fileName};
}
export default function RealityLabDashboard(){
  const [tab,setTab]=useState<Tab>("overview");
  const [inputs,setInputs]=useState<LabInput>(defaultInputs);
  const [result,setResult]=useState<LabResult|null>(null);
  const [baseline,setBaseline]=useState<LabResult|null>(null);
  const [runInfo,setRunInfo]=useState<{executedAt:string;elapsedMs:number}|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [history,setHistory]=useState<RunRecord[]>([]);
  const [calibration,setCalibration]=useState<Calibration|null>(null);
  const [applyCalibration,setApplyCalibration]=useState(false);
  const [scenario,setScenario]=useState("baseline");
  const activeInput=useMemo(()=>({...inputs,...(applyCalibration&&calibration?{branchOrdersPerDay:calibration.orders}:{branchOrdersPerDay:undefined})}),[inputs,calibration,applyCalibration]);
  async function run(requested:LabInput, label:string,initial=false){
    setBusy(true);setError("");
    try {
      const response=await fetch("/api/reality-lab/run",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(requested),cache:"no-store"});
      const data=await response.json() as ApiResponse;
      if(!response.ok||!data.result)throw new Error(data.error??"فشل استلام نتائج التشغيل");
      setResult(data.result);
      if(initial)setBaseline(data.result);
      setRunInfo({executedAt:data.run?.executedAt??new Date().toISOString(),elapsedMs:data.run?.elapsedMs??0});
      const record:RunRecord={id:String(Date.now()),at:new Date().toISOString(),label,input:requested,served:data.result.summary.served,revenue:data.result.summary.revenueQar,lost:data.result.summary.lostStock+data.result.summary.lostQueue};
      setHistory(previous=>{
        const next=[record,...previous].slice(0,20);
        try{localStorage.setItem("lusaill-reality-lab-history-v1",JSON.stringify(next));}catch{}
        return next;
      });
    }catch(e){setError(e instanceof Error?e.message:"حدث خطأ في تشغيل المحاكاة");}
    finally{setBusy(false);}
  }
  useEffect(()=>{
    try{
      const saved=JSON.parse(localStorage.getItem("lusaill-reality-lab-history-v1")??"[]") as RunRecord[];
      if(Array.isArray(saved))setHistory(saved.slice(0,20));
    }catch{}
    void run(defaultInputs,"السيناريو الأساسي",true);
  },[]);
  function choosePreset(preset:string){
    setScenario(preset);
    const defaults={...DEFAULT_LAB_INPUT};
    const choices:Record<string,Partial<LabInput>>={
      baseline:{},delivery:{deliveryDays:3},roaster:{roastCapacityKg:7},
      demand:{demandFactor:1.3},barista:{extraAlKhorBaristas:1}
    };
    setInputs({...defaults,...(choices[preset]??{})});
  }
  async function importCsv(event:ChangeEvent<HTMLInputElement>){
    const file=event.target.files?.[0];if(!file)return;
    try{
      if(file.size>1024*1024)throw new Error("الحد الأقصى للملف 1 ميجابايت");
      setCalibration(parseAggregatedCsv(await file.text(),file.name));
      setApplyCalibration(true);setError("");setTab("data");
    }catch(e){setError(e instanceof Error?e.message:"تعذر قراءة الملف");}
    event.target.value="";
  }
  const s=result?.summary;
  const compare=baseline&&result?{
    revenue:result.summary.revenueQar-baseline.summary.revenueQar,
    lost:result.summary.lostStock-baseline.summary.lostStock,
    waits:result.summary.meanWaitMinutes-baseline.summary.meanWaitMinutes
  }:null;
  return <div dir="rtl" className="rl-root">
    <aside className="rl-sidebar">
      <div className="rl-brand"><div className="rl-brand-mark">ل</div><div><strong>لوسيل</strong><small>REALITY LAB</small></div></div>
      <div className="rl-workspace"><div className="rl-workspace-icon"><TinyIcon name="factory"/></div><div><strong>المحمصة والفروع</strong><span>المشروع البحثي 001</span></div><span className="rl-chevron">⌄</span></div>
      <div className="rl-side-label">مساحة العمل</div>
      <nav aria-label="لوحة تنقل المختبر" className="rl-nav">{NAV.map(n=><button key={n.id} type="button" className={tab===n.id?"is-active":""} onClick={()=>setTab(n.id)}><span className="rl-nav-icon">{n.icon}</span><span>{n.title}<small>{n.sub}</small></span></button>)}</nav>
      <div className="rl-sidebar-bottom"><div className="rl-online"><span/> محرك المحاكاة جاهز</div><p>البيانات الافتراضية لا تمثل الأداء الحقيقي. لا تُدخل بيانات عملاء شخصية.</p><a href="/" className="rl-backlink">العودة إلى موسوعة لوسيل ↗</a></div>
    </aside>
    <div className="rl-main">
      <header className="rl-topbar"><div className="rl-breadcrumb">مختبر لوسيل <span>/</span> محمصة الدوحة <span>/</span> {NAV.find(n=>n.id===tab)?.title}</div><div className="rl-top-actions"><span className="rl-provenance">◉ {result?.provenance==="partially_calibrated"?"طلب مُعاير جزئيًا":"بيانات تجريبية"}</span><span className="rl-version">v0.3</span></div></header>
      <main className="rl-content">
        <div className="rl-hero"><div><div className="rl-eyebrow"><span/> مختبر هندسة الواقع • COFFEE-001</div><h1>{tab==="overview"?"نظرة شاملة على منظومة القهوة":tab==="experiments"?"مختبر السيناريوهات والتجارب":tab==="data"?"مصادر البيانات والمعايرة":"سجل تجارب المحاكاة"}</h1><p>نموذج مترابط للمحمصة وخمسة فروع، من التحميص والمخزون حتى الطلبات والخدمة. جميع النتائج تجريبية ما لم يُذكر خلاف ذلك.</p></div><button className="rl-primary" disabled={busy} onClick={()=>void run(activeInput,scenario==="baseline"?"السيناريو الأساسي":"سيناريو "+scenario)}>{busy?"جارٍ تشغيل المحاكاة...":"▶ تشغيل المحاكاة"}</button></div>
        {error&&<div className="rl-error" role="alert">{error}</div>}
        <div className="rl-statusbar"><span className="rl-statusdot"/><b>{busy?"المحاكاة قيد المعالجة":result?"آخر تشغيل مكتمل":"جاهز للتشغيل"}</b><span className="rl-status-divider"/><span>الفترة: {inputs.days} يومًا</span><span className="rl-status-divider"/><span>{inputs.repetitions} تكرارًا احتماليًا</span><span className="rl-status-spacer"/><span>{runInfo?"آخر تشغيل: "+new Date(runInfo.executedAt).toLocaleString("ar-QA"):"لم تُشغّل تجربة بعد"}</span></div>
        {tab==="overview"&&<>
          <div className="rl-metrics">
            <Metric title="إيراد المبيعات" value={s?fmt(s.revenueQar):"—"} unit="ر.ق" detail="متوسط التجارب الافتراضية" trend={compare&&Math.abs(compare.revenue)>.01?signed(compare.revenue):undefined} icon="chart"/>
            <Metric title="الطلبات المنفّذة" value={s?fmt(s.served):"—"} detail="إجمالي النموذج خلال الفترة" icon="box"/>
            <Metric title="نسبة تلبية الطلب" value={s?fmt(s.serviceRate,1):"—"} unit="%" detail="من الطلبات الواصلة" icon="arrow"/>
            <Metric title="فقدان الطلبات" value={s?fmt(s.lostStock+s.lostQueue):"—"} detail="نفاد البن + انتظار طويل" icon="activity"/>
          </div>
          <div className="rl-dashboard-grid"><section className="rl-panel rl-chart-panel"><SectionHeading title="حركة الطلبات عبر الأيام" subtitle="مقارنة الطلبات الواصلة بالطلبات المنفذة داخل المحاكاة"><div className="rl-legend"><span className="rl-dot-filled"/> منفذة <span className="rl-dot-dashed"/> واردة</div></SectionHeading>{result?<LineChart data={result.daily}/>:<div className="rl-placeholder">جارٍ إعداد الرسم البياني...</div>}</section>
          <section className="rl-panel rl-insights"><SectionHeading title="مؤشرات النظام" subtitle="عنق الزجاجة والمخزون والإمداد"/><div className="rl-insight"><div className="rl-insight-symbol">▧</div><div><span>بن محمص خلال الفترة</span><strong>{s?fmt(s.roastKg,1):"—"} <small>كجم</small></strong></div></div><div className="rl-insight"><div className="rl-insight-symbol">◷</div><div><span>متوسط الانتظار</span><strong>{s?fmt(s.meanWaitMinutes,1):"—"} <small>دقيقة</small></strong></div></div><div className="rl-insight"><div className="rl-insight-symbol">⌁</div><div><span>طلبات ضاعت بسبب نفاد البن</span><strong>{s?fmt(s.lostStock):"—"} <small>طلب</small></strong></div></div><div className="rl-range"><span>نطاق الإيراد P10–P90</span><strong>{s?fmt(s.p10RevenueQar):"—"} – {s?fmt(s.p90RevenueQar):"—"} ر.ق</strong><small>تباين محاكاة وليس نطاق ثقة لأداء الشركة</small></div></section></div>
          <section className="rl-panel"><SectionHeading title="متابعة أداء الفروع الخمسة" subtitle="متوسط المؤشرات خلال جميع تكرارات السيناريو"><button className="rl-light-btn" onClick={()=>{if(result)exportFile(JSON.stringify(result,null,2),"coffee-lab-results.json","application/json")}}>تصدير JSON ↓</button></SectionHeading>{result?<BranchTable data={result.branches}/>:<div className="rl-placeholder">لا توجد بيانات بعد</div>}</section>
          <div className="rl-note">هذه لوحة بحثية بمخرجات افتراضية. لا توجد مزامنة مباشرة مع POS أو مستودعات الشركة أو حساسات المحمصة. نتائج التوظيف والتكاليف لا تصبح توصيات عملية إلا بعد المعايرة والتحقق المستقل.</div>
        </>}
        {tab==="experiments"&&<div className="rl-experiment-grid"><section className="rl-panel"><SectionHeading title="تصميم التجربة" subtitle="عدّل المدخلات ثم شغّل النموذج للمقارنة بالوضع الأساسي"/>
          <label className="rl-label">السيناريو الجاهز<select value={scenario} onChange={e=>choosePreset(e.target.value)}><option value="baseline">السيناريو الأساسي</option><option value="delivery">تأخر التوزيع 3 أيام</option><option value="roaster">انخفاض القدرة الإنتاجية</option><option value="demand">ارتفاع الطلب 30%</option><option value="barista">باريستا إضافي في الخور</option></select></label>
          {([{key:"demandFactor",label:"معامل حجم الطلب",min:.3,max:1.8,step:.1,suffix:"×"},{key:"deliveryDays",label:"زمن التوزيع",min:1,max:7,step:1,suffix:" يوم"},{key:"roastCapacityKg",label:"قدرة التحميص اليومية",min:2,max:70,step:1,suffix:" كجم"},{key:"extraAlKhorBaristas",label:"باريستا إضافيون في الخور",min:0,max:4,step:1,suffix:""}] as const).map(item=><label className="rl-control" key={item.key}><span>{item.label}<b>{inputs[item.key]}{item.suffix}</b></span><input type="range" min={item.min} max={item.max} step={item.step} value={inputs[item.key]} onChange={e=>setInputs(old=>({...old,[item.key]:Number(e.target.value)}))}/></label>)}
          <div className="rl-inline-controls"><label>عدد الأيام<input type="number" min="1" max="21" value={inputs.days} onChange={e=>setInputs(v=>({...v,days:Number(e.target.value)}))}/></label><label>التكرارات<input type="number" min="1" max="48" value={inputs.repetitions} onChange={e=>setInputs(v=>({...v,repetitions:Number(e.target.value)}))}/></label></div>
          <button className="rl-primary rl-full" disabled={busy} onClick={()=>void run(activeInput,"تجربة "+scenario)}>{busy?"جارٍ الحساب":"تشغيل التجربة ومقارنة النتائج"}</button>
        </section><section className="rl-panel"><SectionHeading title="نتائج المقارنة" subtitle="الفرق بين السيناريو الحالي وأول تشغيل أساسي"/>{result&&baseline&&compare?<><div className="rl-comparison"><span>إيرادات المبيعات الافتراضية</span><strong className={compare.revenue>=0?"rl-positive":"rl-negative"}>{signed(compare.revenue," ر.ق")}</strong></div><div className="rl-comparison"><span>طلبات ضائعة بسبب نفاد البن</span><strong className={compare.lost<=0?"rl-positive":"rl-negative"}>{signed(compare.lost," طلب")}</strong></div><div className="rl-comparison"><span>متوسط زمن الانتظار</span><strong className={compare.waits<=0?"rl-positive":"rl-negative"}>{signed(compare.waits," د")}</strong></div><div className="rl-comparison"><span>مساهمة تشغيلية تقديرية</span><strong>{fmt(result.summary.contributionQar)} ر.ق</strong></div><h3 className="rl-minititle">توزيع التغير اليومي</h3><LineChart data={result.daily}/></>:<div className="rl-placeholder">شغّل التجربة لرؤية المقارنة</div>}<div className="rl-note">المقارنة لا تثبت علاقة سببية في الواقع؛ الاختبارات الميدانية ضرورية قبل اعتماد أي تدخل.</div></section></div>}
        {tab==="data"&&<div className="rl-experiment-grid"><section className="rl-panel"><SectionHeading title="استيراد بيانات تشغيل مجمعة" subtitle="ملف CSV من دون أسماء العملاء أو أرقام هواتفهم أو معلومات الدفع"/><div className="rl-upload"><div className="rl-upload-glyph">⇧</div><h3>استيراد متوسطات الطلب اليومية</h3><p>الأعمدة المطلوبة: date, branch, orders. الفرع يُكتب بمعرّفه الإنجليزي أو اسمه العربي. تتم قراءة الملف في متصفحك فقط.</p><label className="rl-light-btn" htmlFor="rl-file">اختيار ملف CSV</label><input id="rl-file" type="file" accept=".csv,text/csv" onChange={e=>void importCsv(e)}/></div><div className="rl-sample"><strong>نموذج ملف</strong><pre>date,branch,orders{"\n"}2026-11-01,alkhor,88{"\n"}2026-11-01,muaither,121{"\n"}2026-11-02,alkhor,94</pre><button className="rl-text-btn" onClick={()=>exportFile("date,branch,orders\n2026-11-01,alkhor,88\n2026-11-01,muaither,121\n2026-11-02,alkhor,94\n2026-11-02,muaither,125\n","coffee-daily-template.csv","text/csv;charset=utf-8")}>تحميل القالب CSV ↓</button></div></section>
          <section className="rl-panel"><SectionHeading title="حالة المعايرة" subtitle="ما يمكن قياسه وما لا تستطيع البيانات الحالية إثباته"/>{calibration?<><div className="rl-import-ok">✓ تم تحليل {calibration.rows} صفًا عبر {calibration.days} يومًا من {calibration.name}</div><label className="rl-check"><input type="checkbox" checked={applyCalibration} onChange={e=>setApplyCalibration(e.target.checked)}/> استخدم متوسط الطلب في تشغيل المحاكاة</label><div className="rl-table-scroll"><table className="rl-table"><thead><tr><th>الفرع</th><th>متوسط الطلب/يوم</th></tr></thead><tbody>{BRANCH_OPTIONS.map(b=><tr key={b.id}><td>{b.name}</td><td>{calibration.orders[b.id]===undefined?"لم يُستورد":fmt(calibration.orders[b.id]??0,1)}</td></tr>)}</tbody></table></div></>:<div className="rl-placeholder">لا توجد بيانات تشغيل مستوردة. المحاكاة الحالية تستخدم افتراضات توضيحية.</div>}<div className="rl-note">استيراد الطلبات لا يعاير مدد التحضير أو أعطال المحمصة أو دقة المخزون. لا توجد قاعدة بيانات أو مزامنة مستمرة في هذا الإصدار.</div></section></div>}
        {tab==="history"&&<section className="rl-panel"><SectionHeading title="سجل التشغيل المحلي" subtitle="يُحفظ داخل متصفحك فقط، وليس في قاعدة بيانات مشتركة"><button className="rl-light-btn" onClick={()=>{localStorage.removeItem("lusaill-reality-lab-history-v1");setHistory([])}}>مسح السجل</button></SectionHeading><div className="rl-table-scroll"><table className="rl-table"><thead><tr><th>التاريخ</th><th>التجربة</th><th>الطلبات المنفذة</th><th>الإيراد الافتراضي</th><th>الطلبات الضائعة</th><th>إجراء</th></tr></thead><tbody>{history.map(h=><tr key={h.id}><td>{new Date(h.at).toLocaleString("ar-QA")}</td><td>{h.label}</td><td>{fmt(h.served)}</td><td>{fmt(h.revenue)} ر.ق</td><td>{fmt(h.lost)}</td><td><button className="rl-text-btn" disabled={busy} onClick={()=>{setInputs(h.input);void run(h.input,h.label+" — إعادة تشغيل")}}>إعادة تشغيل ↗</button></td></tr>)}</tbody></table>{!history.length&&<div className="rl-placeholder">سجل التشغيل فارغ</div>}</div></section>}
        <footer className="rl-footer"><span>© لوسيل • مختبر المحاكاة</span><span>نسخة بحثية تجريبية — نتائج غير معايرة للتشغيل الفعلي</span></footer>
      </main>
    </div>
  </div>;
}
