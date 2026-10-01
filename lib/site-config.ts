export const siteConfig = {
  name: "لوسيل",
  tagline: "أدلة عربية للخدمات والحياة الرقمية",
  url: "https://www.lusaill.online",
  locale: "ar_EG",
  language: "ar",
  market: "العالم العربي",
  searchEngine: "Google",
  description:
"أدلة عربية للخدمات المصرية والكهرباء والحياة الرقمية وتعلم القيادة، مع خطوات واضحة وأمثلة لحل المشكلات، وروابط المصادر الرسمية وتواريخ المراجعة وحدود كل إجراء.",
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
