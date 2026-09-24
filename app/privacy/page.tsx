import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig, siteSocialImage } from "@/lib/site-config";

const title = "سياسة الخصوصية";
const description = "كيف يتعامل موقع لوسيل مع بيانات زيارة الصفحات وروابط المصادر والملاحظات التي ترسلها عبر GitHub، وحدود الخدمات الخارجية.";

export const metadata: Metadata = {
  title, description, alternates: { canonical: "/privacy" },
  openGraph: { title, description, url: "/privacy", type: "website", images: [siteSocialImage] },
};

export default function PrivacyPage() {
  const schema = {
    "@context": "https://schema.org", "@type": "WebPage", "@id": `${absoluteUrl("/privacy")}#webpage`,
    url: absoluteUrl("/privacy"), name: title, description, inLanguage: siteConfig.language,
    isPartOf: { "@id": `${siteConfig.url}/#website` }, dateModified: "2026-09-24",
  };
  const breadcrumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: title, item: absoluteUrl("/privacy") },
  ] };
  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">لوسيل · تحديث 24 سبتمبر 2026</span>
        <h1>{title}</h1>
        <p className="text-lead">نشرح هنا طريقة تعامل الموقع مع البيانات التي قد تنشأ أثناء تصفح أدلتنا أو إرسال ملاحظة. لا يتطلب الاطلاع على المقالات إنشاء حساب في لوسيل.</p>
        <section><h2>التصفح والبيانات التقنية</h2><p>يعرض الموقع صفحات عامة وصورًا عبر استضافة Vercel. قد تُعالَج بيانات الطلب التقنية، مثل عنوان IP ونوع المتصفح والمسار المطلوب وتوقيت الزيارة، لتوصيل الصفحة وتشغيل الاستضافة وحمايتها. تتحكم الجهة المستضيفة في سجلاتها ومدد حفظها وفق سياساتها. لا تطلب صفحات الأدلة منا اسمك أو رقم هاتفك لإتمام القراءة.</p></section>
        <section><h2>روابط الجهات الخارجية</h2><p>قد تنقلك الروابط إلى مصادر رسمية أو إلى GitHub للتواصل. عند فتح خدمة خارجية تنطبق ممارسات خصوصيتها وشروطها الخاصة؛ راجعها قبل تسجيل الدخول أو مشاركة معلومات شخصية. لا ترسل رموز التحقق أو كلمات المرور في أي بلاغ عام.</p></section>
        <section><h2>التواصل العلني</h2><p>يمكنك إرسال تصحيح أو سؤال عن الموقع عبر <a href="https://github.com/walidkalikali02-ux/lusaill-online/issues/new" target="_blank" rel="noopener noreferrer">صفحة البلاغات في مستودع لوسيل على GitHub</a>. البلاغات هناك علنية وقد تتطلب حساب GitHub؛ تجنب تضمين أي بيانات شخصية أو مستندات حساسة. يعالج GitHub معلومات حسابك ونشاطك وفق سياساته، ويمكنك استخدام صفحة <Link href="/contact">تواصل معنا</Link> لتحديد أفضل نوع من الملاحظات.</p></section>
        <section><h2>التحكم والتحديثات</h2><p>يمكنك ترك الموقع دون إنشاء حساب لدينا. لضبط ملفات تعريف الارتباط أو أذونات المواقع الأخرى استخدم إعدادات متصفحك وتحقق من سياسة الخدمة المعنية. إذا تغيرت طريقة عمل الموقع أو أضيفت وسيلة تواصل خاصة، سنراجع هذه الصفحة ونوضح تاريخ تحديثها. للملاحظات المتعلقة بما ننشره، راجع أيضًا <Link href="/editorial-policy">منهج التحرير</Link>.</p></section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    </main>
  );
}
