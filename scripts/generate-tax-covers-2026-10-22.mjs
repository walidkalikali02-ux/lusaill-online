import sharp from "sharp";

const covers = [
  ["tax-card-first-time-egypt", "البطاقة الضريبية", "مستندات • تسجيل • متابعة"],
  ["simplified-tax-registration-egypt", "التسجيل المبسط", "سبب • طلب • رقم تسجيل"],
  ["tax-registration-data-update", "تعديل بيانات التسجيل", "نشاط • عنوان • فروع"],
  ["tax-card-lost-damaged-replacement", "بدل البطاقة الضريبية", "فاقد • تالف • تجديد"],
  ["vat-registration-status-certificate", "موقف القيمة المضافة", "نموذج 12 • مراجعة"],
  ["tax-basic-data-certificate", "شهادة البيانات الأساسية", "طلب • سداد • اعتماد"],
  ["tax-registration-reactivation", "إعادة تفعيل التسجيل", "إزالة السبب • نموذج 9"],
  ["tax-registration-cancel-suspend", "إلغاء أو توقف مؤقت", "واقعة • مستند • قرار"],
];

for (const [slug, title, subtitle] of covers) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#172554"/><stop offset="1" stop-color="#1d4ed8"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/><circle cx="1080" cy="70" r="230" fill="#60a5fa" opacity=".18"/><circle cx="85" cy="590" r="255" fill="#fbbf24" opacity=".13"/>
  <rect x="88" y="78" width="1024" height="474" rx="34" fill="#fff" opacity=".98"/>
  <g transform="translate(900 145)"><rect x="0" y="0" width="145" height="170" rx="18" fill="#dbeafe" stroke="#2563eb" stroke-width="6"/><path d="M34 46h78M34 82h78M34 118h48" stroke="#2563eb" stroke-width="10" stroke-linecap="round"/><circle cx="110" cy="136" r="28" fill="#fbbf24"/><path d="M98 136l9 9 17-21" fill="none" stroke="#172554" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>
  <text x="850" y="220" text-anchor="end" font-family="Calibri,Arial,sans-serif" font-size="56" font-weight="700" fill="#0f172a">${title}</text>
  <rect x="190" y="355" width="820" height="96" rx="48" fill="#eff6ff" stroke="#93c5fd" stroke-width="3"/>
  <text x="600" y="417" text-anchor="middle" font-family="Calibri,Arial,sans-serif" font-size="34" font-weight="700" fill="#1e40af">${subtitle}</text>
  <text x="1020" y="510" text-anchor="end" font-family="Calibri,Arial,sans-serif" font-size="24" fill="#475569">دليل أصلي • تحقق من مصلحة الضرائب</text>
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(`public/images/articles/${slug}.webp`);
}
