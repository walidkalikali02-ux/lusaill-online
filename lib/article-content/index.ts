import { content as shrktJnwbAldlta } from "./shrkt-jnwb-aldlta-ltwzy-alkhrba";
import { alexandriaElectricity, northCairo, northDelta, southCairo } from "./electricity-distributors-2026-09-13";
import type { ArticleContentOverride } from "./types";
import { digitalGuides } from "./digital-guides-2026-09-24";

// Add one entry per published/verified article. Each file documents its own sources and check date.
const overrides: ArticleContentOverride[] = [shrktJnwbAldlta, southCairo, northDelta, alexandriaElectricity, northCairo, ...digitalGuides];

export const publishedContent: Map<number, ArticleContentOverride> = new Map(
  overrides.map((override) => [override.id, override]),
);
