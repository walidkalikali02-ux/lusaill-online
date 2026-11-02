import {POST as mutate} from "../../../route";
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 if(request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:{code:"ORIGIN",message:"طلب غير مسموح"}},{status:403});
 const raw=await request.text();if(raw.length>10000)return Response.json({error:{code:"TOO_LARGE",message:"الطلب كبير جدًا"}},{status:413});
 try{const {id}=await params;return mutate(new Request(request.url,{method:"POST",headers:request.headers,body:JSON.stringify({...JSON.parse(raw),action:"transition",item:id})}));}catch{return Response.json({error:{code:"INVALID_DATA",message:"بيانات غير صالحة"}},{status:400});}
}
