import { NextResponse } from "next/server";
import { DEFAULT_LAB_INPUT, runLab, type LabInput } from "@/lib/reality-lab/model";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  return NextResponse.json({status:"ready",mode:"synthetic_demo",model:"coffee-coupled-v0.3",defaultInput:DEFAULT_LAB_INPUT},{headers:{"Cache-Control":"no-store"}});
}
export async function POST(request:Request) {
  try {
    const length=Number(request.headers.get("content-length")??0);
    if(length>12000) return NextResponse.json({error:"الطلب أكبر من الحد المسموح"},{status:413});
    const body=await request.json() as Partial<LabInput>;
    if(!body||typeof body!=="object"||Array.isArray(body)) throw new Error("المدخلات غير صالحة");
    // An explicit allowlist prevents arbitrary client fields entering the model.
    const input:LabInput={
      days:body.days??DEFAULT_LAB_INPUT.days,
      repetitions:body.repetitions??DEFAULT_LAB_INPUT.repetitions,
      seed:body.seed??DEFAULT_LAB_INPUT.seed,
      demandFactor:body.demandFactor??DEFAULT_LAB_INPUT.demandFactor,
      deliveryDays:body.deliveryDays??DEFAULT_LAB_INPUT.deliveryDays,
      roastCapacityKg:body.roastCapacityKg??DEFAULT_LAB_INPUT.roastCapacityKg,
      extraAlKhorBaristas:body.extraAlKhorBaristas??DEFAULT_LAB_INPUT.extraAlKhorBaristas,
      ...(body.branchOrdersPerDay?{branchOrdersPerDay:body.branchOrdersPerDay}:{})
    };
    const started=Date.now();
    const result=runLab(input);
    return NextResponse.json({result,run:{modelVersion:"coffee-coupled-v0.3",executedAt:new Date().toISOString(),elapsedMs:Date.now()-started}},{headers:{"Cache-Control":"no-store, private"}});
  } catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:"فشل تشغيل المحاكاة"},{status:400,headers:{"Cache-Control":"no-store"}});
  }
}
