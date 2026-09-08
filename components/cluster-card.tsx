import Link from "next/link";
import type { Cluster } from "@/lib/clusters";
import { clusterProgress } from "@/lib/content";

const priorityLabel = { 1: "أولوية ١", 2: "أولوية ٢", 3: "أولوية ٣" } as const;

export function ClusterCard({ cluster }: { cluster: Cluster }) {
  const progress = clusterProgress(cluster.slug);
  return (
    <Link className="cluster-card" href={`/categories/${cluster.slug}`} style={{ "--c": cluster.color } as React.CSSProperties}>
      <div className="cluster-top">
        <span className="cluster-code">العنقود {cluster.code} · الشهر {cluster.months}</span>
        <span className="priority-badge">{priorityLabel[cluster.priority]}</span>
      </div>
      <h3>{cluster.name}</h3>
      <p>{cluster.description}</p>
      <div className="cluster-meta">
        <span><b>{progress.total}</b> مقالاً</span>
        <span>{progress.published}/{progress.total} منشور</span>
        <span>KD {cluster.kdRange[0]}–{cluster.kdRange[1]}</span>
      </div>
    </Link>
  );
}
