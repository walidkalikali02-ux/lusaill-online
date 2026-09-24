import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig, siteSocialImage } from "@/lib/site-config";

const title = "تواصل معنا";
const description = "أرسل تصحيحًا لمقال أو بلاغًا عن رابط لا يعمل عبر مستودع لوسيل الرسمي، وتعرّف على المعلومات التي تساعد فريق التحرير على المراجعة.";

export const metadata: Metadata = {
  title, description, alternates: { canonical: "/contact" },
  openGraph: { title, description, url: "/contact", type: "website", images: [siteSocialImage] },
};

export default function ContactPage() {
  const schema = {
    "@context": "https://schema.org", "@type": "ContactPage", "@id": `${absoluteUrl("/contact")}#webpage`,
    url: absoluteUrl("/contact"), name: title, description, inLanguage: siteConfig.language,
    isPartOf: { "@id": `${siteConfig.url}/#website` }, dateModified: "2026-09-24",
  };
  const breadcrumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: title, item: absoluteUrl("/contact") },
  ] };
  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">تواصل مع فريق التحرير</span>
        <h1>{title}</h1>
        <p className="text-lead">للإبلاغ عن معلومة تحتاج تصحيحًا أو رابط معطل أو مشكلة في عرض صفحة، افتح بلاغًا في المستودع الرسمي. نقرأ الملاحظات التي تساعد على تحسين الأدلة المنشورة.</p>
        <section><h2>أرسل بلاغًا عن الموقع</h2><p><a href="https://github.com/walidkalikali02-ux/lusaill-online/issues/new" target="_blank" rel="noopener noreferrer">افتح بلاغًا جديدًا على GitHub</a>؛ قد تحتاج إلى تسجيل الدخول إلى GitHub. أضف رابط المقال أو الصفحة، ووصف المشكلة، ورابطًا إلى المصدر الرسمي إذا كنت تقترح تصحيحًا. مثال: «في صفحة الدليل، الخطوة الثالثة تشير إلى زر تغيّر اسمه؛ المرجع الرسمي الحالي: …».</p></section>
        <section><h2>احمِ بياناتك أثناء الإرسال</h2><p>بلاغات GitHub في هذا المستودع علنية. لا تنشر بريدك الخاص أو رقم هاتفك أو كلمة مرور أو رمز تحقق أو صورة بطاقة أو بيانات معاملة. لا ترسل شكوى حسابك الشخصي إلى المستودع؛ استخدم قناة الدعم الرسمية للخدمة المعنية. للمعلومات المتعلقة بما قد يظهر خلال التصفح راجع <Link href="/privacy">سياسة الخصوصية</Link>.</p></section>
        <section><h2>ما الذي يمكننا مراجعته؟</h2><p>نراجع أخطاء المحتوى والتوثيق وظهور الصفحات والصور والروابط. يوضح <Link href="/editorial-policy">منهج التحرير</Link> كيف نتحقق من المعلومات. يُنشر الموقع باللغة العربية لجمهور في بلدان متعددة؛ اذكر الدولة والخدمة إذا كان التصحيح خاصًا بهما، من غير معلومات تحدد هويتك الشخصية.</p></section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    </main>
  );
}
