/**
 * Lusaill Reality Lab: reproducible illustrative coupled roastery/cafe model.
 * Synthetic defaults are never company facts. No PII enters this engine.
 * This bounded server-side model is for hypothesis generation, not operational decisions.
 */
export type BranchId = "muaither" | "mesaimeer" | "hilal" | "alkhor" | "rawdat";
export type LabInput = {
  days: number;
  repetitions: number;
  seed: number;
  demandFactor: number;
  deliveryDays: number;
  roastCapacityKg: number;
  extraAlKhorBaristas: number;
  branchOrdersPerDay?: Partial<Record<BranchId, number>>;
};
export type LabBranch = {
  id: BranchId;
  name: string;
  served: number;
  lostStock: number;
  lostQueue: number;
  revenueQar: number;
  p90WaitMinutes: number;
  endingStockKg: number;
};
export type LabDay = {
  day: number;
  requested: number;
  served: number;
  lostStock: number;
  lostQueue: number;
  revenueQar: number;
  roastedKg: number;
  warehouseStockKg: number;
  branchStockKg: number;
};
export type LabResult = {
  input: LabInput;
  provenance: "synthetic" | "partially_calibrated";
  summary: {
    requested: number;
    served: number;
    serviceRate: number;
    lostStock: number;
    lostQueue: number;
    revenueQar: number;
    contributionQar: number;
    meanWaitMinutes: number;
    roastKg: number;
    p10RevenueQar: number;
    p90RevenueQar: number;
  };
  daily: LabDay[];
  branches: LabBranch[];
  limitations: string[];
};
const BEANS_PER_DRINK_KG=0.018;
const BRANCHES: {id:BranchId;name:string;demand:number;baristas:number;stock:number}[]=[
  {id:"muaither",name:"المعيذر",demand:130,baristas:2,stock:2.3},
  {id:"mesaimeer",name:"وَقود مسيمير",demand:105,baristas:2,stock:2.0},
  {id:"hilal",name:"الهلال / المنتزه",demand:115,baristas:2,stock:2.0},
  {id:"alkhor",name:"الخور",demand:90,baristas:1,stock:1.8},
  {id:"rawdat",name:"وَقود روضة الحمامة",demand:95,baristas:2,stock:1.9}
];
const HOUR_WEIGHTS=[0.7,1.0,1.5,1.8,1.1,0.9,0.8,1.0,1.4,1.8,1.3,0.7];
const WEIGHT_SUM=HOUR_WEIGHTS.reduce((a,b)=>a+b,0);
function seeded(seed:number) {
  let state=seed>>>0;
  return function () {
    state=(state+0x6D2B79F5)|0;
    let t=Math.imul(state^(state>>>15),1|state);
    t=(t+Math.imul(t^(t>>>7),61|t))^t;
    return ((t^(t>>>14))>>>0)/4294967296;
  };
}
function poisson(lambda:number,rand:()=>number):number {
  if(lambda>18) return poisson(lambda/2,rand)+poisson(lambda-lambda/2,rand);
  const threshold=Math.exp(-lambda);
  let n=0,p=1;
  do {n++;p*=Math.max(rand(),1e-12);} while(p>threshold);
  return n-1;
}
function serviceTime(rand:()=>number) {
  // Erlang-3 gives variance, unlike the constant-time capacity formula.
  return -(Math.log(Math.max(rand(),1e-10))+Math.log(Math.max(rand(),1e-10))+Math.log(Math.max(rand(),1e-10)))*1.45;
}
function quantile(values:number[],p:number) {
  if(!values.length)return 0;
  const a=[...values].sort((x,y)=>x-y),n=(a.length-1)*p;
  const k=Math.floor(n);
  return a[k]+(a[Math.min(k+1,a.length-1)]-a[k])*(n-k);
}
function sum(values:number[]) {return values.reduce((a,b)=>a+b,0);}
function valid(input:LabInput):LabInput {
  if(!input || typeof input!=="object") throw new Error("المدخلات غير صالحة");
  const n=(v:unknown,min:number,max:number,name:string)=>{
    if(typeof v!=="number"||!Number.isFinite(v)||v<min||v>max) throw new Error("قيمة غير صالحة: "+name);
    return v;
  };
  n(input.days,1,21,"days");n(input.repetitions,1,48,"repetitions");
  n(input.seed,0,2147483647,"seed"); n(input.demandFactor,0.3,1.8,"demandFactor");
  n(input.deliveryDays,1,7,"deliveryDays");n(input.roastCapacityKg,2,70,"roastCapacityKg");
  n(input.extraAlKhorBaristas,0,4,"extraAlKhorBaristas");
  if(!Number.isInteger(input.days)||!Number.isInteger(input.repetitions)||!Number.isInteger(input.seed)||!Number.isInteger(input.deliveryDays)||!Number.isInteger(input.extraAlKhorBaristas)) throw new Error("بعض القيم يجب أن تكون أعدادًا صحيحة");
  if(input.branchOrdersPerDay){
    for(const [key,value] of Object.entries(input.branchOrdersPerDay)){
      if(!BRANCHES.some(b=>b.id===key)) throw new Error("معرّف فرع غير معروف");
      n(value,1,500,key);
    }
  }
  return input;
}
type RawBranch={served:number;requested:number;lostStock:number;lostQueue:number;revenue:number;waits:number[];endStock:number};
type OneRun={daily:LabDay[];branches:Record<BranchId,RawBranch>;requested:number;served:number;lostStock:number;lostQueue:number;revenue:number;waits:number[];roastKg:number;contribution:number};
function one(input:LabInput,rep:number):OneRun {
  const rand=seeded((input.seed+rep*179426549)>>>0);
  const bins=Object.fromEntries(BRANCHES.map(b=>[b.id,{served:0,requested:0,lostStock:0,lostQueue:0,revenue:0,waits:[],endStock:0}])) as Record<BranchId,RawBranch>;
  const branchStock=Object.fromEntries(BRANCHES.map(b=>[b.id,b.stock])) as Record<BranchId,number>;
  const deliveries:{id:BranchId;due:number;kg:number}[]=[];
  let greenStock=160, warehouse=22, greenDeliveryDay=-1, roastedTotal=0;
  let requested=0,served=0,lostStock=0,lostQueue=0,revenue=0,allWaits:number[]=[],labor=0;
  const daily:LabDay[]=[];
  for(let day=0;day<input.days;day++){
    if(greenDeliveryDay===day){greenStock+=130;greenDeliveryDay=-1;}
    if(greenStock<60&&greenDeliveryDay<0) greenDeliveryDay=day+4;
    const roastGreen=Math.min(input.roastCapacityKg,greenStock,Math.max(0,(40-warehouse)/0.84));
    const roastYield=0.84+(rand()-0.5)*0.04;
    const produced=roastGreen*roastYield;
    greenStock-=roastGreen;warehouse+=produced;roastedTotal+=produced;
    let dRequested=0,dServed=0,dLostStock=0,dLostQueue=0,dRevenue=0;
    // Deliveries represent roasting-to-branch logistics delay.
    for(let i=deliveries.length-1;i>=0;i--){
      const x=deliveries[i];
      if(x.due<=day){branchStock[x.id]+=x.kg;deliveries.splice(i,1);}
    }
    for(const b of BRANCHES){
      const capacity=b.baristas+(b.id==="alkhor"?input.extraAlKhorBaristas:0);
      labor+=capacity*8*19; // hypothetical QAR/day labor input.
      const available=Array.from({length:capacity},()=>0);
      const arrivals:number[]=[];
      const base=input.branchOrdersPerDay?.[b.id]??b.demand;
      const dayFactor=day%7===5||day%7===6?1.10:1;
      for(let h=0;h<HOUR_WEIGHTS.length;h++){
        const count=poisson(base*input.demandFactor*dayFactor*HOUR_WEIGHTS[h]/WEIGHT_SUM,rand);
        for(let j=0;j<count;j++) arrivals.push(h*60+rand()*60);
      }
      arrivals.sort((a,b)=>a-b);
      for(const arrival of arrivals){
        requested++;dRequested++;bins[b.id].requested++;
        let idx=0;
        for(let i=1;i<available.length;i++)if(available[i]<available[idx])idx=i;
        const wait=Math.max(0,available[idx]-arrival);
        if(wait>16){lostQueue++;dLostQueue++;bins[b.id].lostQueue++;continue;}
        if(branchStock[b.id]<BEANS_PER_DRINK_KG){
          lostStock++;dLostStock++;bins[b.id].lostStock++;continue;
        }
        const processing=serviceTime(rand);
        available[idx]=Math.max(available[idx],arrival)+processing;
        branchStock[b.id]-=BEANS_PER_DRINK_KG;
        const ticket=[18,21,24][Math.floor(rand()*3)];
        served++;dServed++;revenue+=ticket;dRevenue+=ticket;
        bins[b.id].served++;bins[b.id].revenue+=ticket;
        bins[b.id].waits.push(wait);allWaits.push(wait);
      }
      bins[b.id].endStock=branchStock[b.id];
      const outstanding=sum(deliveries.filter(d=>d.id===b.id).map(d=>d.kg));
      if(branchStock[b.id]+outstanding<2.5){
        const quantity=Math.min(Math.max(0,5-(branchStock[b.id]+outstanding)),warehouse);
        if(quantity>0){warehouse-=quantity;deliveries.push({id:b.id,due:day+input.deliveryDays,kg:quantity});}
      }
    }
    daily.push({day:day+1,requested:dRequested,served:dServed,lostStock:dLostStock,lostQueue:dLostQueue,revenueQar:dRevenue,roastedKg:produced,warehouseStockKg:warehouse,branchStockKg:sum(Object.values(branchStock))});
  }
  const coffeeCost=served*BEANS_PER_DRINK_KG*48;
  const energyCost=roastedTotal/0.84*1.5;
  return{daily,branches:bins,requested,served,lostStock,lostQueue,revenue,waits:allWaits,roastKg:roastedTotal,contribution:revenue-coffeeCost-energyCost-labor};
}
export function runLab(inputRaw:LabInput):LabResult {
  const input=valid(inputRaw);
  const runs=Array.from({length:input.repetitions},(_,i)=>one(input,i));
  const avg=(values:number[])=>sum(values)/values.length;
  const summary={
    requested:avg(runs.map(x=>x.requested)),
    served:avg(runs.map(x=>x.served)),
    serviceRate:avg(runs.map(x=>x.served/Math.max(1,x.requested)))*100,
    lostStock:avg(runs.map(x=>x.lostStock)),
    lostQueue:avg(runs.map(x=>x.lostQueue)),
    revenueQar:avg(runs.map(x=>x.revenue)),
    contributionQar:avg(runs.map(x=>x.contribution)),
    meanWaitMinutes:avg(runs.map(x=>avg(x.waits.length?x.waits:[0]))),
    roastKg:avg(runs.map(x=>x.roastKg)),
    p10RevenueQar:quantile(runs.map(x=>x.revenue),0.10),
    p90RevenueQar:quantile(runs.map(x=>x.revenue),0.90)
  };
  const daily:LabDay[]=runs[0].daily.map((day,i)=>{
    const mean=(key:keyof LabDay)=>avg(runs.map(r=>Number(r.daily[i][key])));
    return{day:day.day,requested:mean("requested"),served:mean("served"),lostStock:mean("lostStock"),lostQueue:mean("lostQueue"),revenueQar:mean("revenueQar"),roastedKg:mean("roastedKg"),warehouseStockKg:mean("warehouseStockKg"),branchStockKg:mean("branchStockKg")};
  });
  const branches:LabBranch[]=BRANCHES.map(b=>({
    id:b.id,name:b.name,
    served:avg(runs.map(r=>r.branches[b.id].served)),
    lostStock:avg(runs.map(r=>r.branches[b.id].lostStock)),
    lostQueue:avg(runs.map(r=>r.branches[b.id].lostQueue)),
    revenueQar:avg(runs.map(r=>r.branches[b.id].revenue)),
    p90WaitMinutes:avg(runs.map(r=>quantile(r.branches[b.id].waits,0.9))),
    endingStockKg:avg(runs.map(r=>r.branches[b.id].endStock))
  }));
  return{
    input,provenance:input.branchOrdersPerDay?"partially_calibrated":"synthetic",
    summary,daily,branches,
    limitations:[
      "الإعدادات الأساسية افتراضية ولا تمثل قياسات مؤكدة من محمصة الدوحة.",
      "استيراد أعداد الطلبات اليومية يعاير الطلب جزئيًا فقط؛ لا يثبت صلاحية زمن الخدمة أو المخزون أو التكاليف.",
      "نطاق P10–P90 يصف تباين نتائج النموذج، وليس عدم اليقين الكامل في الواقع.",
      "لا تُستخدم النتائج لاتخاذ قرارات إنتاج أو توظيف أو شراء قبل التحقق من بيانات فعلية مستقلة."
    ]
  };
}
export const DEFAULT_LAB_INPUT:LabInput={days:14,repetitions:12,seed:42,demandFactor:1,deliveryDays:1,roastCapacityKg:20,extraAlKhorBaristas:0};
