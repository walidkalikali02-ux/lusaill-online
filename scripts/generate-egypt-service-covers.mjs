import sharp from "/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.cjs";
import { mkdir } from "node:fs/promises";

const items = [
  ["insurance-number-inquiry", "الرقم التأميني", "هوية • تحقق • نتيجة", "#0b5d66", "#d7f0ed"],
  ["insurance-last-period", "آخر مدة تأمينية", "جهة • بداية • نهاية", "#175b8c", "#d8e9f7"],
  ["insurance-periods-wages", "المدد والأجور", "ترتيب • مقارنة • مراجعة", "#315b7d", "#e1ebf3"],
  ["insurance-deductions-inquiry", "الاستقطاعات", "الفترة • البند • المستند", "#275f57", "#dceee9"],
  ["pension-payment-inquiry", "المعاش المنصرف", "الشهر • القيمة • المتابعة", "#6a4a7b", "#ebe0f0"],
  ["beneficiary-pensions-inquiry", "استحقاقات المستفيد", "ملف • صفة • حالة", "#7b4b62", "#f2e0e9"],
  ["insurance-purchase-duration", "شراء مدة تأمينية", "شروط • تكلفة • قرار", "#765520", "#f2e8d2"],
  ["e-invoice-self-registration", "التسجيل الذاتي", "منشأة • مفوض • صلاحية", "#155d3f", "#dcefe5"],
  ["e-invoice-digital-signature", "الختم والتوقيع", "شهادة • حماية • اختبار", "#214f75", "#dce9f3"],
  ["e-invoice-gs1-egs-codes", "أكواد GS1 و EGS", "صنف • وحدة • اعتماد", "#2f5f7a", "#dcecf4"],
  ["e-receipt-readiness", "الإيصال الإلكتروني", "فرع • جهاز • تكامل", "#4b5668", "#e3e8ef"],
  ["e-invoice-registration-errors", "أخطاء التسجيل", "رسالة • فحص • دعم", "#7b3f36", "#f3e1dd"],
  ["takaful-karama-eligibility", "شروط تكافل وكرامة", "فئة • دخل • تحقق", "#6d4d17", "#f3ead7"],
  ["takaful-karama-apply-documents", "مستندات التقديم", "أسرة • وثائق • وحدة", "#7a4a2e", "#f4e5db"],
  ["takaful-karama-inquiry-complaint", "الاستعلام والشكوى", "حالة • سبب • متابعة", "#51477b", "#e8e4f5"],
];

await mkdir("public/images/articles", { recursive: true });
for (const [slug, title, subtitle, ink, paper] of items) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${paper}"/>
    <circle cx="1040" cy="90" r="210" fill="${ink}" opacity=".08"/>
    <circle cx="170" cy="600" r="260" fill="${ink}" opacity=".06"/>
    <rect x="90" y="82" width="1020" height="466" rx="42" fill="#fff" stroke="${ink}" stroke-width="3"/>
    <rect x="950" y="142" width="92" height="92" rx="24" fill="${ink}"/>
    <path d="M976 189h40M996 169v40" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".9"/>
    <text x="1010" y="306" text-anchor="start" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="58" font-weight="700" fill="${ink}">${title}</text>
    <text x="1010" y="382" text-anchor="start" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="31" fill="#263645">${subtitle}</text>
    <path d="M300 450h600" stroke="${ink}" stroke-width="4" opacity=".2"/>
    <text x="1010" y="500" text-anchor="start" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="24" fill="#52616b">دليل لوسيل • مصدر رسمي • مراجعة 6 أكتوبر 2026</text>
    <g transform="translate(155 150)" fill="none" stroke="${ink}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
      <rect x="0" y="0" width="230" height="265" rx="28"/>
      <path d="M55 70h120M55 130h120M55 190h75"/>
      <circle cx="180" cy="210" r="58" fill="${paper}"/>
      <path d="m154 210 18 18 38-45"/>
    </g>
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 86 }).toFile(`public/images/articles/${slug}.webp`);
}
console.log(`Generated ${items.length} WebP covers`);
