"use client";
import { useMemo,useState } from "react";
export function ObjectiveBuilder(){
const [audience,setAudience]=useState("الطالب");
const [verb,setVerb]=useState("يقارن");
const [topic,setTopic]=useState("بين كسرين لهما المقام نفسه");
const [criterion,setCriterion]=useState("بإجابة صحيحة في 4 مسائل من أصل 5");
const result=useMemo(()=>["بنهاية الدرس،",audience.trim(),verb.trim(),topic.trim(),criterion.trim()].filter(Boolean).join(" ")+"." ,[audience,verb,topic,criterion]);
return <section id="objective-builder" aria-labelledby="builder-title" style={{margin:"30px 0",padding:22,border:"1px solid #dbe5ed",borderRadius:14,background:"#f7fafc"}}>
<h2 id="builder-title" style={{fontSize:24,fontWeight:700,marginBottom:12}}>مساعد صياغة هدف تعليمي قابل للقياس</h2><p>هذه أداة صياغة للتعلم، وليست حكمًا آليًا على جودة الهدف. استبدل الكلمات المثال، ثم راجع الناتج.</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginTop:16}}>
{[{label:"المتعلم",value:audience,onChange:setAudience},{label:"فعل قابل للملاحظة",value:verb,onChange:setVerb},{label:"المحتوى أو المهارة",value:topic,onChange:setTopic},{label:"معيار النجاح",value:criterion,onChange:setCriterion}].map(item=><label key={item.label} style={{display:"grid",gap:6,fontSize:14,fontWeight:600}}>{item.label}<input value={item.value} onChange={e=>item.onChange(e.target.value)} maxLength={150} style={{padding:"10px 12px",border:"1px solid #cbd5e1",borderRadius:9,background:"#fff"}}/></label>)}
</div><output aria-live="polite" style={{display:"block",marginTop:15,padding:15,background:"#fff",borderRadius:9,wordBreak:"break-word"}}>{result}</output>
</section>;
}
