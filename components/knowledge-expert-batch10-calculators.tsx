"use client";
import {useState} from "react";
const shell={padding:18,marginTop:18,background:"#fff",border:"1px solid #d3e1ea",borderRadius:12} as const;
const field={width:"100%",border:"1px solid #a5b6c2",borderRadius:8,padding:9,background:"white"} as const;
export function ConditionalProbabilityCalculator(){
 const [joint,setJoint]=useState("0.2"),[condition,setCondition]=useState("0.4");
 const a=Number(joint),b=Number(condition);
 const valid=joint.trim()!==""&&condition.trim()!==""&&Number.isFinite(a)&&Number.isFinite(b)&&b>0&&b<=1&&a>=0&&a<=b;
 return <section style={shell} aria-labelledby="conditional-calculator-h">
 <h3 id="conditional-calculator-h" style={{fontSize:21,fontWeight:750}}>حاسبة الاحتمال المشروط P(A|B)</h3>
 <p>أدخل احتمال التقاطع والشرط كقيم بين 0 و1. هذه حاسبة رياضية وليست أداة استنتاج احتمالات من حالات واقعية دون بيانات.</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginTop:12}}>
 <label style={{display:"grid",gap:5}}>P(A∩B)<input type="number" min="0" max="1" step="0.01" style={field} value={joint} onChange={e=>setJoint(e.target.value)}/></label>
 <label style={{display:"grid",gap:5}}>P(B)<input type="number" min="0.01" max="1" step="0.01" style={field} value={condition} onChange={e=>setCondition(e.target.value)}/></label></div>
 <output aria-live="polite" style={{display:"block",marginTop:12,fontWeight:700}}>{valid?"P(A|B) = "+(a/b).toFixed(4)+" = "+(a/b*100).toFixed(2)+"%":"تأكد أن P(B)>0 وأن 0 ≤ P(A∩B) ≤ P(B) ≤ 1."}</output>
 <p style={{fontSize:13,color:"#526575",marginTop:10}}>النتيجة لا تثبت السببية أو الاستقلال. الأرقام الابتدائية افتراضية.</p></section>;
}
export function PopulationChangeCalculator(){
 const [base,setBase]=useState("100000"),[births,setBirths]=useState("2500"),[deaths,setDeaths]=useState("900"),[arrivals,setArrivals]=useState("300"),[departures,setDepartures]=useState("400");
 const fields=[["السكان في البداية",base,setBase],["المواليد",births,setBirths],["الوفيات",deaths,setDeaths],["الوافدون",arrivals,setArrivals],["المغادرون",departures,setDepartures]] as const;
 const nums=fields.map(([,value])=>Number(value));
 const valid=fields.every(([,v])=>v.trim()!=="")&&nums.every(n=>Number.isFinite(n)&&Number.isInteger(n)&&n>=0&&n<=1e9);
 const change=nums[1]-nums[2]+nums[3]-nums[4],end=nums[0]+change;
 const result="صافي التغير: "+change.toLocaleString("ar")+"؛ السكان النهائيون: "+end.toLocaleString("ar")+(nums[0]>0?"؛ معدل التغير التقريبي "+(change/nums[0]*100).toFixed(2)+"%":"");
 return <section style={shell} aria-labelledby="population-calc-h"><h3 id="population-calc-h" style={{fontSize:21,fontWeight:750}}>حاسبة التغير السكاني</h3><p>المثال افتراضي، وليس تعدادًا رسميًا. أدخل أعدادًا صحيحة من الفترة السكانية نفسها.</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:9,marginTop:12}}>{fields.map(([label,value,set])=><label key={label} style={{display:"grid",gap:5,fontSize:14}}>{label}<input type="number" min="0" max="1000000000" step="1" value={value} onChange={e=>set(e.target.value)} style={field}/></label>)}</div>
 <output aria-live="polite" style={{display:"block",fontWeight:700,marginTop:14}}>{valid&&end>=0?result:"أدخل أعدادًا صحيحة غير سالبة مع مجموع سكاني نهائي غير سالب."}</output><p style={{fontSize:13,color:"#526575",marginTop:10}}>هذه حاسبة تغير فترة واحدة وليست نموذج توقعات ديموغرافية.</p></section>;
}
export function TrainingGapCalculator(){
 const [wanted,setWanted]=useState("4"),[actual,setActual]=useState("2");
 const w=Number(wanted),a=Number(actual),valid=Number.isInteger(w)&&Number.isInteger(a)&&w>=1&&w<=4&&a>=1&&a<=4;
 return <section style={shell} aria-labelledby="training-gap-h"><h3 id="training-gap-h" style={{fontSize:21,fontWeight:750}}>مقارنة مستويات المهارة</h3><p>مقياس افتراضي من 1 إلى 4؛ يجب تعريف المهارة والمستويات قبل استخدامه في قرارات مهنية.</p>
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:10}}>
 <label>المطلوب<select value={wanted} onChange={e=>setWanted(e.target.value)} style={field}>{[1,2,3,4].map(n=><option value={n} key={n}>{n}</option>)}</select></label>
 <label>الحالي<select value={actual} onChange={e=>setActual(e.target.value)} style={field}>{[1,2,3,4].map(n=><option value={n} key={n}>{n}</option>)}</select></label></div>
 <output aria-live="polite" style={{display:"block",fontWeight:700,marginTop:12}}>{valid?"الفجوة الرقمية في هذا المثال: "+Math.max(0,w-a):"قيم غير صالحة"}</output><p style={{fontSize:13,color:"#526575",marginTop:10}}>لا يثبت الفرق أن الحل هو التدريب؛ قد تكون المشكلة في المعدات أو الإجراء.</p></section>;
}
