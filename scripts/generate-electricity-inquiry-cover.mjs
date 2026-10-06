import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// Original editorial decision diagram, not a screenshot or utility bill.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#e8f2ef"/>
<text x="1090" y="100" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="48" font-weight="700" fill="#174f48">استعلام فاتورة الكهرباء</text>
<text x="1090" y="155" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="27" fill="#354d48">ابدأ بالشركة • اتبع رقم النموذج • راجع النتيجة</text>
<g fill="white" stroke="#174f48" stroke-width="3"><rect x="825" y="225" width="290" height="180" rx="22"/><rect x="455" y="225" width="290" height="180" rx="22"/><rect x="85" y="225" width="290" height="180" rx="22"/></g>
<g font-family="Calibri,Arial,sans-serif" font-size="32" direction="rtl" fill="#174f48"><text x="1080" y="285">١. شركة التوزيع</text><text x="710" y="285">٢. رقم الحساب</text><text x="340" y="285">٣. راجع الفاتورة</text></g>
<g font-family="Calibri,Arial,sans-serif" font-size="24" direction="rtl" fill="#354d48"><text x="1080" y="343">من فاتورة سابقة</text><text x="710" y="343">بحسب حقل النموذج</text><text x="340" y="343">ثم احفظ إيصال الدفع</text></g>
<g stroke="#174f48" stroke-width="5" fill="none"><path d="M812 315h-51l14-12m-14 12 14 12"/><path d="M442 315h-51l14-12m-14 12 14 12"/></g>
<text x="1090" y="485" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="29" fill="#174f48">رقم جسم العداد قد يختلف عن رقم المشترك أو السداد</text>
<text x="1090" y="550" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="24" fill="#536761">رسم إرشادي أصلي من لوسيل • لا يمثل واجهة رسمية</text>
</svg>`;
await mkdir("public/images/articles", { recursive: true });
await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile("public/images/articles/electricity-bill-inquiry.webp");
