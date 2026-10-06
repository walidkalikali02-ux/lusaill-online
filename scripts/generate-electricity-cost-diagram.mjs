import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="540" viewBox="0 0 1200 540">
<rect width="1200" height="540" rx="24" fill="#eaf6f3"/>
<g font-family="Calibri,Arial,sans-serif" direction="rtl" fill="#174f48">
<text x="1100" y="80" font-size="42" font-weight="700">مثال حساب منزلي: استهلاك ٢٠٠ كيلوواط ساعة</text>
<g fill="white" stroke="#b6d4cd" stroke-width="2"><rect x="820" y="140" width="290" height="220" rx="20"/><rect x="455" y="140" width="290" height="220" rx="20"/><rect x="90" y="140" width="290" height="220" rx="20"/></g>
<g font-size="30"><text x="1070" y="200">قيمة الطاقة</text><text x="705" y="200">خدمة العملاء</text><text x="340" y="200">مجموع البندين</text></g>
<g font-size="44" font-weight="700"><text x="1070" y="280">١٩٠ جنيهًا</text><text x="705" y="280">٦ جنيهات</text><text x="340" y="280">١٩٦ جنيهًا</text></g>
<g font-size="24"><text x="1070" y="325">٢٠٠ × ٠٫٩٥</text><text x="705" y="325">بند شهري منفصل</text><text x="340" y="325">قبل البنود الأخرى</text></g>
<text x="1100" y="430" font-size="27">لا يشمل المتأخرات أو الأقساط أو الدمغة السنوية أو التسويات</text>
<text x="1100" y="485" font-size="22">رسم أصلي من لوسيل • تعريفة أبريل ٢٠٢٦ • ليس فاتورة أو واجهة رسمية</text>
</g></svg>`;
await mkdir('public/images/diagrams', {recursive:true});
await sharp(Buffer.from(svg)).webp({quality:90}).toFile('public/images/diagrams/electricity-cost-example.webp');
