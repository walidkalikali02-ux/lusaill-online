import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "مختبر الواقع | لوحة محاكاة المحمصة والفروع — لوسيل",
  description: "لوحة داخلية تجريبية لمحاكاة وتشخيص وتوثيق عمليات المحمصة والمقاهي.",
  robots: { index:false, follow:false }
};
export default function RealityLabLayout({children}:{children:React.ReactNode}){return children;}
