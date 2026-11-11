import { coverBatchThreeDirections } from "./cover-batch-three-directions";

/**
 * Editorial art direction for the next ten hand-reviewed covers.
 *
 * These are visual cues, NOT new requirements, official deadlines, prices,
 * or claims that an application was submitted. The source article remains
 * the authority for procedural specifics.
 */
export type CoverDirection = {
  tag: string;
  cues: readonly [string, string, string, string];
  symbol: "passport" | "refresh" | "lost" | "damaged" | "child" | "document" | "movement" | "clock" | "complaint" | "exchange" | "receipt" | "shield-check" | "shopping-bag" | "megaphone" | "wrench" | "gear" | "tax-card" | "branch" | "edit-document" | "copy-card";
  palette: "travel" | "service" | "consumer" | "commerce" | "tax";
};

export const nextTenCoverDirections: Record<string, CoverDirection> = {
  ...coverBatchThreeDirections,
  "passport-first-time-egypt": {
    tag: "جواز لأول مرة",
    cues: ["إثبات الهوية", "المستندات", "طلب الجواز", "الاستلام"],
    symbol: "passport",
    palette: "travel",
  },
  "passport-renewal-expired-full": {
    tag: "تجديد الجواز",
    cues: ["السبب", "الجواز السابق", "البيانات", "الاستلام"],
    symbol: "refresh",
    palette: "travel",
  },
  "passport-lost-inside-egypt": {
    tag: "الجواز المفقود",
    cues: ["الإبلاغ", "الهوية", "طلب البدل", "المتابعة"],
    symbol: "lost",
    palette: "service",
  },
  "passport-damaged-replacement-egypt": {
    tag: "جواز تالف",
    cues: ["فحص التلف", "حفظ الأصل", "طلب البدل", "المراجعة"],
    symbol: "damaged",
    palette: "service",
  },
  "child-passport-egypt": {
    tag: "جواز سفر الطفل",
    cues: ["شهادة الميلاد", "ولي الأمر", "الصور", "بيانات الطفل"],
    symbol: "child",
    palette: "travel",
  },
  "passport-data-certificate-egypt": {
    tag: "شهادة بيانات",
    cues: ["تحديد الغرض", "مرجع الجواز", "الطلب", "فحص الشهادة"],
    symbol: "document",
    palette: "service",
  },
  "movement-certificate-egypt": {
    tag: "شهادة التحركات",
    cues: ["الفترة", "مكان التقديم", "صفة مقدم الطلب", "الاستلام"],
    symbol: "movement",
    palette: "service",
  },
  "passport-urgent-service-egypt": {
    tag: "الجواز العاجل",
    cues: ["نوع الخدمة", "مكان التقديم", "الرسوم الرسمية", "الاستلام"],
    symbol: "clock",
    palette: "travel",
  },
  "consumer-protection-complaint-egypt": {
    tag: "حماية المستهلك",
    cues: ["طلب الحل", "توثيق المشكلة", "تقديم الشكوى", "رقم المتابعة"],
    symbol: "complaint",
    palette: "consumer",
  },
  "consumer-return-exchange-egypt": {
    tag: "الاستبدال والاسترجاع",
    cues: ["شروط الحالة", "إثبات الشراء", "طلب الإجراء", "توثيق النتيجة"],
    symbol: "exchange",
    palette: "consumer",
  },
};
