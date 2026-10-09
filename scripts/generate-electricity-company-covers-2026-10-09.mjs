import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// Original explanatory diagrams, not screenshots of a government or company UI.
const covers = [
  { slug: "upper-egypt-electricity", title: "فاتورة كهرباء مصر العليا", cards: ["الإيصال", "الكود الإلكتروني", "مراجعة النتيجة"], color: "#6b3f25" },
  { slug: "beheira-electricity", title: "فاتورة كهرباء البحيرة", cards: ["تحديد القطاع", "الاستعلام", "حفظ الإيصال"], color: "#185b64" },
];
const esc = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

await mkdir("public/images/articles", { recursive: true });
for (const cover of covers) {
  const cards = cover.cards.map((label, index) => {
    const x = 820 - index * 360;
    return `<rect x="${x}" y="235" width="290" height="185" rx="22" fill="#fff" stroke="${cover.color}" stroke-width="3"/><text x="${x + 245}" y="305" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="28" fill="${cover.color}">${esc(label)}</text><circle cx="${x + 145}" cy="365" r="28" fill="${cover.color}"/><text x="${x + 145}" y="375" text-anchor="middle" font-family="Calibri,Arial,sans-serif" font-size="28" fill="#fff">${index + 1}</text>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#eef4f2"/><path d="M0 560 C260 500 390 620 650 555 C890 495 1050 530 1200 485 V630 H0Z" fill="${cover.color}" opacity=".1"/><text x="1100" y="105" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="42" font-weight="700" fill="${cover.color}">${esc(cover.title)}</text><text x="1100" y="165" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="27" fill="#3d5552">مسار عملي باستخدام المصدر الرسمي والرقم الصحيح</text>${cards}<g stroke="${cover.color}" stroke-width="5" fill="none"><path d="M800 328h-42l14-12m-14 12 14 12"/><path d="M440 328h-42l14-12m-14 12 14 12"/></g><text x="1100" y="520" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="25" fill="${cover.color}">راجع الحساب والشهر قبل السداد</text><text x="1100" y="574" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="22" fill="#526966">رسم إرشادي أصلي من لوسيل • لا يمثل واجهة رسمية</text></svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(`public/images/articles/${cover.slug}.webp`);
}
console.log(`Generated ${covers.length} original electricity WebP diagrams`);
