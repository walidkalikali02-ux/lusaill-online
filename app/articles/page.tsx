import type { Metadata } from "next";
import { ArticleDirectory } from "@/components/article-directory";
import { articles, clusters } from "@/lib/content";

export const metadata: Metadata = {
  title: "كل المقالات",
  description: "خطة المئة مقال الأولى لموقع لوسيل، مرتبة حسب العنقود والشهر وحجم البحث والصعوبة.",
};

export default function ArticlesPage() {
  return (
    <main id="main-content" className="directory">
      <div className="page-hero" style={{ padding: "50px 0 30px" }}>
        <div className="shell">
          <span className="eyebrow">{articles.length} مقالاً في الخطة</span>
          <h1 style={{ margin: "10px 0 14px", fontSize: "clamp(30px, 4.6vw, 46px)" }}>دليل خطة المقالات</h1>
          <p style={{ color: "var(--muted)", maxWidth: 640 }}>كل صف هنا هو ملف تحرير: الكلمة المستهدفة، الحجم، الصعوبة، والحالة. اضغط على أي مقال لرؤية القالب التحريري الكامل قبل الكتابة.</p>
        </div>
      </div>
      <div className="shell" style={{ paddingTop: 30 }}>
        <ArticleDirectory articles={articles} clusters={clusters} />
      </div>
    </main>
  );
}
