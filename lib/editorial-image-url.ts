import { nextTenCoverDirections } from "@/lib/next-ten-cover-directions";
import { coverBatchThreeDirections } from "@/lib/cover-batch-three-directions";

export type EditorialImageKind = "articles" | "knowledge" | "food-safety";
export type EditorialImageView = "cover" | "map";

/** Stable, topic-specific PNG asset URLs rather than a shared site logo. */
export function editorialImagePath(kind: EditorialImageKind, slug: string, view: EditorialImageView = "cover") {
  const path = "/api/editorial-image/" + kind + "/" + encodeURIComponent(slug) + "/" + view;
  // The revised composition must bypass week-long CDN caching of older covers.
  if (kind === "articles" && view === "cover" && slug in coverBatchThreeDirections) return path + "?v=20261111-b03";
  return kind === "articles" && view === "cover" && slug in nextTenCoverDirections ? path + "?v=20261111-3" : path;
}
