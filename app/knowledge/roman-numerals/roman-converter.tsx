"use client";
import { useMemo, useState } from "react";

const pairs: Array<[number,string]> = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
export function numberToRoman(n:number):string {
  if (!Number.isInteger(n)||n<1||n>3999) throw new RangeError("العدد يجب أن يكون صحيحًا بين 1 و3999");
  let remainder=n, result="";
  for (const [value, symbol] of pairs) { while(remainder>=value){result+=symbol;remainder-=value;} }
  return result;
}
export function romanToNumber(value:string):number|null {
  const input=value.trim().toUpperCase();
  if(!/^[IVXLCDM]+$/.test(input))return null;
  let total=0;
  for(let i=0;i<input.length;i++){
    const current=pairs.find(p=>p[1]===input[i])?.[0];
    const next=pairs.find(p=>p[1]===input[i+1])?.[0]??0;
    if(!current) return null;
    total+=current<next?-current:current;
  }
  return total>=1&&total<=3999&&numberToRoman(total)===input?total:null;
}
export function RomanConverter(){
  const [arabic,setArabic]=useState("49");
  const [roman,setRoman]=useState("XLIX");
  const toRoman=useMemo(()=>{
    const digits=arabic.replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776));
    const n=Number(digits);
    return digits.trim()!==""&&/^\d+$/.test(digits)&&n>=1&&n<=3999?numberToRoman(n):null;
  },[arabic]);
  const fromRoman=useMemo(()=>romanToNumber(roman),[roman]);
  return <section id="calculator" aria-labelledby="calc-title" style={{padding:"24px",border:"1px solid #dbe5ed",borderRadius:16,background:"#f7fafc",margin:"28px 0"}}>
    <h2 id="calc-title" style={{fontSize:23,fontWeight:700,marginBottom:8}}>محول الأرقام الرومانية التفاعلي</h2>
    <p style={{marginBottom:16}}>أدخل عددًا من 1 إلى 3999، أو رقمًا رومانيًا بصيغته القياسية الحديثة. يعمل المحول داخل المتصفح ولا يرسل أرقامك إلى خادم.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
      <label style={{display:"grid",gap:8}}>من الأرقام العادية<input inputMode="numeric" value={arabic} onChange={e=>setArabic(e.target.value)} style={{border:"1px solid #cbd5e1",borderRadius:10,padding:10}} /><output aria-live="polite">{toRoman??"أدخل عددًا صحيحًا من 1 إلى 3999"}</output></label>
      <label style={{display:"grid",gap:8}}>من الأرقام الرومانية<input dir="ltr" value={roman} onChange={e=>setRoman(e.target.value)} style={{border:"1px solid #cbd5e1",borderRadius:10,padding:10}} /><output aria-live="polite">{fromRoman??"الرمز غير قياسي أو خارج النطاق"}</output></label>
    </div>
  </section>;
}
