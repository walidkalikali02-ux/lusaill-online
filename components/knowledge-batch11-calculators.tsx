"use client";
import {useState} from "react";
const panel={padding:17,marginTop:17,border:"1px solid #cbdde4",borderRadius:12,background:"#fff"} as const;
const entry={width:"100%",border:"1px solid #9aafbd",borderRadius:8,padding:"9px 12px"} as const;
export function DivisionCheck(){
 const [dividend,setDividend]=useState("965"),[divisor,setDivisor]=useState("8");
 const a=Number(dividend),b=Number(divisor),valid=dividend.trim()!==""&&divisor.trim()!==""&&Number.isSafeInteger(a)&&Number.isSafeInteger(b)&&a>=0&&b>0&&a<=1000000000&&b<=1000000000;
 const quotient=valid?Math.floor(a/b):0,rest=valid?a%b:0;
 return <section style={panel} aria-label="حاسبة التحقق من القسمة المطولة"><h3 style={{fontSize:20,fontWeight:750}}>تحقق من القسمة الصحيحة والباقي</h3>
 <p>بعد حل المسألة يدويًا، أدخل المقسوم والمقسوم عليه للتحقق من الخارج والباقي. هذه الأداة لأعداد صحيحة غير سالبة فقط.</p>
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
 <label style={{display:"grid",gap:5}}>المقسوم<input type="number" min={0} step={1} style={entry} value={dividend} onChange={e=>setDividend(e.target.value)}/></label>
 <label style={{display:"grid",gap:5}}>المقسوم عليه<input type="number" min={1} step={1} style={entry} value={divisor} onChange={e=>setDivisor(e.target.value)}/></label></div>
 <output aria-live="polite" style={{display:"block",fontWeight:750,marginTop:12}}>{valid?"خارج القسمة = "+quotient+"، الباقي = "+rest+"؛ التحقق: "+b+" × "+quotient+" + "+rest+" = "+a:"أدخل أعدادًا صحيحة غير سالبة، ومقسومًا عليه أكبر من صفر."}</output></section>;
}
export function WaterSavingCalculator(){
 const [flow,setFlow]=useState("6"),[minutes,setMinutes]=useState("4"),[days,setDays]=useState("30");
 const f=Number(flow),m=Number(minutes),d=Number(days),valid=[flow,minutes,days].every(x=>x.trim()!=="")&&[f,m,d].every(Number.isFinite)&&f>=0&&f<=200&&m>=0&&m<=1440&&Number.isInteger(d)&&d>=1&&d<=366;
 const daily=f*m,total=daily*d;
 return <section style={panel} aria-label="حاسبة حجم هدر المياه"><h3 style={{fontSize:20,fontWeight:750}}>حاسبة حجم الماء في مثال التدفق</h3>
 <p>أدخل معدل تدفق مقاسًا (لتر/دقيقة) وزمنًا لا يلزم فيه فتح الصنبور وعدد أيام. القيم الابتدائية مثال افتراضي وليست قياسًا لمنزل.</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginTop:12}}>
 <label>لتر/دقيقة<input type="number" min={0} step="any" style={entry} value={flow} onChange={e=>setFlow(e.target.value)}/></label>
 <label>الدقائق في اليوم<input type="number" min={0} step="any" style={entry} value={minutes} onChange={e=>setMinutes(e.target.value)}/></label>
 <label>عدد الأيام<input type="number" min={1} step={1} style={entry} value={days} onChange={e=>setDays(e.target.value)}/></label></div>
 <output aria-live="polite" style={{display:"block",fontWeight:750,marginTop:12}}>{valid?"التقدير اليومي: "+daily.toFixed(1)+" لتر؛ خلال الفترة: "+total.toFixed(1)+" لتر = "+(total/1000).toFixed(3)+" م³":"راجع المعدل والدقائق والأيام؛ ينبغي أن تكون القيم غير سالبة ضمن نطاق مناسب."}</output>
 <p style={{fontSize:13,color:"#526575",marginTop:10}}>التوفير الحقيقي يعتمد على التدفق والمدة المقاسين، ولا يشمل الماء الضروري للنظافة.</p></section>;
}
export function InductionSumCheck(){
 const [n,setN]=useState(5);const left=n*(n+1)/2;const odd=n*n;
 return <section style={panel} aria-label="أمثلة للتحقق من صيغ الاستقراء">
 <h3 style={{fontSize:20,fontWeight:750}}>تجربة عددية لتعلّم الاستقراء</h3>
 <p>تغيير n يوضح صيغتين صحيحتين في أمثلة محدودة؛ لكنه ليس برهانًا لكل الأعداد الطبيعية، فالبرهان يتطلب الأساس وخطوة الانتقال.</p>
 <label style={{display:"grid",gap:8,marginTop:12}}>اختر n = {n}<input type="range" min={1} max={30} value={n} onChange={e=>setN(Number(e.target.value))}/></label>
 <output aria-live="polite" style={{display:"grid",gap:8,marginTop:12}}>
 <strong>1 + 2 + ... + {n} = {left} = {n} × ({n}+1) ÷ 2</strong>
 <strong>1 + 3 + ... + (2×{n}−1) = {odd} = {n}²</strong>
 </output></section>;
}
