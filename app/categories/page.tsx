import type { Metadata } from "next";
import Link from "next/link";
import { ClusterCard } from "@/components/cluster-card";
import { clusters, overallProgress, clusterProgress } from "@/lib/content";
import { absoluteUrl, siteSocialImage } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "التصنيفات",
  description: "تصفح التصنيفات التي تضم أدلة منشورة في لوسيل. ابدأ بخدمات شركات توزيع الكهرباء والاستعلام عن الفواتير، مع روابط رسمية وخطوات عملية.",
  alternates: { canonical: "/categories" },
  openGraph: {
    title: "التصنيفات — لوسيل",
    description: "التصنيفات التي تضم أدلة منشورة ومراجعة في لوسيل.",
    url: "/categories",
    type: "website",
    images: [siteSocialImage],
  },
};

export default function ClustersPage() {
  const progress = overallProgress();
  const activeClusters = clusters.filter((cluster) => clusterProgress(cluster.slug).published > 0);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "التصنيفات", item: absoluteUrl("/categories") },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "تصنيفات المقالات — لوسيل",
    description: "تصنيفات المقالات في لوسيل: دليل شامل لكل إجراء حكومي في العالم العربي.",
    numberOfItems: activeClusters.length,
    itemListElement: activeClusters.map((cluster, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/categories/${cluster.slug}`),
      name: cluster.name,
    })),
  };

  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">خريطة المحتوى</span>
        <h1>تصنيفات المقالات</h1>
        <p className="text-lead">
          تعرض هذه الصفحة التصنيفات التي تحتوي أدلة منشورة ومراجعة فقط. نضيف أي تصنيف جديد بعد اكتمال أول دليل موثق فيه.
        </p>

        <div style={{ margin: "24px 0", padding: "16px 20px", background: "var(--paper-deep)", borderRadius: 8, border: "1px solid var(--line)" }}>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)" }}>
            <strong>{progress.corePublished}</strong> من <strong>{progress.coreTotal}</strong> مقالاً منشوراً —
            كل مقال يمر بمراجعة المصادر الرسمية قبل النشر.
            <Link href="/editorial-policy" style={{ marginRight: 8, color: "var(--brand)" }}>راجع سياسة التحرير ←</Link>
          </p>
        </div>

        <section className="brief-box"><h2>كيف تختار التصنيف المناسب؟</h2>
          <p>ابدأ بالمشكلة التي تريد حلها اليوم، ثم اختر المجال الأقرب إليها. إذا كان السؤال عن فاتورة أو قراءة عداد، انتقل إلى الكهرباء. وإذا كان عن حساب أو ملف أو هاتف، اختر الحياة الرقمية. أما طلبات الخدمات المصرية فابدأ ببوابات الخدمات، وراجع نطاق البلد في الدليل قبل تطبيق أي خطوة. وجود الموضوع في تصنيف واحد لا يعني أن جميع الإجراءات متاحة لكل قارئ؛ المقصود جمع الأدلة المتقاربة حتى تقارن بينها وتصل إلى السؤال المحدد الذي تحتاجه.</p>
          <h2>من الموضوع العام إلى الإجراء المحدد</h2>
          <p>اقرأ الملخص الموجود أسفل اسم الدليل قبل فتحه. يوضح الملخص المشكلة التي يعالجها، ويساعدك على التمييز بين التسجيل في خدمة ومتابعة طلب سبق تسجيله. اختر دليلًا واحدًا يطابق حالتك، ثم افتح الأدلة المرتبطة عندما تظهر حاجة فعلية إليها. مثلًا، نقل الإشارات المرجعية في المتصفح يختلف عن نقل الملفات من الهاتف؛ التشابه في كلمة النقل لا يجعل الخطوات قابلة للتبادل. ويمكنك استخدام صفحة مسارات الأدلة إذا أردت رؤية مجموعة إجراءات مرتبطة بمهمة واحدة بدل تصفح المجال كله.</p>
          <h2>قبل تنفيذ الخطوات</h2>
          <p>جهز المعلومات التي يطلبها الدليل، وافحص المتطلبات وحدود الصلاحية أولًا. لا تبدأ بإدخال بياناتك لمجرد أن عنوان المقال قريب من سؤالك. راجع اسم الجهة ونوع الجهاز أو الحساب، وتاريخ التحقق الظاهر داخل المقال، ثم افتح المصدر الرسمي عند وجود موعد أو شرط قد يتغير. احتفظ برقم الطلب أو نتيجة الإجراء في مكان مناسب لك، دون نشر مستنداتك أو بيانات الدخول في التعليقات أو إرسالها إلى محرري الموقع. الأدلة تشرح الطريق، بينما تنفيذ الخدمة وقرار قبول الطلب يبقيان لدى مقدمها.</p>
          <h2>ماذا تفعل إذا لم تجد سؤالًا مطابقًا؟</h2>
          <p>انتقل إلى قائمة جميع الأدلة وقارن العناوين والملخصات، أو استخدم البحث في الموقع بكلمات تصف المشكلة نفسها. تجنب تطبيق حل مختلف لمجرد أنه أول نتيجة ظهرت. إذا لم يوجد دليل مناسب، يمكنك إرسال اقتراح موضوع عبر صفحة التواصل مع وصف عام للمشكلة ورابط الصفحة الرسمية إن توفر، دون بيانات شخصية. لا نعرض التصنيفات الفارغة ضمن هذه القائمة حتى لا نوجهك إلى صفحات بلا إرشاد منشور. ولتقييم طريقة إعداد المحتوى، اقرأ سياسة التحرير وصفحة فريق لوسيل؛ فهما توضحان دور المصادر وحدود المراجعة وكيفية طلب التصحيح.</p>
          <p><Link href="/guides">مسارات الأدلة</Link> · <Link href="/articles">كل الأدلة</Link> · <Link href="/contact">التواصل والتصحيح</Link></p>
        </section>
        <h2>تصفح التصنيفات المتاحة</h2>
        <div className="cluster-grid">
          {activeClusters.map((cluster) => <ClusterCard cluster={cluster} key={cluster.slug} />)}
        </div>

        <div style={{ marginTop: 48, padding: "24px 0", borderTop: "1px solid var(--line)" }}>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>كيف نبني كل تصنيف؟</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            <div style={{ padding: 16, background: "var(--paper)", borderRadius: 8, border: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>صفحة ركيزة شاملة</h3>
              <p style={{ margin: 0, fontSize: 14, color: "var(--muted)" }}>كل تصنيف يبدأ بصفحة واحدة شاملة تغطي جميع الجوانب الأساسية للموضوع.</p>
            </div>
            <div style={{ padding: 16, background: "var(--paper)", borderRadius: 8, border: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>صفحات فرعية دقيقة</h3>
              <p style={{ margin: 0, fontSize: 14, color: "var(--muted)" }}>لكل نية بحث محددة صفحة مستقلة تجيب على السؤال بدقة مع روابط رسمية.</p>
            </div>
            <div style={{ padding: 16, background: "var(--paper)", borderRadius: 8, border: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>مراجعة المصادر باستمرار</h3>
              <p style={{ margin: 0, fontSize: 14, color: "var(--muted)" }}>نسجل تاريخ التحقق داخل كل دليل، ونراجعه عند تغير الخدمة أو ظهور مصدر رسمي أحدث.</p>
            </div>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </main>
  );
}
