export const siteConfig = {
  name: "لوسيل",
  tagline: "أدلة عربية للخدمات والحياة الرقمية",
  url: "https://www.lusaill.online",
  locale: "ar_EG",
  language: "ar",
  market: "العالم العربي",
  searchEngine: "Google",
  description:
"أدلة لوسيل للخدمات المصرية والسكن البديل والتموين والكهرباء والحياة الرقمية: خطوات واضحة، مستندات ومواعيد مهمة، ومصادر رسمية وتواريخ مراجعة لكل دليل.",
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
