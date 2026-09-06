export const siteConfig = {
  name: "لوسيل",
  tagline: "أدلة الخدمات المصرية اليومية",
  url: "https://lusaill.online",
  locale: "ar_EG",
  language: "ar",
  market: "مصر",
  searchEngine: "Google.com.eg",
  description:
    "أدلة عملية ومحدثة للخدمات الحكومية والمرافق في مصر: فواتير الكهرباء، بوابة مصر الرقمية، رخص القيادة، حماية المستهلك، المحافظ الإلكترونية، وعقود الإيجار — رسوم ومواعيد وخطوات حقيقية مع مصدر رسمي وتاريخ مراجعة.",
  publisher: "فريق لوسيل",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
