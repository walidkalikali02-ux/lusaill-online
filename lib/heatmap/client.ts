import {BANDS,GRID_X,GRID_Y} from "./public";
import type {HeatmapSnapshot} from "./model";
import {layoutSignature} from "./geometry";
export async function beginHeatmap(path:string,test:boolean,signal:AbortSignal,onState:(state:string)=>void){
 const width=window.innerWidth;if(width<280||width>3000)return ()=>{};
 const layout=await layoutSignature(document);if(signal.aborted)return ()=>{};
 const start=await fetch("/api/heatmap/start",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path,width,layout,test}),signal});
 if(!start.ok){onState("تعذر بدء القياس؛ تحقق من تفعيل الأداة أو حساب المدير للاختبار");return ()=>{};}
 const {token}=await start.json();if(signal.aborted)return ()=>{};
 let sequence=0,seconds=0,maxScroll=0,stopped=false,lastTick=performance.now(),clickCount=0;
 const clicks=new Map<string,{x:number;y:number;n:number}>(),attention=Array(BANDS).fill(0) as number[];
 const height=()=>Math.min(150000,Math.max(200,document.documentElement.scrollHeight));let lastHeight=height();
 function observe(){lastHeight=height();maxScroll=Math.max(maxScroll,Math.min(100,Math.round((window.scrollY+window.innerHeight)/lastHeight*100)));}
 function snapshot():HeatmapSnapshot{return {sequence:++sequence,height:Math.round(lastHeight),viewportHeight:Math.min(3000,Math.max(200,window.innerHeight)),scroll:maxScroll,seconds,clicks:[...clicks.values()],attention:attention.map(n=>Math.round(n*1000)/1000)};}
 function send(beacon=false){if(stopped||signal.aborted||sequence>=256)return;const body=JSON.stringify({token,snapshot:snapshot()});if(beacon&&navigator.sendBeacon){navigator.sendBeacon("/api/heatmap/collect",new Blob([body],{type:"application/json"}));return;}void fetch("/api/heatmap/collect",{method:"POST",headers:{"Content-Type":"application/json"},body,keepalive:true}).then(async r=>{if(!r.ok){stopped=true;onState("توقف القياس؛ قد تكون الأداة موقوفة أو وصلت للحد اليومي");}else onState(test?"اختبار نشط — البيانات منفصلة عن الزوار":"");}).catch(()=>{onState("تعذر إرسال آخر قياس؛ لن نعتبره محفوظًا");});}
 const click=(event:MouseEvent)=>{const target=event.target;if(!(target instanceof Element)||target.closest('input,textarea,select,form,[contenteditable="true"],[data-heatmap-mask],[data-heatmap-control]')||!event.isTrusted||clickCount>=200||stopped)return;
  const x=Math.min(GRID_X-1,Math.max(0,Math.floor(event.clientX/width*GRID_X))),y=Math.min(GRID_Y-1,Math.max(0,Math.floor((event.clientY+scrollY)/height()*GRID_Y)));const key=`${x}:${y}`,saved=clicks.get(key);if(saved){saved.n++;clickCount++;}else if(clicks.size<100){clicks.set(key,{x,y,n:1});clickCount++;}
 };
 const tick=()=>{const now=performance.now(),delta=Math.min(1,Math.max(0,(now-lastTick)/1000));lastTick=now;if(document.visibilityState!=="visible"||!document.hasFocus()||seconds>=1800||stopped)return;seconds=Math.min(1800,seconds+1);observe();const h=height(),top=window.scrollY,bottom=Math.min(h,top+innerHeight),visible=Math.max(1,bottom-top);for(let i=0;i<BANDS;i++){const overlap=Math.max(0,Math.min(bottom,(i+1)*h/BANDS)-Math.max(top,i*h/BANDS));attention[i]+=delta*overlap/visible;}};
 const visibility=()=>{if(document.visibilityState==="hidden")send(true);lastTick=performance.now();};const pagehide=()=>send(true);
 observe();send();const ticker=setInterval(tick,1000),flusher=setInterval(()=>send(),15000);
 document.addEventListener("click",click,{passive:true});document.addEventListener("visibilitychange",visibility);window.addEventListener("pagehide",pagehide);
 return ()=>{if(!stopped)send(true);stopped=true;clearInterval(ticker);clearInterval(flusher);document.removeEventListener("click",click);document.removeEventListener("visibilitychange",visibility);window.removeEventListener("pagehide",pagehide);};
}
