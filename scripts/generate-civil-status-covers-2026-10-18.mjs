import sharp from "sharp";

const cards = [
  ["paper-marriage-record-egypt", "قيد الزواج الورقي", "نوع", "قيد", "مراجعة", "#6a587e"],
  ["paper-divorce-record-egypt", "قيد الطلاق الورقي", "واقعة", "طلب", "استلام", "#77525d"],
  ["divorce-certificate-online-egypt", "وثيقة الطلاق أونلاين", "حساب", "وثيقة", "متابعة", "#3b6679"],
  ["paper-death-record-egypt", "قيد الوفاة الورقي", "مرحلة", "جهة", "قيد", "#59636f"],
  ["newborn-birth-registration-egypt", "تسجيل مولود جديد", "إخطار", "قيد", "شهادة", "#3c7468"],
  ["death-registration-burial-permit", "تسجيل الوفاة وتصريح الدفن", "تبليغ", "تصريح", "قيد", "#5f6575"],
  ["marriage-divorce-record-correction", "تصحيح قيد الزواج أو الطلاق", "خطأ", "إثبات", "تصحيح", "#7d5939"],
  ["late-birth-registration-pre-1962", "ساقط قيد الميلاد قبل 1962", "بحث", "أدلة", "قرار", "#4d6880"],
];

for (const [slug, title, a, b, c, color] of cards) {
  const boxes = [a, b, c].map((label, i) => `<rect x="${815 - i * 285}" y="245" width="225" height="145" rx="20" fill="#fff" stroke="${color}" stroke-width="3"/><circle cx="${928 - i * 285}" cy="350" r="24" fill="${color}"/><text x="${928 - i * 285}" y="358" text-anchor="middle" font-size="22" fill="#fff">${i + 1}</text><text x="${928 - i * 285}" y="300" text-anchor="middle" font-family="Calibri,Arial" font-size="25" fill="#263238">${label}</text>${i < 2 ? `<text x="${790 - i * 285}" y="330" font-size="38" fill="${color}">←</text>` : ""}`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f4f7f7"/><path d="M0 520 Q260 470 520 530 T1200 500 V630 H0Z" fill="#e3eaec"/><text x="1100" y="110" text-anchor="end" font-family="Calibri,Arial" font-weight="700" font-size="46" fill="${color}">${title}</text><text x="1100" y="160" text-anchor="end" font-family="Calibri,Arial" font-size="24" fill="#455a64">دليل عملي موثق من الخدمات الحكومية المصرية</text>${boxes}<text x="1100" y="475" text-anchor="end" font-family="Calibri,Arial" font-size="22" fill="${color}">حدد نوع الوثيقة قبل تقديم الطلب</text><text x="1100" y="570" text-anchor="end" font-family="Calibri,Arial" font-size="16" fill="#607d8b">رسم إرشادي أصلي من لوسيل • لا يمثل واجهة رسمية</text></svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(`public/images/articles/${slug}.webp`);
}

console.log(`Generated ${cards.length} original civil-record covers`);
