import { guideIllustrations } from "./guide-illustrations";

// Recorded substantive edits only. Never use build/deployment time.
export const articleContentChanges: Record<string, string> = {
  "electricity-bill-inquiry": "2026-11-04", // Added a task decision table and contextual service links.
};
export function latestContentDate(...values: Array<string | undefined>): string | undefined {
  let latest: string | undefined;
  let timestamp = -Infinity;
  for (const value of values) {
    const candidate = value ? Date.parse(value) : NaN;
    if (Number.isFinite(candidate) && candidate > timestamp) {
      latest = value;
      timestamp = candidate;
    }
  }
  return latest;
}
export function getArticleModifiedAt(article: { slug?: string; updatedAt?: string; publishedAt?: string }): string | undefined {
  return latestContentDate(
    article.updatedAt,
    article.publishedAt,
    article.slug ? guideIllustrations[article.slug]?.updatedAt : undefined,
    article.slug ? articleContentChanges[article.slug] : undefined,
  );
}
