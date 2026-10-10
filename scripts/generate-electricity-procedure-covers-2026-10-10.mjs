import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const covers = [
  ["electricity-complaint", "شكوى الكهرباء", ["شكوى الشركة", "المرفقات", "التصعيد"], "#5c3b68"],
  ["electricity-outage-report", "بلاغ انقطاع الكهرباء", ["تأمين المكان", "121", "المتابعة"], "#9b3d2f"],
  ["electricity-meter-apply", "طلب عداد كهرباء", ["نوع الاستخدام", "المستندات", "العقد"], "#1d5f52"],
  ["code-electricity-meter", "العداد الكودي", ["حالة الملف", "المحاسبة", "التعاقد"], "#72501f"],
  ["electricity-meter-transfer", "نقل ملكية العداد", ["الطرفان", "المستحقات", "تغيير الاسم"], "#27577a"],
];
const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
await mkdir("public/images/articles", { recursive: true });
for (const [slug, title, labels, color] of covers) {
  const cards = labels.map((label, index) => { const x = 820 - index * 360; return `<rect x="${x}" y="235" width="290" height="185" rx="22" fill="#fff" stroke="${color}" stroke-width="3"/><text x="${x + 245}" y="305" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="27" fill="${color}">${esc(label)}</text><circle cx="${x + 145}" cy="365" r="28" fill="${color}"/><text x="${x + 145}" y="375" text-anchor="middle" font-family="Calibri,Arial,sans-serif" font-size="28" fill="#fff">${index + 1}</text>`; }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#eff4f2"/><path d="M0 550 C250 500 430 610 690 548 C900 500 1060 525 1200 480 V630 H0Z" fill="${color}" opacity=".1"/><text x="1100" y="105" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="42" font-weight="700" fill="${color}">${esc(title)}</text><text x="1100" y="165" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="27" fill="#3d5552">خطوات موثقة وحدود واضحة قبل التنفيذ</text>${cards}<g stroke="${color}" stroke-width="5" fill="none"><path d="M800 328h-42l14-12m-14 12 14 12"/><path d="M440 328h-42l14-12m-14 12 14 12"/></g><text x="1100" y="520" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="25" fill="${color}">احتفظ بالطلب والمرجع وإيصال السداد</text><text x="1100" y="574" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="22" fill="#526966">رسم إرشادي أصلي من لوسيل • لا يمثل واجهة رسمية</text></svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(`public/images/articles/${slug}.webp`);
}
console.log(`Generated ${covers.length} original electricity procedure covers`);
