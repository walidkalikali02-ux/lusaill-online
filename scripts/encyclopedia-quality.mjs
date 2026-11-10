#!/usr/bin/env node
/**
 * Strict QA for research-enriched content. Does not pad text or certify live service execution.
 * Keep each longform dataset JSON-serializable so the editorial test is deterministic.
 */
import fs from "node:fs";
import path from "node:path";

function readRegistry(pathname, startMarker, endMarker) {
  const source = fs.readFileSync(pathname, "utf8");
  const from = source.indexOf(startMarker);
  const until = source.lastIndexOf(endMarker);
  if (from < 0 || until <= from) throw new Error("Editorial content registry could not be parsed: " + pathname);
  return JSON.parse(source.slice(from + startMarker.length, until));
}

const registry = readRegistry(
  "lib/encyclopedic-content.ts",
  "export const encyclopedicContent: Record<string, EncyclopedicContent> = ",
  ";\nconst electricityReferenceExpansions",
);
const supplemental = [
  ["upper-egypt-electricity", "lib/electricity-upper-reference.ts", "upperEgyptElectricityExpansion"],
  ["beheira-electricity", "lib/electricity-beheira-reference.ts", "beheiraElectricityExpansion"],
  ["south-delta-electricity", "lib/electricity-south-delta-reference.ts", "southDeltaElectricityExpansion"],
  ["code-electricity-meter", "lib/electricity-code-reference.ts", "codeElectricityMeterExpansion"],
  ["electricity-complaint", "lib/electricity-complaint-reference.ts", "electricityComplaintExpansion"],
  ["chrome-reset-settings", "lib/chrome-reset-reference.ts", "chromeResetReference"],
  ["chrome-bookmarks-transfer", "lib/chrome-bookmarks-reference.ts", "chromeBookmarksReference"],
  ["chrome-separate-profiles", "lib/chrome-profiles-reference.ts", "chromeProfilesReference"],
  ["work-permit-abroad", "lib/consular-work-permit-reference.ts", "workPermitAbroadReference"],
  ["consular-power-of-attorney", "lib/consular-poa-reference.ts", "consularPowerOfAttorneyReference"],
  ["prepaid-meter-mobile-charge", "lib/prepaid-meter-mobile-reference.ts", "prepaidMeterMobileReference"],
  ["birth-certificate-abroad", "lib/consular-birth-certificate-reference.ts", "birthCertificateAbroadReference"],
  ["national-id-renewal-abroad", "lib/consular-national-id-reference.ts", "nationalIdRenewalAbroadReference"],
  ["newborn-passport-abroad", "lib/consular-newborn-passport-reference.ts", "newbornPassportAbroadReference"],
  ["newborn-travel-document", "lib/consular-temporary-travel-reference.ts", "newbornTravelDocumentReference"],
  ["consular-document-attestation", "lib/consular-attestation-reference.ts", "consularAttestationReference"],
  ["criminal-record-abroad", "lib/consular-criminal-record-reference.ts", "criminalRecordAbroadReference"],
  ["android-backup-check", "lib/android-backup-check-reference.ts", "androidBackupCheckReference"],
  ["android-restore-contacts", "lib/android-contacts-restore-reference.ts", "androidContactsRestoreReference"],
  ["google-photos-free-device-space", "lib/android-google-photos-space-reference.ts", "googlePhotosSpaceReference"],
  ["marriage-no-objection-certificate", "lib/consular-marriage-no-objection-reference.ts", "marriageNoObjectionReference"],
  ["marriage-at-egyptian-mission", "lib/consular-marriage-at-mission-reference.ts", "marriageAtMissionReference"],
  ["foreign-marriage-ratification", "lib/consular-foreign-marriage-ratification-reference.ts", "foreignMarriageRatificationReference"],
  ["foreign-nationality-permission", "lib/foreign-nationality-permission-reference.ts", "foreignNationalityPermissionReference"],
  ["egyptian-nationality-foreign-wife", "lib/egyptian-nationality-foreign-wife-reference.ts", "egyptianNationalityForeignWifeReference"],
  ["palestinian-egyptian-travel-document", "lib/palestinian-egyptian-travel-reference.ts", "palestinianEgyptianTravelReference"],
];
for (const [slug, pathname, name] of supplemental) {
  if (registry[slug]) throw new Error("Duplicate encyclopedia slug: " + slug);
  registry[slug] = readRegistry(pathname, "export const " + name + ": EncyclopedicContent = ", ";\n");
}

let bad = 0;
for (const [slug, article] of Object.entries(registry)) {
  const body = article.sections.flatMap(section => [section.title, ...section.paragraphs, ...(section.bullets ?? [])]).join(" ");
  const words = body.trim().split(/\s+/u).filter(Boolean).length;
  const chapters = article.sections?.length ?? 0;
  const officialSources = new Set(article.sources?.map(source => source.url) ?? []);
  const cited = new Set(article.sections.flatMap(section => section.sourceUrls ?? []));
  const duplicateIds = new Set(article.sections.map(section => section.id)).size !== chapters;
  const missingCitations = [...cited].filter(url => !officialSources.has(url));
  const invalidSources = article.sources.some(source => !/^https:\/\//.test(source.url) || !/^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt));
  const illustrations = article.sections.flatMap(section => section.illustration ? [section.illustration] : []);
  const brokenIllustrations = illustrations.map(illustration => illustration.src).filter(src => !src.startsWith("/") || !fs.existsSync(path.join("public", src.slice(1))));
  const inaccessibleImages = illustrations.filter(illustration => !illustration.alt || illustration.alt.trim().length < 30);
  const emptyParagraphs = article.sections.some(section => section.paragraphs.length < 2 || section.paragraphs.some(paragraph => paragraph.trim().length < 80));
  const valid = words >= 1000 && chapters >= 5 && officialSources.size >= 3 && !duplicateIds &&
    !missingCitations.length && !invalidSources && !brokenIllustrations.length && !inaccessibleImages.length && !emptyParagraphs;
  console.log((valid ? "PASS" : "FAIL") + " " + slug + ": " + words + " words, " + chapters + " chapters, " + officialSources.size + " sources, " + brokenIllustrations.length + " missing assets");
  if (!valid) {
    bad++;
    console.error(JSON.stringify({slug, duplicateIds, missingCitations, invalidSources, brokenIllustrations, inaccessibleImages, emptyParagraphs}));
  }
}
// Higher-risk editorial routes must keep their legal distinctions and primary sources.
// These checks catch accidental deletion or replacement with generic text; they do not
// certify that laws, fees or eligibility rules remain current.
const sensitiveRoutes = [
  {
    slug: "foreign-nationality-permission",
    official: "https://www.mfa.gov.eg/ar/ConsularServicesAndTransactions/Details/98",
    required: ["الاحتفاظ", "عدم الاحتفاظ", "قرار", "المركز القانوني"],
  },
  {
    slug: "egyptian-nationality-foreign-wife",
    official: "https://www.mfa.gov.eg/ar/ConsularServicesAndTransactions/Details/92",
    required: ["إعلان الرغبة", "سنتين", "ستة أشهر", "الحياة الزوجية"],
  },
  {
    slug: "palestinian-egyptian-travel-document",
    official: "https://www.mfa.gov.eg/ar/ConsularServicesAndTransactions/Details/90",
    required: ["ثلاثة أشهر", "12", "16", "وثيقة", "الفلسطينية"],
    localSource: "https://cs.mfa.gov.eg/ar/QAT/transaction-fees",
    localTerms: ["610", "قطر", "وثيقة سفر مصرية", "وثيقة سفر فلسطينية"],
  },
];
for (const rule of sensitiveRoutes) {
  const article = registry[rule.slug];
  const body = article ? JSON.stringify(article.sections) : "";
  const officialLinked = article?.sources?.some(source => source.url === rule.official)
    && article.sections.some(section => section.sourceUrls?.includes(rule.official));
  const missingTerms = rule.required.filter(term => !body.includes(term));
  const localLinked = !rule.localSource || (
    article?.sources?.some(source => source.url === rule.localSource)
    && article.sections.some(section => section.sourceUrls?.includes(rule.localSource))
    && rule.localTerms.every(term => body.includes(term))
  );
  if (!article || !officialLinked || missingTerms.length || !localLinked) {
    bad++;
    console.error("FAIL legal-route-qa " + JSON.stringify({
      slug: rule.slug, present: !!article, officialLinked: !!officialLinked,
      missingTerms, localLinked: !!localLinked,
    }));
  } else {
    console.log("PASS legal-route-qa " + rule.slug);
  }
}
console.log("Quality-reviewed longform articles: " + Object.keys(registry).length);
if (bad) process.exitCode = 1;
