"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { browserCms } from "@/lib/cms/browser";
import { parseInvitation } from "@/lib/cms/invitation";
export function CmsSetPassword({configured}:{configured:boolean}) {
  const router=useRouter();
  const [verified,setVerified]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");
  return <main id="main-content" className="cms-login"><h1>إنشاء كلمة مرور المدير</h1>
    {!configured ? <p>يلزم تفعيل اتصال قاعدة البيانات أولًا.</p> : !verified ? <>
      <p>من رسالة دعوة Supabase في بريدك، انسخ عنوان زر قبول الدعوة والصقه هنا. لا ترسل الرابط أو كلمة المرور في المحادثة.</p>
      <form onSubmit={async e=>{e.preventDefault();setError("");setBusy(true);const form=e.currentTarget;
        try { const link=parseInvitation(String(new FormData(form).get("invitation")),process.env.NEXT_PUBLIC_SUPABASE_URL!);
          form.reset();
          const client=browserCms();const {error}=await client.auth.verifyOtp(link);
          if(error)throw error;
          const {data:{user}}=await client.auth.getUser();
          if(!user)throw Error("NO_USER");
          const {data}=await client.from("cms_admins").select("user_id").eq("user_id",user.id).maybeSingle();
          if(!data){await client.auth.signOut();throw Error("NOT_ADMIN");}
          setVerified(true);
        }catch{setError("تعذر التحقق. استخدم رابط الدعوة الأصلي لهذا المشروع؛ ربما انتهت صلاحيته أو استُخدم سابقًا.");}finally{setBusy(false);}
      }}><label>رابط الدعوة<input name="invitation" type="password" autoComplete="off" required /></label><button disabled={busy}>{busy?"جارٍ التحقق…":"التحقق من الدعوة"}</button></form>
    </> : <><p>تم التحقق من حساب المدير. اختر كلمة مرور جديدة من 12 حرفًا على الأقل.</p>
      <form onSubmit={async e=>{e.preventDefault();setError("");const form=e.currentTarget;const fields=new FormData(form);const password=String(fields.get("password"));
        if(password!==fields.get("confirm")){setError("كلمتا المرور غير متطابقتين");return;}
        setBusy(true);
        try {const {error}=await browserCms().auth.updateUser({password});if(error)throw error;form.reset();router.replace("/admin");router.refresh();}
        catch{setError("تعذر حفظ كلمة المرور. تحقق من شروط كلمة المرور وصلاحية جلسة الدعوة.");}finally{setBusy(false);}
      }}><label>كلمة المرور الجديدة<input name="password" type="password" autoComplete="new-password" minLength={12} required /></label>
      <label>تأكيد كلمة المرور<input name="confirm" type="password" autoComplete="new-password" minLength={12} required /></label><button disabled={busy}>{busy?"جارٍ الحفظ…":"حفظ كلمة المرور"}</button></form>
    </>}
    <p role="alert">{error}</p><Link href="/admin/login">العودة لتسجيل الدخول</Link>
  </main>;
}
