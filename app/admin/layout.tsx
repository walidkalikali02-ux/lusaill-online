import type { Metadata } from "next";
import "./cms.css";
import "./seo/seo.css";
export const metadata: Metadata = {
  title: "إدارة لوسيل",
  robots: { index: false, follow: false },
};
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="cms" dir="rtl">
      {children}
    </div>
  );
}
