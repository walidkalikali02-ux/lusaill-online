import {requireAdmin} from '@/lib/cms/server';
import {importXlsx} from '@/lib/intelligence/xlsx';
import {importUrlText} from '@/lib/intelligence/import';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 const headers={'Cache-Control':'private,no-store'};
 if(request.headers.get('origin')!==new URL(request.url).origin)return new Response(null,{status:403});
 try{await requireAdmin();}catch{return new Response(null,{status:401});}
 try{if(Number(request.headers.get('content-length')??0)>2200000)return new Response(null,{status:413});const body=await request.formData();const file=body.get('file');if(!(file instanceof File)||file.size>2000000)return Response.json({error:'الحد الأقصى للملف ٢ ميجابايت'},{status:413,headers});const bytes=Buffer.from(await file.arrayBuffer());const result=/\.xlsx$/i.test(file.name)?importXlsx(bytes):/\.(csv|txt)$/i.test(file.name)?importUrlText(bytes.toString('utf8')):null;if(!result)throw Error('الصيغ المدعومة: XLSX وCSV وTXT');return Response.json(result,{headers});}catch(e){return Response.json({error:e instanceof Error?e.message:'تعذر قراءة الملف'},{status:422,headers});}
}
