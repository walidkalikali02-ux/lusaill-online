import { content as shrktJnwbAldlta } from "./shrkt-jnwb-aldlta-ltwzy-alkhrba";
import { alexandriaElectricity, northCairo, northDelta, southCairo } from "./electricity-distributors-2026-09-13";
import type { ArticleContentOverride } from "./types";

// Add one entry per published/verified article. Each file documents its own sources and check date.
const overrides: ArticleContentOverride[] = [shrktJnwbAldlta, southCairo, northDelta, alexandriaElectricity, northCairo];

export const publishedContent: Map<number, ArticleContentOverride> = new Map(
  overrides.map((override) => [override.id, override]),
);
