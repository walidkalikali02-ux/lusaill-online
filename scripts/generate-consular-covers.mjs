import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
// Original, exact editorial workflow diagrams; these are not official UI screenshots.
const guides = JSON.parse(await readFile(new URL('../lib/article-content/consular-covers-2026-10-07.json', import.meta.url), 'utf8'));
const esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
await mkdir('public/images/articles',{recursive:true});
for (const [index,g] of guides.entries()) {
 const colors=['#174f48','#275071','#61452d','#4c406d'];const ink=colors[index%colors.length];
 const cards=g.cards.map((label,i)=>`<rect x="${825-i*370}" y="235" width="290" height="190" rx="20" fill="white" stroke="${ink}" stroke-width="3"/><text x="${1080-i*370}" y="300" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="28" fill="${ink}">${esc(label)}</text><text x="${970-i*370}" y="375" text-anchor="middle" font-family="Calibri,Arial,sans-serif" font-size="48" fill="${ink}">${i+1}</text>`).join('');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#eef3f1"/><text x="1100" y="100" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="38" font-weight="700" fill="${ink}">${esc(g.title)}</text><text x="1100" y="160" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="27" fill="#354d48">راجع تعليمات البعثة المصرية قبل التقديم</text>${cards}<g stroke="${ink}" stroke-width="5" fill="none"><path d="M810 325h-50l15-12m-15 12 15 12"/><path d="M440 325h-50l15-12m-15 12 15 12"/></g><text x="1100" y="510" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="26" fill="${ink}">الأصول والتصديقات تختلف بحسب نوع المعاملة</text><text x="1100" y="570" direction="rtl" font-family="Calibri,Arial,sans-serif" font-size="23" fill="#536761">رسم إرشادي أصلي من لوسيل • لا يمثل وثيقة أو واجهة رسمية</text></svg>`;
 await sharp(Buffer.from(svg)).webp({quality:88}).toFile(`public/images/articles/${g.slug}.webp`);
}
console.log(`Generated ${guides.length} original WebP workflow diagrams`);
