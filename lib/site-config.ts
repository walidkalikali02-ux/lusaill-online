export const siteConfig = {
  name: "لوسيل",
  tagline: "أدلة عملية للخدمات المصرية",
  url: "https://www.lusaill.online",
  locale: "ar_EG",
  language: "ar",
  market: "مصر",
  searchEngine: "Google",
  description:
"لوسيل يقدم أدلة عملية مستقلة للخدمات المصرية: فواتير الكهرباء، السجل المدني، المرور والتموين ومصر الرقمية، مع خطوات واضحة وروابط للمصادر الرسمية. ويضم أقسامًا معرفية أخرى.",
  publisher: "فريق لوسيل",
  owner: "Oualid Aisbouya",
  editorialEmail: "waisbouya@gmail.com",
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
  alt: "لوسيل — موسوعة عربية متعددة المجالات",
};
