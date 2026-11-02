import type { Metadata } from "next";
import { cmsConfigured } from "@/lib/cms/server";
import { CmsLogin } from "@/components/cms/login";
export const metadata: Metadata = {
  description: "تسجيل الدخول الآمن إلى مساحة تحرير لوسيل.",
  alternates: { canonical: "/admin/login" },
  robots: { index: false, follow: false },
};
export default function Login() {
  return <CmsLogin configured={cmsConfigured()} />;
}
