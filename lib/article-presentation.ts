import type { Article } from "./content";

export type EditorialPresentation = {
  kind: "digital" | "electricity" | "tax" | "documents" | "traffic" | "rights" | "finance" | "contracts" | "services";
  label: string;
  summaryHeading: string;
  stepsHeading: string;
  mistakesHeading: string;
  sourcesHeading: string;
  faqHeading: string;
  relatedHeading: string;
};

const formats: Record<EditorialPresentation["kind"], Omit<EditorialPresentation,"kind">> = {
  digital: { label: "دليل تقني لحل مشكلة", summaryHeading: "شخّص المشكلة قبل البدء", stepsHeading: "طريقة الحل والتحقق من النجاح", mistakesHeading: "أخطاء في التشخيص والإعداد", sourcesHeading: "مراجع المطوّر والوثائق التقنية", faqHeading: "حالات تقنية وأسئلة متكررة", relatedHeading: "حلول تقنية متصلة" },
  electricity: { label: "دليل مرافق وفواتير", summaryHeading: "ما تحتاج معرفته عن الحساب والفاتورة", stepsHeading: "الإجراء المناسب حسب حالة الفاتورة", mistakesHeading: "أخطاء الحساب والسداد والاستعلام", sourcesHeading: "مراجع شركات الكهرباء والجهات المختصة", faqHeading: "مشكلات الفاتورة ومتابعتها", relatedHeading: "خدمات الفواتير ذات الصلة" },
  tax: { label: "دليل ضريبي إجرائي", summaryHeading: "قبل التعامل مع المصلحة: نوع الطلب والالتزامات", stepsHeading: "خطوات المعاملة الضريبية بحسب الحالة", mistakesHeading: "أخطاء قد تؤخر معالجة الطلب", sourcesHeading: "قواعد ومراجع مصلحة الضرائب", faqHeading: "استفسارات حول الحالات الضريبية", relatedHeading: "معاملات ضريبية مرتبطة" },
  documents: { label: "دليل وثائق وخدمات مدنية", summaryHeading: "المستندات والحالة التي ينطبق عليها الإجراء", stepsHeading: "من تقديم الوثائق إلى التحقق من الاستلام", mistakesHeading: "مشكلات الأوراق والبيانات والمتابعة", sourcesHeading: "الجهات الرسمية والنصوص المرجعية", faqHeading: "حالات خاصة حول الوثيقة", relatedHeading: "وثائق ومعاملات مرتبطة" },
  traffic: { label: "دليل مرور ورخص", summaryHeading: "فئة الرخصة وشروط المعاملة", stepsHeading: "التحضير والفحص والتقديم والتحقق", mistakesHeading: "مخاطر وأخطاء شائعة في المعاملة", sourcesHeading: "النصوص والبوابات المرورية الرسمية", faqHeading: "أسئلة حسب نوع الرخصة والحالة", relatedHeading: "معاملات المرور المرتبطة" },
  rights: { label: "دليل حقوق وشكاوى", summaryHeading: "هل تنطبق هذه الحقوق على حالتك؟", stepsHeading: "التوثيق والإجراء والمتابعة", mistakesHeading: "أخطاء في الشكوى والأدلة", sourcesHeading: "مصادر قانونية ورقابية", faqHeading: "حالات حقوق المستهلك", relatedHeading: "حقوق وشكاوى متصلة" },
  finance: { label: "دليل خدمات مالية", summaryHeading: "الشروط والرسوم وحدود الاستخدام", stepsHeading: "الإجراءات والمقارنة والتحقق", mistakesHeading: "أخطاء مالية وأمنية يجب تجنبها", sourcesHeading: "المراجع المالية والجهات المنظمة", faqHeading: "أسئلة حول الرسوم والمخاطر", relatedHeading: "خدمات مالية متصلة" },
  contracts: { label: "دليل قانوني للعقود", summaryHeading: "نطاق العقد وطبيعة الحالة", stepsHeading: "فهم البنود والإجراءات والخيارات", mistakesHeading: "ثغرات الصياغة والأخطاء الشائعة", sourcesHeading: "النصوص والمراجع القانونية", faqHeading: "أسئلة قانونية شائعة", relatedHeading: "عقود ومسائل مرتبطة" },
  services: { label: "دليل خدمة عملية", summaryHeading: "ملخص الخدمة والمتطلبات", stepsHeading: "الإجراء خطوة بخطوة", mistakesHeading: "الأخطاء الشائعة", sourcesHeading: "المراجع والمصادر", faqHeading: "الأسئلة الشائعة", relatedHeading: "موضوعات مرتبطة" },
};

export function getArticlePresentation(article: Pick<Article, "slug" | "clusterCode">): EditorialPresentation {
  const slug = article.slug;
  let kind: EditorialPresentation["kind"] = "services";
  if (article.clusterCode === "H") kind = "digital";
  else if (article.clusterCode === "A") kind = "electricity";
  else if (article.clusterCode === "C") kind = "traffic";
  else if (article.clusterCode === "D") kind = "rights";
  else if (article.clusterCode === "E") kind = "finance";
  else if (article.clusterCode === "F") kind = "contracts";
  else if (article.clusterCode === "G") kind = "documents";
  else if (article.clusterCode === "B") kind = /tax|vat|e-invoice|e-receipt/i.test(slug) ? "tax" : /passport|birth|death|marriage|divorce|national-id|record|certificate|civil|consular/i.test(slug) ? "documents" : "services";
  return { kind, ...formats[kind] };
}
