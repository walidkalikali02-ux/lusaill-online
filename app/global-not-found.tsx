import type { Metadata } from "next";
import NotFound from "./not-found";
import "./globals.css";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة | لوسيل",
  description: "ربما تغيّر رابط الصفحة أو لم تُنشر بعد.",
};

export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <NotFound />
      </body>
    </html>
  );
}
