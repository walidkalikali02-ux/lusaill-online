export const siteConfig = {
  name: "شركة لوسيل",
  tagline: "المعرفة والخدمات والمشاريع الرقمية",
  url: "https://www.lusaill.online",
  locale: "ar_EG",
  language: "ar",
  market: "مصر",
  searchEngine: "Google",
  description:
"شركة لوسيل تجمع المعرفة والخدمات والمشاريع الرقمية. اكتشف موسوعة لوسيل، الكورسات، الأدلة العملية، الكاريكاتير وخدمات تصميم المواقع للأفراد والشركات.",
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
