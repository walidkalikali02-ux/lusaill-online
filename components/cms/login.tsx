"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { browserCms } from "@/lib/cms/browser";
export function CmsLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <main id="main-content" className="cms-login">
      <span className="cms-eyebrow">لوسيل / مساحة التحرير</span>
      <h1>مرحبًا بمدير التحرير</h1>
      <p>مساحة واحدة للمقالات والمصادر والمراجعات.</p>
      {!configured ? (
        <div role="status" className="cms-notice">
          ربط مشروع Supabase الخاص بلوسيل مطلوب لتفعيل الدخول والحفظ. لن تُستخدم
          قاعدة بيانات المتجر.
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            const f = new FormData(e.currentTarget);
            const { error } = await browserCms().auth.signInWithPassword({
              email: String(f.get("email")),
              password: String(f.get("password")),
            });
            if (error) {
              setError("تعذر الدخول؛ راجع بيانات الحساب");
              setBusy(false);
            } else router.replace("/admin");
            router.refresh();
          }}
        >
          <label>
            البريد الإلكتروني
            <input
              required
              type="email"
              name="email"
              autoComplete="username"
              dir="ltr"
            />
          </label>
          <label>
            كلمة المرور
            <input
              required
              type="password"
              name="password"
              autoComplete="current-password"
            />
          </label>
          <button disabled={busy}>{busy ? "جارٍ الدخول…" : "دخول آمن"}</button>
          <p role="alert">{error}</p>
          <Link href="/admin/set-password">إنشاء كلمة المرور من الدعوة</Link>
        </form>
      )}
    </main>
  );
}
