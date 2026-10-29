import type { GeometryDiagramKind } from "@/lib/geometry-course";
const purple="#79579B", light="#DDD0EF", mint="#C6E1D9", peach="#F2D7B5", ink="#514064";
function Box({x=100,y=110,w=180,h=115,d=60,grid=false}:{x?:number;y?:number;w?:number;h?:number;d?:number;grid?:boolean}) {
 return <g stroke={purple} strokeWidth="2.5" strokeLinejoin="round"><path d={`M${x} ${y}l${d} ${-d/2}h${w}l${-d} ${d/2}Z`} fill={mint}/><path d={`M${x+w} ${y}l${d} ${-d/2}v${h}l${-d} ${d/2}Z`} fill={light}/><path d={`M${x} ${y}h${w}v${h}h${-w}Z`} fill="#F4EEFA"/><path d={`M${x} ${y}v${h}m0 0 ${d} ${-d/2}h${w}M${x+d} ${y-d/2}v${h}`} strokeDasharray="6 5" opacity=".45"/>{grid && <g strokeWidth="1" opacity=".75">{[1,2,3].map(n=><path key={n} d={`M${x+w*n/4} ${y}v${h}m0 ${-h} ${d} ${-d/2}`}/>)}{[1,2].map(n=><path key={n} d={`M${x} ${y+h*n/3}h${w}l${d} ${-d/2}`}/>)}</g>}</g>;
}
function Triangle({x=90,y=245,small=false}:{x?:number;y?:number;small?:boolean}){const b=small?80:190,h=small?75:135,d=small?55:145;return <g stroke={purple} strokeWidth="2.5" strokeLinejoin="round"><path d={`M${x} ${y}l${b/2} ${-h} ${d} ${-45} ${b/2} ${h} ${-d} 45Z`} fill={light}/><path d={`M${x} ${y}l${d} -45h${b}l${-d} 45Z`} fill={mint}/><path d={`M${x} ${y}l${b/2} ${-h} ${b/2} ${h}Z`} fill="#FFF6E9"/><path d={`M${x+b/2} ${y-h}v${h}m-10-0v-10h10`} strokeDasharray="5 4"/></g>}
export function GeometryDiagram({kind,label,decorative=false}:{kind:GeometryDiagramKind;label?:string;decorative?:boolean}) {
 const triangular=kind==="triangular"||kind==="tent";
 return <svg className="geometry-diagram" viewBox="0 0 520 340" role={decorative?undefined:"img"} aria-label={decorative?undefined:label??"رسم تعليمي أصلي للمجسّمات"} aria-hidden={decorative?true:undefined}>
 <rect x="0" y="0" width="520" height="340" rx="24" fill="#F1EDF7"/>
 <circle cx="455" cy="60" r="60" fill="#E8DFF2"/>
 {kind==="solids"?<>
 <Box x={43} y={65} w={65} h={65} d={28}/><text x="90" y="158">مكعب</text>
 <g stroke={purple} strokeWidth="2.5"><path d="m205 132 50-80 50 80Z" fill={peach}/><path d="m255 52 22 64 28 16-55 16-45-16Z" fill={light}/><path d="m255 52-5 96"/></g><text x="255" y="178">هرم</text>
 <g stroke={purple} strokeWidth="2.5"><path d="M376 70v64c0 24 80 24 80 0V70" fill={mint}/><ellipse cx="416" cy="70" rx="40" ry="15" fill="#EAF5F1"/></g><text x="416" y="178">أسطوانة</text>
 <Triangle x={40} y={278} small/><text x="100" y="313">منشور ثلاثي</text>
 <g stroke={purple} strokeWidth="2.5"><path d="m217 278 38-78 38 78" fill={peach}/><ellipse cx="255" cy="278" rx="38" ry="12" fill={light}/></g><text x="255" y="313">مخروط</text>
 <g stroke={purple} strokeWidth="2.5"><circle cx="416" cy="247" r="43" fill={mint}/><ellipse cx="416" cy="247" rx="43" ry="13" strokeDasharray="5 5" fill="none"/></g><text x="416" y="313">كرة</text>
 </>:triangular?<><Triangle/><text x="185" y="278" direction="ltr">b</text><text x="205" y="192" direction="ltr">h</text><text x="375" y="239" direction="ltr">L</text>{kind==="tent"?<text x="260" y="313">مقطع مثلث ثابت على طول الخيمة</text>:<text x="260" y="313">h عمودي على b داخل المثلث</text>}</>:<>
 <Box x={105} y={110} w={215} h={130} d={80} grid={kind==="cubes"||kind==="fraction-cubes"}/>
 {kind==="vertices"?<><circle cx="105" cy="110" r="7" fill={purple}/><path d="M105 110 70 65" stroke={ink} strokeWidth="2"/><text x="65" y="48">رأس</text><path d="M190 240v38" stroke={ink} strokeWidth="2"/><text x="190" y="305">حرف</text><text x="210" y="185">وجه</text></>:<><text x="210" y="273" direction="ltr">{kind==="fractional"?"3/2":"l"}</text><text x="377" y="247" direction="ltr">{kind==="fractional"?"4/3":"w"}</text><text x="79" y="185" direction="ltr">{kind==="fractional"?"5/2":"h"}</text></>}
 {(kind==="tank"||kind==="rate")&&<g><path d="m106 166 79-40h214v74l-79 40H106Z" fill="#8BBAC8" opacity=".45"/>{kind==="rate"&&<><path d="M243 22v45m-12-12 12 12 12-12" stroke={purple} strokeWidth="4" fill="none"/><text x="315" y="43">تدفق ثابت</text></>}</g>}
 {kind==="cubes"&&<text x="260" y="315">صفوف × أعمدة × طبقات</text>}
 {kind==="fraction-cubes"&&<text x="260" y="315" direction="ltr">a = 1/2  →  a³ = 1/8</text>}
 </>}
 </svg>;
}
