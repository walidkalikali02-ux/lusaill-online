import type { Metadata } from "next";
import { ClusterCard } from "@/components/cluster-card";
import { clusters } from "@/lib/content";

export const metadata: Metadata = {
  title: "العناقيد",
  description: "عناقيد الكلمات المفتاحية السبعة لخطة لوسيل: فواتير الكهرباء، بوابة مصر الرقمية، رخص القيادة، حماية المستهلك، المحافظ الإلكترونية، عقود الإيجار، والسجل المدني.",
};

export default function ClustersPage() {
  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">خريطة الخطة</span>
        <h1>عناقيد الكلمات المفتاحية</h1>
        <p className="text-lead">أكثر من مليون بحث شهري بصعوبة منخفضة. كل عنقود يبدأ بصفحة ركيزة ثم يتفرع إلى صفحات دقيقة لكل نية بحث.</p>
        <div className="cluster-grid">
          {clusters.map((cluster) => <ClusterCard cluster={cluster} key={cluster.slug} />)}
        </div>
      </div>
    </main>
  );
}
