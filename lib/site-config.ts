export const siteConfig = {
  name: "لوسيل",
  tagline: "موسوعة عربية للخدمات والإجراءات الحكومية",
  url: "https://www.lusaill.online",
  locale: "ar_EG",
  language: "ar",
  market: "العالم العربي",
  searchEngine: "Google",
  description:
    "موسوعة عربية شاملة للخدمات والإجراءات الحكومية: فواتير الكهرباء، بوابة مصر الرقمية، رخص القيادة، حماية المستهلك، المحافظ الإلكترونية، وعقود الإيجار — رسوم ومواعيد وخطوات حقيقية مع مصدر رسمي وتاريخ مراجعة لكل معلومة.",
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
