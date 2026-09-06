import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { clusters, getCluster, getClusterArticles, clusterProgress } from "@/lib/content";
import { StatusBadge } from "@/components/status-badge";
import type { ArticleGroup } from "@/lib/articles-data";

export function generateStaticParams() {
  return clusters.map((cluster) => ({ slug: cluster.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cluster = getCluster(slug);
  if (!cluster) return {};
  return { title: cluster.name, description: cluster.description, alternates: { canonical: `/clusters/${cluster.slug}` } };
}

const groupLabels: Record<ArticleGroup, string> = {
  pillar: "الركيزة",
  distributors: "صفحات شركات التوزيع",
  payments: "صفحات الدفع والسداد",
  core: "المقالات",
  bonus: "محتوى إضافي (الشهر ٦)",
};

export default async function ClusterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cluster = getCluster(slug);
  if (!cluster) notFound();

  const items = getClusterArticles(cluster.slug);
  const progress = clusterProgress(cluster.slug);
  const groups = Array.from(new Set(items.map((item) => item.group))) as ArticleGroup[];

  return (
    <main id="main-content" className="category-page">
      <div className="shell">
        <div className="breadcrumbs">
          <Link href="/">الرئيسية</Link><span>/</span>
          <Link href="/clusters">العناقيد</Link><span>/</span>
          <span>{cluster.name}</span>
        </div>
        <div className="category-hero" style={{ borderTopColor: cluster.color }}>
          <div>
            <strong style={{ color: cluster.color }}>العنقود {cluster.code} · الشهر {cluster.months}</strong>
            <h1>{cluster.name}</h1>
            <p>{cluster.description}</p>
          </div>
          <div>
            <div className="category-method"><span>المنهج</span><p>{cluster.approach}</p></div>
            <div className="category-method"><span>الحجم التقريبي</span><p>~{cluster.approxMonthlyVolume.toLocaleString("ar-EG")} بحث شهريًا</p></div>
            <div className="category-method"><span>نطاق الصعوبة</span><p>KD {cluster.kdRange[0]}–{cluster.kdRange[1]}</p></div>
            <div className="category-method"><span>التقدم</span><p>{progress.published} من {progress.total} منشور</p></div>
          </div>
        </div>

        {groups.map((group) => (
          <div key={group} style={{ marginTop: 44 }}>
            <h2 style={{ fontSize: 20, marginBottom: 14 }}>{groupLabels[group]}</h2>
            <table className="article-table">
              <thead>
                <tr><th>#</th><th>المقال</th><th>الكلمة الأساسية</th><th>الحجم</th><th>KD</th><th>الحالة</th></tr>
              </thead>
              <tbody>
                {items.filter((item) => item.group === group).map((item) => (
                  <tr key={item.slug}>
                    <td className="num">{item.id}</td>
                    <td><Link href={`/articles/${item.slug}`}>{item.title}</Link></td>
                    <td className="kw">{item.keyword}</td>
                    <td className="num">{item.volume.toLocaleString("ar-EG")}</td>
                    <td className="num">{item.kd ?? "—"}</td>
                    <td><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </main>
  );
}
