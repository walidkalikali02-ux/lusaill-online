export const siteConfig = {
  name: "لوسيل",
  tagline: "موسوعة عربية للخدمات والإجراءات الحكومية",
  url: "https://www.lusaill.online",
  locale: "ar_EG",
  language: "ar",
  market: "العالم العربي",
  searchEngine: "Google",
  description:
    "أدلة عربية عملية لخدمات الكهرباء والحياة الرقمية، مع كورس لتعلم القيادة. خطوات واضحة وأمثلة لحل المشكلات وروابط للمصادر الرسمية وتاريخ مراجعة ظاهر.",
  publisher: "فريق لوسيل",
  geo: {
    region: "",
    placename: "",
    icbm: "",
  },
  verification: {
    google: "",
    bing: "",
  },
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export const siteSocialImage = {
  url: absoluteUrl("/opengraph-image"),
  width: 1200,
  height: 630,
  alt: "لوسيل — أدلة عربية عملية موثقة",
};
