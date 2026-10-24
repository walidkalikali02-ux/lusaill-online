import sharp from "sharp";

const covers = [
  ["passport-first-time-egypt", "جواز سفر أول مرة", "هوية • نموذج • مراجعة"],
  ["passport-renewal-expired-full", "تجديد جواز السفر", "منتهي أو ممتلئ"],
  ["passport-lost-inside-egypt", "بدل فاقد الجواز", "إبلاغ • إلغاء • بدل"],
  ["passport-damaged-replacement-egypt", "بدل تالف الجواز", "حفظ • تقديم • فحص"],
  ["child-passport-egypt", "جواز سفر الطفل", "وثيقة مستقلة"],
  ["passport-data-certificate-egypt", "شهادة بيانات الجواز", "غرض • طلب • مراجعة"],
  ["movement-certificate-egypt", "شهادة التحركات", "فترة • توكيل • استلام"],
  ["passport-urgent-service-egypt", "الجواز العاجل والمميز", "المدة • المكان • الرسوم"],
];

for (const [slug, title, subtitle] of covers) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#172554"/><stop offset="1" stop-color="#1d4ed8"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/><circle cx="1050" cy="90" r="220" fill="#60a5fa" opacity=".14"/><circle cx="100" cy="580" r="250" fill="#fbbf24" opacity=".12"/>
  <rect x="88" y="80" width="1024" height="470" rx="34" fill="#fff" opacity=".98"/>
  <g transform="translate(915 145)"><rect width="128" height="170" rx="14" fill="#dbeafe" stroke="#1d4ed8" stroke-width="6"/><circle cx="64" cy="70" r="33" fill="none" stroke="#1d4ed8" stroke-width="6"/><path d="M28 70h72M64 37c12 18 12 48 0 66M64 37c-12 18-12 48 0 66M25 125h78" stroke="#1d4ed8" stroke-width="5" fill="none" stroke-linecap="round"/></g>
  <text x="850" y="210" text-anchor="end" font-family="Calibri,Arial,sans-serif" font-size="60" font-weight="700" fill="#0f172a">${title}</text>
  <rect x="190" y="350" width="820" height="96" rx="48" fill="#eff6ff" stroke="#93c5fd" stroke-width="3"/>
  <text x="600" y="412" text-anchor="middle" font-family="Calibri,Arial,sans-serif" font-size="34" font-weight="700" fill="#1e3a8a">${subtitle}</text>
  <text x="1020" y="510" text-anchor="end" font-family="Calibri,Arial,sans-serif" font-size="24" fill="#475569">دليل أصلي • راجع الجهة الرسمية</text>
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(`public/images/articles/${slug}.webp`);
}
