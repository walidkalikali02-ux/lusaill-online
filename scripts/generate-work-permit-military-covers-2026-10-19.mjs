import sharp from "sharp";

const covers = [
  ["work-permit-first-time-egypt", "تصريح عمل", "أول مرة", "بيانات • مراجعة • متابعة"],
  ["work-permit-renewal-egypt", "تجديد تصريح العمل", "مطابقة التصريح السابق", "تجديد • دفع • متابعة"],
  ["work-permit-lost-replacement", "بدل فاقد", "تصريح العمل", "حماية • طلب • مراجعة"],
  ["work-permit-clearance-egypt", "مخالصة تصريح العمل", "حدد الغرض أولًا", "طلب • نطاق • تسليم"],
  ["seasonal-work-permit-egypt", "تصريح عمل موسمي", "الفترة ونوع العمل", "تحقق • تقديم • متابعة"],
  ["conscript-travel-permit-egypt", "تصريح السفر", "طلب ثم تحميل", "دراسة • دفع • تنزيل"],
  ["military-service-certificate-replacement", "بدل فاقد الشهادة", "إنهاء الخدمة", "هوية • طلب • استلام"],
  ["military-service-experience-certificate", "شهادة الخبرة", "شؤون المجندين", "غرض • طلب • مراجعة"],
];

for (const [slug, title, subtitle, steps] of covers) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#082f49"/><stop offset="1" stop-color="#155e75"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/><circle cx="1020" cy="110" r="210" fill="#22d3ee" opacity=".12"/><circle cx="120" cy="560" r="230" fill="#fbbf24" opacity=".1"/>
  <rect x="92" y="82" width="1016" height="466" rx="34" fill="#fff" opacity=".97"/>
  <g transform="translate(930 150)"><rect x="0" y="0" width="110" height="142" rx="12" fill="#cffafe" stroke="#0e7490" stroke-width="6"/><path d="M22 38h66M22 65h66M22 92h44" stroke="#0e7490" stroke-width="8" stroke-linecap="round"/><circle cx="22" cy="118" r="9" fill="#f59e0b"/></g>
  <text x="850" y="190" text-anchor="end" font-family="Calibri,Arial,sans-serif" font-size="64" font-weight="700" fill="#0f172a">${title}</text>
  <text x="850" y="275" text-anchor="end" font-family="Calibri,Arial,sans-serif" font-size="42" fill="#0e7490">${subtitle}</text>
  <rect x="196" y="340" width="808" height="92" rx="46" fill="#ecfeff" stroke="#67e8f9" stroke-width="3"/>
  <text x="600" y="400" text-anchor="middle" font-family="Calibri,Arial,sans-serif" font-size="32" font-weight="700" fill="#164e63">${steps}</text>
  <text x="1020" y="510" text-anchor="end" font-family="Calibri,Arial,sans-serif" font-size="24" fill="#475569">دليل تحريري أصلي • راجع القناة الرسمية</text>
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(`public/images/articles/${slug}.webp`);
}
