import type { Metadata } from "next";
import { cmsConfigured } from "@/lib/cms/server";
import { CmsSetPassword } from "@/components/cms/set-password";
export const metadata: Metadata = { title: "إنشاء كلمة المرور", robots: {index:false,follow:false}, referrer:"no-referrer" };
export default function SetPasswordPage(){ return <CmsSetPassword configured={cmsConfigured()} />; }
