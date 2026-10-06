// Egyptera residential tariff starting April 2026; reviewed 2026-10-06.
// Integer piastres avoid floating-point errors. Tier resets are intentional.
export const tariffSource = 'https://egyptera.org/en/TarrifApril2026.aspx';
export const tariffReviewDate = '2026-10-06';
export function calculateResidentialBill(kwh: number) {
  if (!Number.isSafeInteger(kwh) || kwh < 0 || kwh > 1_000_000) throw new RangeError('أدخل استهلاكًا صحيحًا من صفر إلى مليون كيلوواط ساعة.');
  let energy: number;
  let service: number;
  let method: string;
  if (kwh === 0) { energy = 0; service = 900; method = 'حالة الاستهلاك الصفري أو المغلق: خدمة العملاء 9 جنيهات.'; }
  else if (kwh <= 50) { energy = kwh * 68; service = 100; method = 'كل الاستهلاك × 0.68 جنيه.'; }
  else if (kwh <= 100) { energy = 50 * 68 + (kwh - 50) * 78; service = 200; method = 'أول 50 × 0.68 والباقي × 0.78 جنيه.'; }
  else if (kwh <= 200) { energy = kwh * 95; service = 600; method = 'كل الاستهلاك من الصفر × 0.95 جنيه.'; }
  else if (kwh <= 350) { energy = 200 * 95 + (kwh - 200) * 155; service = 1100; method = 'أول 200 × 0.95 والباقي × 1.55 جنيه.'; }
  else if (kwh <= 650) { energy = 200 * 95 + 150 * 155 + (kwh - 350) * 195; service = 1500; method = 'أول 200 × 0.95، والتالية 150 × 1.55، والباقي × 1.95 جنيه.'; }
  else if (kwh <= 1000) { energy = kwh * 210; service = 2500; method = 'كل الاستهلاك من الصفر × 2.10 جنيه؛ لا تُجمع معه الشرائح الأقل.'; }
  else { energy = kwh * 258; service = 4000; method = 'كل الاستهلاك من الصفر × 2.58 جنيه؛ لا تُجمع معه الشرائح الأقل.'; }
  return { energy: energy / 100, service: service / 100, total: (energy + service) / 100, method };
}
export function parseConsumption(input: string): number | null {
  const normalized = input.trim().replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit))).replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
  if (!/^\d+$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isSafeInteger(value) && value <= 1_000_000 ? value : null;
}
