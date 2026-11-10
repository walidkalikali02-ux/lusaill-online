/**
 * Hand-curated, externally hosted photographs. Do not add search results by URL
 * alone: open the source page, verify subject, author, license, dimensions and
 * whether the pictured product applies to the instructions in the article.
 */
export type CuratedWebImage = {
  src: string;
  alt: string;
  caption: string;
  step: number;
  width: number;
  height: number;
  sourceUrl: string;
  author: string;
  license: string;
  licenseUrl: string;
};

export const curatedWebMedia: Record<string, CuratedWebImage[]> = {
  "prepaid-meter-mobile-charge": [
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Smart_prepayment_meter.jpg?width=960",
      alt: "صورة فوتوغرافية لعداد كهرباء مسبق الدفع ذكي مثبت في شقة بالمملكة المتحدة",
      caption: "مثال مصور لشكل أحد العدادات مسبقة الدفع. النموذج من المملكة المتحدة، ولا يوضح تطبيق شحن مصريًا أو يثبت توافق كارتك مع NFC؛ افحص موديل العداد والكارت وتعليمات شركة التوزيع.",
      step: 2,
      width: 960,
      height: 1280,
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Smart_prepayment_meter.jpg",
      author: "SpicyPhoto / Wikimedia Commons",
      license: "CC0 1.0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
  ],
};
