"use client";
import {useState} from "react";
import {text,stageLabels,type OpsRecord} from "@/lib/content-ops/model";

const dayKey=(value:string)=>Number.isFinite(Date.parse(value))?new Date(Date.parse(value)+3*3600000).toISOString().slice(0,10):"";
export function PlanningTable({items,onOpen}:{items:OpsRecord[];onOpen:(item:OpsRecord)=>void}){
 return <div className="ops-table"><table><thead><tr><th>العنصر</th><th>النوع</th><th>المرحلة</th><th>الموعد في قطر</th><th>التعطيل</th></tr></thead><tbody>{items.map(item=><tr key={item.id}><td><button onClick={()=>onOpen(item)}>{text(item.data.title)}</button></td><td>{text(item.data.kind)}</td><td>{stageLabels[text(item.data.stage)]}</td><td>{text(item.data.dueAt)?new Date(text(item.data.dueAt)).toLocaleString("ar-EG",{timeZone:"Asia/Qatar"}):"غير محدد"}</td><td>{text(item.data.blockedReason)||"—"}</td></tr>)}</tbody></table>{!items.length&&<p>لا توجد نتائج ضمن التصفية.</p>}</div>;
}
export function PlanningCalendar({items,asOf,onOpen}:{items:OpsRecord[];asOf:string;onOpen:(item:OpsRecord)=>void}){
 const [anchor,setAnchor]=useState(()=>dayKey(asOf)),[mode,setMode]=useState("month");
 const date=new Date(`${anchor}T00:00:00Z`);const start=new Date(date);
 if(mode==="month")start.setUTCDate(1);else start.setUTCDate(start.getUTCDate()-((start.getUTCDay()+1)%7));
 const count=mode==="month"?new Date(Date.UTC(start.getUTCFullYear(),start.getUTCMonth()+1,0)).getUTCDate():7;
 const days=Array.from({length:count},(_,i)=>{const d=new Date(start);d.setUTCDate(start.getUTCDate()+i);return d.toISOString().slice(0,10);});
 function move(direction:number){const d=new Date(date);if(mode==="month"){d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+direction);}else d.setUTCDate(d.getUTCDate()+direction*7);setAnchor(d.toISOString().slice(0,10));}
 return <section><div className="ops-actions"><label>الفترة<select value={mode} onChange={e=>setMode(e.target.value)}><option value="month">شهر</option><option value="week">أسبوع</option></select></label><label>التاريخ<input type="date" value={anchor} required onChange={e=>{if(e.target.value)setAnchor(e.target.value);}}/></label><button onClick={()=>move(-1)}>السابق</button><button onClick={()=>move(1)}>التالي</button></div><p>مواعيد الإنتاج المسجلة بتوقيت قطر. هذه المواعيد لا تنشر المقال تلقائيًا.</p><div className="ops-calendar">{days.map(day=><article key={day}><h3>{new Date(`${day}T12:00:00Z`).toLocaleDateString("ar-EG",{weekday:"short",day:"numeric",month:"short",timeZone:"Asia/Qatar"})}</h3>{items.filter(item=>dayKey(text(item.data.dueAt))===day).map(item=><button key={item.id} onClick={()=>onOpen(item)}>{text(item.data.title)} · {stageLabels[text(item.data.stage)]}</button>)}</article>)}</div><p>عناصر بدون موعد: {items.filter(item=>!dayKey(text(item.data.dueAt))).length}</p></section>;
}
