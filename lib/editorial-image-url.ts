export type EditorialImageKind = "articles" | "knowledge" | "food-safety";
export type EditorialImageView = "cover" | "map";

/** Stable, topic-specific PNG asset URLs rather than a shared site logo. */
export function editorialImagePath(kind: EditorialImageKind, slug: string, view: EditorialImageView = "cover") {
  return "/api/editorial-image/" + kind + "/" + encodeURIComponent(slug) + "/" + view;
}
