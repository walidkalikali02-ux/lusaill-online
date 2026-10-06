import { googleEditorGuides } from "./google-editor-guides-2026-10-03";
import { googleFormsSlidesGuides } from "./google-forms-slides-guides-2026-10-04";
import { egyptServiceGuides } from "./egypt-services-2026-10-06";
import { content as shrktJnwbAldlta } from "./shrkt-jnwb-aldlta-ltwzy-alkhrba";
import { alexandriaElectricity, northCairo, northDelta, southCairo } from "./electricity-distributors-2026-09-13";
import type { ArticleContentOverride } from "./types";
import { digitalGuides } from "./digital-guides-2026-09-24";
import { dailyGuides } from "./digital-guides-2026-09-25";
import { housingGuides } from "./housing-guides-2026-09-26";
import { rationGuides } from "./ration-guides-2026-09-27";
import { civilGuides } from "./civil-guides-2026-09-28";
import { trafficGuides } from "./traffic-guides-2026-09-29";
import { windowsGuides } from "./windows-guides-2026-10-02";
import { chromeGuides } from "./chrome-guides-2026-10-01";
import { androidGuidesA } from "./android-guides-2026-09-30-a";
import { androidGuidesB } from "./android-guides-2026-09-30-b";

// Add one entry per published/verified article. Each file documents its own sources and check date.
const overrides: ArticleContentOverride[] = [shrktJnwbAldlta, southCairo, northDelta, alexandriaElectricity, northCairo, ...digitalGuides, ...dailyGuides, ...housingGuides, ...rationGuides, ...civilGuides, ...trafficGuides, ...androidGuidesA, ...androidGuidesB, ...chromeGuides, ...windowsGuides, ...googleEditorGuides, ...googleFormsSlidesGuides, ...egyptServiceGuides];

export const publishedContent: Map<number, ArticleContentOverride> = new Map(
  overrides.map((override) => [override.id, override]),
);
