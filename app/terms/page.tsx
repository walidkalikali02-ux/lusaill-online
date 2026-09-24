import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig, siteSocialImage } from "@/lib/site-config";

const title = "شروط الاستخدام";
const description = "شروط استخدام أدلة لوسيل العربية، وحدود المعلومات المنشورة، واحترام حقوق المحتوى والروابط والمصادر الرسمية.";

export const metadata: Metadata = {
  title, description, alternates: { canonical: "/terms" },
  openGraph: { title, description, url: "/terms", type: "website", images: [siteSocialImage] },
};

export default function TermsPage() {
  const schema = {
    "@context": "https://schema.org", "@type": "WebPage", "@id": `${absoluteUrl("/terms")}#webpage`,
    url: absoluteUrl("/terms"), name: title, description, inLanguage: siteConfig.language,
    isPartOf: { "@id": `${siteConfig.url}/#website` }, dateModified: "2026-09-24",
  };
  const breadcrumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: title, item: absoluteUrl("/terms") },
  ] };
  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">لوسيل · تحديث 24 سبتمبر 2026</span>
        <h1>{title}</h1>
        <p className="text-lead">تقدم لوسيل أدلة معلوماتية عامة تساعد القارئ على فهم إجراءات ومشكلات يومية. باستخدام الموقع يمكنك قراءة المحتوى ومشاركة روابط صفحاته مع الآخرين.</p>
        <section><h2>استخدام المعلومات</h2><p>نعمل على ربط التعليمات بمراجعها الأصلية وإظهار تاريخ التحقق، لكن الخدمات وواجهاتها وشروط إتاحتها قد تتغير بعد المراجعة. تحقق من الجهة الرسمية قبل إرسال بياناتك أو إجراء معاملة. لا يمثل الموقع جهة حكومية أو دعمًا رسميًا للشركات المذكورة، ولا يقدم توصية شخصية طبية أو مالية أو قانونية. قد تختلف الخطوات بحسب جهازك وحسابك وبلدك.</p></section>
        <section><h2>المحتوى والروابط</h2><p>النصوص والصور التوضيحية المنشورة ضمن الموقع من إنتاج لوسيل إلا إذا ذُكر مصدر مختلف بوضوح. يمكنك مشاركة روابط المقالات ونسبة المعلومة إلى مصدرها. لا تفترض أن الصور الرمزية لقطات رسمية من الخدمات التي تشرحها. المراجع الخارجية تُدار من جهاتها، ولسنا مسؤولين عن تغييراتها أو توقفها.</p></section>
        <section><h2>الملاحظات والمسؤولية</h2><p>إذا وجدت خطأ، أرسل رابط الصفحة والموضع المتأثر والمصدر الذي يصححه عبر <Link href="/contact">تواصل معنا</Link>. لا تنشر معلومات حساسة في بلاغات GitHub العامة. يساعدنا البلاغ على المراجعة، لكنه لا يضمن تحديثًا فوريًا أو استجابة في وقت محدد. استخدم المواقع والخدمات الرسمية نفسها عند الحاجة إلى مساعدة في معاملة أو حساب خاص بك.</p></section>
        <section><h2>تعديلات الصفحة</h2><p>قد نحدث هذه الشروط إذا تغيرت وظائف الموقع أو طريقة تقديم الأدلة، ونُظهر تاريخ المراجعة هنا. للاطلاع على تعامل الموقع مع البيانات، اقرأ <Link href="/privacy">سياسة الخصوصية</Link>.</p></section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    </main>
  );
}
