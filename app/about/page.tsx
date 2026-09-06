import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { overallProgress, clusters } from "@/lib/content";

export const metadata: Metadata = {
  title: "عن لوسيل",
  description: "لوسيل موقع عربي يشرح الخدمات الحكومية والمرافق في مصر بدقة، مع مصدر رسمي وتاريخ مراجعة لكل معلومة.",
};

export default function AboutPage() {
  const progress = overallProgress();
  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">عن المشروع</span>
        <h1>لوسيل — أدلة الخدمات المصرية اليومية</h1>
        <p className="text-lead">
          {siteConfig.description} نستهدف السوق المصري عبر {siteConfig.searchEngine}، ونبني كل صفحة حول قيمة يفشل
          الموقع الرسمي في تقديمها للزائر: رابط مباشر، خطوات مصوّرة، أرقام دعم، وحل للأعطال الشائعة.
        </p>
        <div className="text-grid">
          <section>
            <span>الهدف</span>
            <h2>١٠٠ ألف زائر شهريًا خلال ٦ أشهر</h2>
            <p>عبر {clusters.length} عناقيد كلمات مفتاحية تغطي أكثر من مليون بحث شهري بصعوبة منخفضة في السوق المصري.</p>
          </section>
          <section>
            <span>الحالة الآن</span>
            <h2>{progress.corePublished} من {progress.coreTotal} مقالاً منشورًا</h2>
            <p>كل مقال يمر بمرحلة تحقق ميداني من المصدر الرسمي قبل النشر — راجع سياسة التحرير لتفاصيل المعيار.</p>
          </section>
        </div>
        <div className="text-cta">
          <div>
            <strong>محتوى إرشادي عام</strong>
            <p>لا يغني عن مراجعة الجهة الرسمية المختصة قبل اتخاذ أي إجراء رسمي أو مالي.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
