import type { CoverDirection } from "./next-ten-cover-directions";

/** Third reviewed batch. Cues are derived from the article's actual step headings,
 * and must never be taken as a replacement for dated official instructions. */
export const coverBatchThreeDirections: Record<string, CoverDirection> = {
  "consumer-invoice-rights-egypt": {
    tag: "فاتورة الشراء", cues: ["بيانات المورد", "السعر والتاريخ", "مواصفات المنتج", "نسخة محفوظة"],
    symbol: "receipt", palette: "consumer",
  },
  "product-warranty-repair-egypt": {
    tag: "الضمان والصيانة", cues: ["شهادة الضمان", "مركز الخدمة", "إيصال الإصلاح", "اختبار المنتج"],
    symbol: "shield-check", palette: "consumer",
  },
  "online-shopping-consumer-rights-egypt": {
    tag: "التسوق الإلكتروني", cues: ["هوية البائع", "السعر والتسليم", "دفع موثوق", "فحص الشحنة"],
    symbol: "shopping-bag", palette: "commerce",
  },
  "misleading-ad-complaint-egypt": {
    tag: "الإعلان المضلل", cues: ["نسخة الإعلان", "إثبات التضليل", "طلب تصحيح", "بلاغ رسمي"],
    symbol: "megaphone", palette: "commerce",
  },
  "authorized-service-center-egypt": {
    tag: "الصيانة المعتمدة", cues: ["الاسم والعلامة", "الوكيل والعنوان", "إيصال الاستلام", "بيان الإصلاح"],
    symbol: "wrench", palette: "consumer",
  },
  "product-lifetime-spare-parts-egypt": {
    tag: "قطع الغيار", cues: ["مدة الاستخدام", "العمر والضمان", "توافر القطع", "التوثيق"],
    symbol: "gear", palette: "consumer",
  },
  "tax-card-first-time-egypt": {
    tag: "البطاقة الضريبية", cues: ["الكيان والنشاط", "الأوراق", "التسجيل", "استلام البطاقة"],
    symbol: "tax-card", palette: "tax",
  },
  "simplified-tax-registration-egypt": {
    tag: "تسجيل مبسط", cues: ["أهلية المسار", "سبب التسجيل", "الهوية", "نتيجة الطلب"],
    symbol: "branch", palette: "tax",
  },
  "tax-registration-data-update": {
    tag: "تعديل التسجيل", cues: ["الحقل المتغير", "المستندات", "طلب التعديل", "النسخة المعدلة"],
    symbol: "edit-document", palette: "tax",
  },
  "tax-card-lost-damaged-replacement": {
    tag: "بدل فاقد ضريبي", cues: ["سبب الطلب", "المحضر أو الأصل", "الهوية والسجل", "استلام البدل"],
    symbol: "copy-card", palette: "tax",
  },
};
