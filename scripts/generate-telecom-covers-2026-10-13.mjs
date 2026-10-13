import sharp from "sharp";

const cards = [
  ["fixed-internet-provider-switch", "نقل الإنترنت الأرضي", "إلغاء", "رقم مرجعي", "تشغيل", "#245b78"],
  ["fixed-internet-outage-compensation", "تعويض انقطاع الإنترنت", "بلاغ", "توثيق", "تعويض", "#8a4f2d"],
  ["internet-speed-test-myntra", "اختبار سرعة الإنترنت", "تهيئة", "قياس", "مقارنة", "#286b63"],
  ["mobile-network-quality-map", "خريطة جودة الشبكات", "موقع", "قياسات", "قرار", "#5b4d91"],
  ["authorized-telecom-outlets", "المنافذ المعتمدة", "بحث", "تحقق", "زيارة", "#3d6b45"],
  ["lost-sim-card", "الشريحة المفقودة", "إيقاف", "حماية", "استبدال", "#8b3c58"],
  ["wifi-calling-egypt", "مكالمات Wi-Fi", "توافق", "تفعيل", "اختبار", "#41628a"],
  ["telecom-user-rights", "حقوق مستخدم الاتصالات", "شروط", "فاتورة", "شكوى", "#80572d"],
];

for (const [slug, title, a, b, c, color] of cards) {
  const labels = [a, b, c];
  const boxes = labels.map((label, i) => `<rect x="${815 - i * 285}" y="245" width="225" height="145" rx="20" fill="#fff" stroke="${color}" stroke-width="3"/><circle cx="${928 - i * 285}" cy="350" r="24" fill="${color}"/><text x="${928 - i * 285}" y="358" text-anchor="middle" font-size="22" fill="#fff">${i + 1}</text><text x="${928 - i * 285}" y="300" text-anchor="middle" font-family="Calibri,Arial" font-size="25" fill="#263238">${label}</text>${i < 2 ? `<text x="${790 - i * 285}" y="330" font-size="38" fill="${color}">←</text>` : ""}`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f3f7f8"/><path d="M0 520 Q260 470 520 530 T1200 500 V630 H0Z" fill="#e1eaed"/><text x="1100" y="110" text-anchor="end" font-family="Calibri,Arial" font-weight="700" font-size="48" fill="${color}">${title}</text><text x="1100" y="160" text-anchor="end" font-family="Calibri,Arial" font-size="24" fill="#455a64">دليل عملي موثق من الجهاز القومي لتنظيم الاتصالات</text>${boxes}<text x="1100" y="475" text-anchor="end" font-family="Calibri,Arial" font-size="22" fill="${color}">احتفظ برقم الطلب ولا تشارك رمز التحقق</text><text x="1100" y="570" text-anchor="end" font-family="Calibri,Arial" font-size="16" fill="#607d8b">رسم إرشادي أصلي من لوسيل • لا يمثل واجهة رسمية</text></svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(`public/images/articles/${slug}.webp`);
}

console.log(`Generated ${cards.length} original telecom covers`);
