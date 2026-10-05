import { pageAlternates } from "@/lib/page-alternates";
import type { Metadata } from "next";
import Link from "next/link";
import { entities } from "@/lib/entities";
import { articles } from "@/lib/content";
import { absoluteUrl, siteSocialImage } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "الجهات والخدمات",
  description: "روابط الجهات الرسمية المرتبطة بأدلة لوسيل للخدمات المصرية والمرور والكهرباء، مع توضيح الخدمات ذات الصلة.",
  alternates: pageAlternates("/entities"),
  openGraph: {
    title: "الجهات والخدمات — لوسيل",
    description: "الجهات الرسمية المرتبطة بالأدلة المنشورة في لوسيل.",
    url: "/entities",
    type: "website",
    images: [siteSocialImage],
  },
};

export default function EntitiesPage() {
  const activeEntities = entities.filter((entity) => articles.some((article) => article.status === "published" && entity.clusterCodes.includes(article.clusterCode)));
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "الجهات والخدمات", item: absoluteUrl("/entities") },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "الجهات والخدمات الحكومية — لوسيل",
    description: "دليل شامل للجهات والخدمات الحكومية في مصر.",
    numberOfItems: activeEntities.length,
    itemListElement: activeEntities.map((entity, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/entities/${entity.slug}`),
      name: entity.name,
    })),
  };

  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">دليل الجهات</span>
        <h1>الجهات والخدمات الحكومية</h1>
        <p className="text-lead">
          نعرض فقط الجهات المرتبطة بأدلة منشورة ومراجعة، مع رابط البوابة الرسمية والخدمات ذات الصلة.
        </p>
        <section className="brief-box"><h2>استخدم دليل الجهات للوصول إلى المصدر</h2>
          <p>اختر الجهة المرتبطة بالخدمة التي تحتاجها، ثم افتح صفحتها لمعرفة الروابط والخدمات المتصلة بالأدلة المنشورة. هذه الصفحة نقطة بداية لتنظيم الوصول وليست بوابة لتنفيذ طلبات حكومية. لا تستقبل لوسيل مستندات التقديم أو رسوم الخدمات، ولا تمنح رقم طلب رسميًا. عند الانتقال إلى موقع خارجي، اقرأ اسم الجهة وعنوان الصفحة قبل تسجيل الدخول. وجود رابط في دليل إرشادي يساعدك على الوصول، لكنه لا يعفيك من التحقق من أنك تستخدم الخدمة المناسبة لحالتك وبلدك.</p>
          <h2>اختر الخدمة قبل تجهيز المستندات</h2>
          <p>اكتب أولًا ما تريد إنجازه: إنشاء حساب، استخراج مستند، الاستعلام عن فاتورة، متابعة طلب أو تقديم شكوى. ثم قارن ذلك بوصف الخدمات في صفحة الجهة. لا تجمع أوراقًا أو تبدأ طلبًا جديدًا قبل قراءة متطلبات الخدمة الرسمية. إذا كنت تتابع طلبًا قديمًا، احتفظ برقم المرجع وتاريخ التسجيل، وابحث عن مسار المتابعة في الدليل المرتبط. مثال عملي: سؤال عن عدم ظهور فاتورة يحتاج تحديد شركة التوزيع وخدمة الاستعلام، بينما تعطل جهازك أثناء فتح الموقع يحتاج تشخيصًا تقنيًا منفصلًا؛ الخلط بينهما قد يوجهك إلى حل لا يعالج السبب.</p>
          <h2>تحقق من حدود الإرشاد</h2>
          <p>راجع تاريخ المصدر داخل المقال المرتبط، ثم افتح صفحة الخدمة الرسمية للتأكد من الشروط الحالية. أسماء الخدمات ومواعيدها وطريقة إتاحتها قد تختلف، لذلك لا تعتبر وصفًا مختصرًا في بطاقة الجهة قائمة كاملة بكل ما تقدمه. بعض الإجراءات تحتاج قناة أخرى أو مراجعة حالة خاصة؛ عندما لا يطابق الدليل حالتك، اسأل الجهة صاحبة القرار بدل التخمين. كذلك، لا يدل ظهور جهة في القائمة على وجود علاقة رسمية بينها وبين لوسيل. نحن ننظم روابط المعلومات العامة ونوضح الطريق إلى مصادرها، ولا نمثل تلك الجهات أو نصدر قرارات نيابة عنها.</p>
          <h2>إذا تعطل الرابط أو اختلفت التعليمات</h2>
          <p>افحص ما إذا كانت الصفحة تعرض خطأ مؤقتًا أو نقلًا للخدمة، ثم استخدم التنقل الظاهر في موقع الجهة للوصول إلى قسم الخدمات أو الدعم. لا تبحث عن بديل غير رسمي يطلب منك كلمة مرور أو رمز تحقق لتنفيذ الإجراء. يمكنك إبلاغنا بالرابط المتعطل واسم الدليل ونص الخطأ العام عبر صفحة التواصل، دون رفع بطاقة هوية أو فاتورة كاملة. نستخدم هذه الملاحظة لتصحيح رابط أو توضيح حدود الدليل؛ أما الشكاوى الرسمية والاعتراضات على قرار الخدمة فتقدم في قناة الجهة نفسها. احتفظ بنسخة من البيانات المرجعية اللازمة للمتابعة الخاصة بك فقط.</p>
          <p><Link href="/guides">مسارات الأدلة</Link> · <Link href="/articles">كل الأدلة</Link> · <Link href="/contact">التواصل والتصحيح</Link></p>
        </section>
        <h2>تصفح الجهات المرتبطة بالأدلة</h2>
        <div className="cluster-grid">
          {activeEntities.map((entity) => (
            <Link key={entity.slug} className="cluster-card" href={`/entities/${entity.slug}`} style={{ "--c": "#145da0" } as React.CSSProperties}>
              <div className="cluster-top">
                <span className="cluster-code">{entity.category}</span>
              </div>
              <h3>{entity.name}</h3>
              <p>{entity.description.slice(0, 120)}...</p>
              <div className="cluster-meta">
                <span><b>{entity.services.length}</b> خدمة</span>
                {entity.phone && <span>هاتف: {entity.phone}</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </main>
  );
}
