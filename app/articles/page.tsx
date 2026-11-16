import { ArticleCard } from "@/components/article-card";
import { pageAlternates } from "@/lib/page-alternates";
import type { Metadata } from "next";
import Link from "next/link";
import { articles, clusters, isArticleIndexable } from "@/lib/content";
import { absoluteUrl, siteSocialImage } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "كل الأدلة",
  description: "تصفّح أدلة لوسيل العملية في الخدمات والإجراءات والحياة الرقمية، مع روابط للمصادر وخطوات واضحة لإكمال المهمة.",
  alternates: pageAlternates("/articles"),
  openGraph: {
    title: "كل الأدلة — لوسيل",
    description: "تصفّح أدلة لوسيل العملية في الخدمات والإجراءات والحياة الرقمية، مع روابط للمصادر وخطوات واضحة لإكمال المهمة.",
    url: "/articles",
    type: "website",
    images: [siteSocialImage],
  },
};

export default function ArticlesPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "الأدلة", item: absoluteUrl("/articles") },
    ],
  };

  const publishedArticles = articles.filter(isArticleIndexable).sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") || b.id - a.id);



  return (
    <main id="main-content" className="category-page">
<section className="shell" aria-label="أدلة الذكاء الاصطناعي"><h2>أدلة الذكاء الاصطناعي</h2><ul><li><Link href="/knowledge/ai-vs-machine-learning-vs-deep-learning">الفرق بين الذكاء الاصطناعي وتعلم الآلة والتعلم العميق بمثال واحد</Link></li><li><Link href="/knowledge/types-of-artificial-intelligence">الذكاء الاصطناعي الضيق والعام والخارق: ما الفرق؟</Link></li><li><Link href="/knowledge/what-is-an-algorithm">ما هي الخوارزمية؟ شرح لغير المبرمجين</Link></li><li><Link href="/knowledge/big-data-and-artificial-intelligence">البيانات الضخمة وعلاقتها بالذكاء الاصطناعي</Link></li><li><Link href="/knowledge/what-is-labeled-data">ما هي البيانات المعنونة ولماذا هي مكلفة؟</Link></li><li><Link href="/knowledge/supervised-learning-explained">التعلم الخاضع للإشراف بأمثلة من الأعمال</Link></li><li><Link href="/knowledge/unsupervised-learning-customer-segmentation">التعلم غير الخاضع للإشراف وتقسيم العملاء</Link></li><li><Link href="/knowledge/reinforcement-learning-explained">التعلم المعزز: كيف تتعلم الآلة بالتجربة</Link></li><li><Link href="/knowledge/predictive-models-explained">ما هو النموذج التنبؤي وكيف يُبنى؟</Link></li><li><Link href="/knowledge/regression-vs-classification">الانحدار والتصنيف: أبسط شرح مع أمثلة تجارية</Link></li><li><Link href="/knowledge/decision-trees-vs-random-forests">أشجار القرار والغابات العشوائية لغير المتخصصين</Link></li><li><Link href="/knowledge/clustering-in-machine-learning-marketing">التجميع في تعلم الآلة وتطبيقاته في التسويق</Link></li><li><Link href="/knowledge/anomaly-detection-and-fraud">كشف الشذوذ في تعلم الآلة واكتشاف الاحتيال</Link></li><li><Link href="/knowledge/recommendation-systems">أنظمة التوصية: كيف تقترح المتاجر ما قد ترغب في شرائه؟</Link></li><li><Link href="/knowledge/context-window-and-tokens">نافذة السياق والتوكنات: لماذا ينسى الشات بوت بداية المحادثة؟</Link></li><li><Link href="/knowledge/ai-model-parameters">معاملات نماذج الذكاء الاصطناعي: هل النموذج الأكبر أفضل؟</Link></li><li><Link href="/knowledge/temperature-in-ai-models">درجة الحرارة في نماذج الذكاء الاصطناعي: كيف تتغير الإجابات؟</Link></li><li><Link href="/knowledge/open-source-vs-closed-ai-models">نماذج الذكاء الاصطناعي مفتوحة المصدر والمغلقة: ما الفرق؟</Link></li><li><Link href="/knowledge/small-language-models-for-business">النماذج اللغوية الصغيرة SLM: متى تكفي الشركات؟</Link></li><li><Link href="/knowledge/on-device-ai">الذكاء الاصطناعي على الجهاز: كيف يعمل ويفترق عن السحابة؟</Link></li><li><Link href="/knowledge/ai-reasoning-models">نماذج الاستدلال في الذكاء الاصطناعي: ما الذي يميزها؟</Link></li><li><Link href="/knowledge/vector-databases">قواعد البيانات المتجهية: كيف تبحث عن النصوص المتشابهة؟</Link></li></ul></section>
      <div className="shell">
        <div className="category-hero">
          <span className="article-card-tag">الأدلة</span>
          <h1>كل الأدلة</h1>
          <p>اختر دليلًا لإجراء محدد، أو افتح <Link href="/guides">مسارات المهام</Link> لرؤية الخطوات المرتبطة به.</p>
          <div className="article-meta" style={{ marginTop: 16 }}>
            <span className="article-meta-item">{publishedArticles.length} دليلًا منشورًا</span>
          </div>
        </div>

        <h2>أحدث الأدلة</h2>
        {publishedArticles.length > 0 ? (
          <div className="articles-grid">
            {publishedArticles.slice(0, 12).map(article => <ArticleCard key={article.slug} article={article} />)}
          </div>
        ) : (
          <div className="empty-state">
            <h3>جاري تجهيز الأدلة</h3>
            <p>نعمل على نشر أول الأدلة العملية قريباً.</p>
            <Link className="button button-secondary" href="/categories" style={{ marginTop: 16 }}>تصفح التصنيفات</Link>
          </div>
        )}
        <section className="article-directory-index" aria-labelledby="article-index-title">
          <h2 id="article-index-title">الفهرس الكامل حسب الموضوع</h2>
          <p>كل الأدلة المنشورة في مكان واحد. اختر الموضوع ثم المقال الذي يطابق مهمتك.</p>
          {clusters.filter(cluster => publishedArticles.some(article => article.clusterCode === cluster.code)).map(cluster => <section key={cluster.code}>
            <h3><Link href={`/categories/${cluster.slug}`}>{cluster.name}</Link><span>{publishedArticles.filter(article => article.clusterCode === cluster.code).length} دليلًا</span></h3>
            <ul>{publishedArticles.filter(article => article.clusterCode === cluster.code).map(article => <li key={article.slug}><Link href={`/articles/${article.slug}`}>{article.title}</Link></li>)}</ul>
          </section>)}
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
