import { content as shrktJnwbAldlta } from "./shrkt-jnwb-aldlta-ltwzy-alkhrba";
import type { ArticleContentOverride } from "./types";

// Add one entry per published/verified article. Each file documents its own sources and check date.
const overrides: ArticleContentOverride[] = [shrktJnwbAldlta];

export const publishedContent: Map<number, ArticleContentOverride> = new Map(
  overrides.map((override) => [override.id, override]),
);
