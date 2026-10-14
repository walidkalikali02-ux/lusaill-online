import sharp from "sharp";

const cards = [
  ["esim-egypt","تفعيل eSIM","توافق","QR خاص","اختبار","#315f7b"],
  ["enable-5g-egypt","تشغيل شبكة 5G","هاتف","تغطية","إعداد","#5d4a89"],
  ["child-safe-mobile-internet","حماية إنترنت الأطفال","اختيار","تفعيل","متابعة","#287164"],
  ["telecom-accessibility-egypt","اتصالات ميسرة للجميع","قناة","شكوى","متابعة","#8a5a2f"],
  ["telecom-device-warranty","ضمان جهاز الاتصالات","شهادة","صيانة","حقك","#82506d"],
  ["reduce-home-internet-usage","تقليل استهلاك الإنترنت","قياس","ضبط","مقارنة","#3e6b47"],
  ["register-promotional-calls","تسجيل المكالمات الترويجية","بيانات","تسجيل","اختبار","#7b5030"],
  ["buy-compliant-mobile-egypt","فحص الهاتف قبل الشراء","IMEI","فاتورة","ضمان","#3d617c"],
];
for (const [slug,title,a,b,c,color] of cards) {
  const boxes=[a,b,c].map((label,i)=>`<rect x="${815-i*285}" y="245" width="225" height="145" rx="20" fill="#fff" stroke="${color}" stroke-width="3"/><circle cx="${928-i*285}" cy="350" r="24" fill="${color}"/><text x="${928-i*285}" y="358" text-anchor="middle" font-size="22" fill="#fff">${i+1}</text><text x="${928-i*285}" y="300" text-anchor="middle" font-family="Calibri,Arial" font-size="25" fill="#263238">${label}</text>${i<2?`<text x="${790-i*285}" y="330" font-size="38" fill="${color}">←</text>`:""}`).join("");
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f3f7f8"/><path d="M0 520 Q260 470 520 530 T1200 500 V630 H0Z" fill="#e1eaed"/><text x="1100" y="110" text-anchor="end" font-family="Calibri,Arial" font-weight="700" font-size="48" fill="${color}">${title}</text><text x="1100" y="160" text-anchor="end" font-family="Calibri,Arial" font-size="24" fill="#455a64">دليل عملي موثق من الجهة المنظمة</text>${boxes}<text x="1100" y="475" text-anchor="end" font-family="Calibri,Arial" font-size="22" fill="${color}">تحقق من البيانات واحتفظ برقم العملية</text><text x="1100" y="570" text-anchor="end" font-family="Calibri,Arial" font-size="16" fill="#607d8b">رسم إرشادي أصلي من لوسيل • لا يمثل واجهة رسمية</text></svg>`;
  await sharp(Buffer.from(svg)).webp({quality:88}).toFile(`public/images/articles/${slug}.webp`);
}
console.log(`Generated ${cards.length} original telecom covers`);
