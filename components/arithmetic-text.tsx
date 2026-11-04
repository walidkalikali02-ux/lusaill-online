export function ArithmeticText({text}:{text:string}){return <>{text.split(/(\d+(?:[ \t]+[+\-=][ \t]+\d+)+)/g).map((part,i)=>i%2?<bdi dir="ltr" key={i}>{part}</bdi>:part)}</>;}
