import sharp from "sharp";

const covers = [
  ["consumer-protection-complaint-egypt", "شكوى حماية المستهلك", "مستندات • تقديم • متابعة"],
  ["consumer-return-exchange-egypt", "الاستبدال والاسترجاع", "14 يومًا • 30 يومًا"],
  ["consumer-invoice-rights-egypt", "فاتورة الشراء", "مورد • سعر • ضمان"],
  ["product-warranty-repair-egypt", "الضمان والصيانة", "إيصال • إصلاح • قطع"],
  ["online-shopping-consumer-rights-egypt", "الشراء أونلاين بأمان", "تحقق • دفع • استلام"],
  ["misleading-ad-complaint-egypt", "الإعلان المضلل", "وثّق • قارن • أبلغ"],
  ["authorized-service-center-egypt", "مركز صيانة معتمد", "تحقق • إيصال • خصوصية"],
  ["product-lifetime-spare-parts-egypt", "العمر وقطع الغيار", "مدة • صيانة • إثبات"],
];

for (const [slug, title, subtitle] of covers) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#064e3b"/><stop offset="1" stop-color="#0f766e"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/><circle cx="1080" cy="65" r="230" fill="#5eead4" opacity=".14"/><circle cx="70" cy="595" r="260" fill="#fbbf24" opacity=".13"/>
  <rect x="88" y="78" width="1024" height="474" rx="34" fill="#fff" opacity=".98"/>
  <g transform="translate(900 142)"><path d="M72 0l72 28v57c0 53-30 86-72 105C30 171 0 138 0 85V28L72 0z" fill="#ccfbf1" stroke="#0f766e" stroke-width="6"/><path d="M38 90l24 24 47-58" fill="none" stroke="#0f766e" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></g>
  <text x="850" y="215" text-anchor="end" font-family="Calibri,Arial,sans-serif" font-size="58" font-weight="700" fill="#0f172a">${title}</text>
  <rect x="190" y="350" width="820" height="96" rx="48" fill="#f0fdfa" stroke="#5eead4" stroke-width="3"/>
  <text x="600" y="412" text-anchor="middle" font-family="Calibri,Arial,sans-serif" font-size="34" font-weight="700" fill="#115e59">${subtitle}</text>
  <text x="1020" y="510" text-anchor="end" font-family="Calibri,Arial,sans-serif" font-size="24" fill="#475569">دليل أصلي • راجع الجهة الرسمية</text>
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(`public/images/articles/${slug}.webp`);
}
