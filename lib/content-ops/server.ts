import "server-only";
import { cmsClient } from "../cms/server";
export async function requireOps() {
 const client=await cmsClient();
 const {data:{user},error}=await client.auth.getUser();
 if(error||!user)throw Error("UNAUTHORIZED");
 const {data:role,error:roleError}=await client.rpc("ops_role");
 if(roleError)throw Error("OPERATIONS_NOT_CONFIGURED");
 if(!role)throw Error("FORBIDDEN");
 return {client,user,role:String(role)};
}
const messages:Record<string,string>={OVERRIDE_REASON_REQUIRED:"سجّل سبب استثناء المدير لاعتماد العمل المسند إليه",UNAUTHORIZED:"انتهت جلسة الدخول؛ سجّل الدخول مجددًا",OPERATIONS_NOT_CONFIGURED:"قاعدة عمليات المحتوى غير مفعلة بعد",SELF_APPROVAL_FORBIDDEN:"لا يمكن اعتماد العمل المسند إليك بنفسك",ITEM_REQUIRED:"اختر عنصر المحتوى المرتبط",IDEA_REQUIRED:"اختر الفكرة المرتبطة",CLUSTER_REQUIRED:"اختر المجموعة المرتبطة",EVIDENCE_REQUIRED:"أضف رابط دليل HTTPS وتاريخ الرصد قبل تحويل الفكرة",OWNER_REQUIRED:"اختر مسؤولًا نشطًا",TITLE_REQUIRED:"أدخل عنوان العمل",INVALID_PATH:"أدخل مسارًا داخليًا صالحًا",TASK_INCOMPLETE:"حدد المسؤول ومتطلبات الإنجاز وسبب التعطيل عند التوقف",NOT_FOUND:"السجل غير موجود",INVALID_DATA:"بيانات غير صالحة",VERSION_CONFLICT:"تعارض تعديل؛ أعد تحميل النسخة الأحدث",FORBIDDEN:"ليست لديك صلاحية هذا الإجراء",APPROVAL_FORBIDDEN:"اعتماد هذا السجل يحتاج محررًا أو مسؤول استراتيجية",BRIEF_INCOMPLETE:"أكمل حقول الموجز الإلزامية قبل الاعتماد",OUTLINE_INCOMPLETE:"أضف أقسام H2/H3 بعناوين واضحة",BRIEF_REQUIRED:"يلزم اعتماد الموجز أولًا",OUTLINE_REQUIRED:"يلزم اعتماد الهيكل أولًا",CRITICAL_REVIEW:"توجد ملاحظة حرجة لم تُعالج",UNVERIFIED_CLAIMS:"توجد ادعاءات لم يُعتمد التحقق منها",REVIEW_REQUIRED:"يلزم تقرير مراجعة ناجح",REASON_REQUIRED:"اكتب سبب إعادة العمل للمرحلة السابقة",INVALID_TRANSITION:"انتقال غير مسموح؛ اتبع ترتيب المراحل",FINAL_APPROVAL_FORBIDDEN:"لا تملك صلاحية الاعتماد النهائي",SOURCE_NOT_VERIFIED:"أدخل رابط HTTPS وتاريخ التحقق",IDEA_REQUIRED_FIELDS:"سجّل المشكلة والجمهور والدولة",USE_TRANSITION:"استخدم إجراء الانتقال لتغيير المرحلة",INVALID_CONTENT_TYPE:"نوع المحتوى غير صالح"};
export function opsError(error:unknown){const value=error instanceof Error?error.message:String((error as {message?:string})?.message??"");const key=Object.keys(messages).sort((a,b)=>b.length-a.length).find(k=>value.includes(k));if(key)return {code:key,message:messages[key]};return {code:"OPERATIONS_FAILED",message:"تعذر تنفيذ العملية؛ تحقق من الإعدادات والاتصال والصلاحيات"};}
