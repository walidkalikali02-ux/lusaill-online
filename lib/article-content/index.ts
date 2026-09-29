import { content as shrktJnwbAldlta } from "./shrkt-jnwb-aldlta-ltwzy-alkhrba";
import { alexandriaElectricity, northCairo, northDelta, southCairo } from "./electricity-distributors-2026-09-13";
import type { ArticleContentOverride } from "./types";
import { digitalGuides } from "./digital-guides-2026-09-24";
import { dailyGuides } from "./digital-guides-2026-09-25";
import { housingGuides } from "./housing-guides-2026-09-26";
import { rationGuides } from "./ration-guides-2026-09-27";
import { civilGuides } from "./civil-guides-2026-09-28";
import { trafficGuides } from "./traffic-guides-2026-09-29";

// Add one entry per published/verified article. Each file documents its own sources and check date.
const overrides: ArticleContentOverride[] = [shrktJnwbAldlta, southCairo, northDelta, alexandriaElectricity, northCairo, ...digitalGuides, ...dailyGuides, ...housingGuides, ...rationGuides, ...civilGuides, ...trafficGuides];

export const publishedContent: Map<number, ArticleContentOverride> = new Map(
  overrides.map((override) => [override.id, override]),
);
