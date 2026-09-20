import Link from "next/link";
import type { Cluster } from "@/lib/clusters";
import { clusterProgress } from "@/lib/content";

const icons: Record<string, string> = {
  A: "⚡",
  B: "🏛",
  C: "🚗",
  D: "🛡",
  E: "💳",
  F: "📄",
  G: "📋",
};

export function ClusterCard({ cluster }: { cluster: Cluster }) {
  const progress = clusterProgress(cluster.slug);

  return (
    <Link className="cluster-card" href={`/categories/${cluster.slug}`}>
      <div className="cluster-top">
        <span className="cluster-num">{cluster.code}</span>
        <span className="cluster-icon">{icons[cluster.code] || "📖"}</span>
      </div>
      <h3>{cluster.name}</h3>
      <p>{cluster.description}</p>
      <div className="cluster-footer">
        <span className="cluster-count">{progress.published} دليل منشور</span>
        <span className="cluster-arrow">←</span>
      </div>
    </Link>
  );
}
