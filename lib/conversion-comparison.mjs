export function parseCount(value){
 if(typeof value!=='string')return null;
 const clean=value.trim().replace(/[٠-٩]/g,d=>String(d.charCodeAt(0)-1632)).replace(/[۰-۹]/g,d=>String(d.charCodeAt(0)-1776));
 if(!/^[0-9]{1,20}$/.test(clean))return null;
 const n=Number(clean);return Number.isSafeInteger(n)&&n>=0&&n<=1e9?n:null;
}
export function compareConversions(nA,xA,nB,xB){
 const v=[nA,xA,nB,xB].map(parseCount);
 if(v.some(n=>n===null))return {error:'اكتب أعدادًا صحيحة من 0 إلى مليار، دون فواصل أو كسور.'};
 const [a,x,b,y]=v;
 if(a===0||b===0)return {error:'عدد الأشخاص في كل مجموعة يجب أن يكون أكبر من صفر.'};
 if(x>a||y>b)return {error:'عدد الأشخاص الذين حوّلوا لا يمكن أن يتجاوز عدد أفراد مجموعتهم.'};
 const rateA=x/a,rateB=y/b;
 return {rateA:rateA*100,rateB:rateB*100,difference:(rateB-rateA)*100,lift:rateA===0?null:(rateB-rateA)/rateA*100};
}
