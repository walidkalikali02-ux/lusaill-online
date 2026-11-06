export const siteConfig = {
  name: "لوسيل",
  tagline: "موسوعة عربية شاملة للمعرفة",
  url: "https://www.lusaill.online",
  locale: "ar_EG",
  language: "ar",
  market: "العالم العربي",
  searchEngine: "Google",
  description:
"لوسيل موسوعة عربية متعددة المجالات تقدم مقالات ومعارف وأدلة في العلوم والصحة والتعليم والتقنية والحياة اليومية والخدمات، بمصادر واضحة وأدوات عملية، وتتوسع باستمرار.",
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
