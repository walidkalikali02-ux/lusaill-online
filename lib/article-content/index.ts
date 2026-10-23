import { consumerProtectionGuidesOct21 } from "./consumer-protection-2026-10-21";
import { taxRegistrationGuidesOct22 } from "./tax-registration-2026-10-22";
import { consularGuides } from "./consular-guides-2026-10-07";
import { consularGuidesOct8 } from "./consular-guides-2026-10-08";
import { electricityCompanyGuidesOct9 } from "./electricity-companies-2026-10-09";
import { electricityProcedureGuidesOct10 } from "./electricity-procedures-2026-10-10";
import { electricityConsumerGuidesOct11 } from "./electricity-consumer-2026-10-11";
import { electricityPlatformGuidesA } from "./electricity-platform-guides-a-2026-10-23";
import { electricityPlatformGuidesB } from "./electricity-platform-guides-b-2026-10-23";
import { electricityPlatformGuidesC } from "./electricity-platform-guides-c-2026-10-23";
import { electricityPlatformGuidesD } from "./electricity-platform-guides-d-2026-10-23";
import { telecomGuidesOct12 } from "./telecom-services-2026-10-12";
import { telecomGuidesOct13 } from "./telecom-services-2026-10-13";
import { telecomGuidesOct14 } from "./telecom-services-2026-10-14";
import { drivingLicenseGuidesOct15 } from "./driving-license-2026-10-15";
import { civilStatusGuidesOct16 } from "./civil-status-2026-10-16";
import { civilStatusGuidesOct17 } from "./civil-status-2026-10-17";
import { civilStatusGuidesOct18 } from "./civil-status-2026-10-18";
import { workPermitMilitaryGuidesOct19 } from "./work-permits-military-2026-10-19";
import { passportGuidesOct20 } from "./passport-guides-2026-10-20";
import { googleEditorGuides } from "./google-editor-guides-2026-10-03";
import { googleFormsSlidesGuides } from "./google-forms-slides-guides-2026-10-04";
import { egyptServiceGuides } from "./egypt-services-2026-10-06";
import { electricityKeywordGuides } from "./electricity-keywords-2026-10-06";
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
const overrides: ArticleContentOverride[] = [...taxRegistrationGuidesOct22, ...consumerProtectionGuidesOct21, ...passportGuidesOct20, ...workPermitMilitaryGuidesOct19, ...civilStatusGuidesOct18, ...civilStatusGuidesOct17, ...civilStatusGuidesOct16, ...drivingLicenseGuidesOct15, ...telecomGuidesOct14, ...telecomGuidesOct13, ...telecomGuidesOct12, ...electricityConsumerGuidesOct11, ...electricityPlatformGuidesA, ...electricityPlatformGuidesB, ...electricityPlatformGuidesC, ...electricityPlatformGuidesD, ...electricityProcedureGuidesOct10, ...electricityCompanyGuidesOct9, ...consularGuidesOct8, ...consularGuides, ...electricityKeywordGuides, ...digitalGuides, ...dailyGuides, ...housingGuides, ...rationGuides, ...civilGuides, ...trafficGuides, ...androidGuidesA, ...androidGuidesB, ...chromeGuides, ...windowsGuides, ...googleEditorGuides, ...googleFormsSlidesGuides, ...egyptServiceGuides];

export const publishedContent: Map<number, ArticleContentOverride> = new Map(
  overrides.map((override) => [override.id, override]),
);
