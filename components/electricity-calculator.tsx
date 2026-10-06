"use client";

import { useState } from "react";
import { calculateResidentialBill, parseConsumption, tariffSource } from "@/lib/electricity-tariff";
const money = new Intl.NumberFormat("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function ElectricityCalculator() {
  const [consumption, setConsumption] = useState("200");
  const kwh = parseConsumption(consumption);
  const result = kwh === null ? null : calculateResidentialBill(kwh);
  return <section id="calculator" className="brief-box electricity-calculator">
    <h2>حاسبة فاتورة الكهرباء المنزلية</h2>
    <p>أدخل استهلاك شهر واحد بالكيلوواط ساعة، من فاتورتك أو الفرق بين قراءتين صحيحتين للفترة نفسها. مثال: قراءة سابقة ١٢٠٠ وحالية ١٤٠٠ تعطي استهلاكًا قدره ٢٠٠، وليس ١٤٠٠. إذا تغيّر العداد أو عاد مؤشره إلى الصفر، اطلب مراجعة الشركة بدل طرح القراءات آليًا.</p>
    <p id="calculator-scope">التقدير للاستخدام المنزلي بنظام الشرائح وفق تعريفة أبريل ٢٠٢٦، التي رُوجعت في ٦ أكتوبر ٢٠٢٦. لا تستخدمه للعداد الكودي أو النشاط التجاري، ولا تعتبره رصيد كارت أو مطالبة سداد.</p>
    <label htmlFor="electricity-kwh">الاستهلاك الشهري (كيلوواط ساعة)</label>
    <input id="electricity-kwh" type="text" inputMode="numeric" value={consumption} onChange={event => setConsumption(event.target.value)} aria-describedby="calculator-scope calculator-help" aria-invalid={kwh === null} autoComplete="off" maxLength={10} />
    <p id="calculator-help">أدخل عددًا صحيحًا من صفر إلى مليون، بالأرقام العربية أو الإنجليزية. تُحسب النتيجة فورًا على جهازك؛ لا تحتاج رقم المشترك أو بيانات الدفع.</p>
    <div role="status" aria-live="polite" aria-atomic="true" className="calculator-result">
      {result ? <><dl>
        <div><dt>قيمة الطاقة</dt><dd>{money.format(result.energy)} جنيه</dd></div>
        <div><dt>خدمة العملاء الشهرية</dt><dd>{money.format(result.service)} جنيه</dd></div>
        <div><dt>المجموع التقديري لهذين البندين</dt><dd><strong>{money.format(result.total)} جنيه</strong></dd></div>
      </dl><p>{result.method}</p></> : <p>أدخل استهلاكًا صحيحًا؛ لا تُقبل القيم السالبة أو الكسور أو الحقول الفارغة.</p>}
    </div>
    <p>لا يشمل المجموع المتأخرات أو الأقساط أو الدمغة السنوية أو أي تسويات أخرى. مصدر التعريفة يذكر دمغة سنوية قدرها ٣ جنيهات عند التعاقد وفي يناير؛ لذلك لا نضيفها لكل شهر. يُعامل الصفر هنا وفق بند «صفري ومغلق» بخدمة عملاء ٩ جنيهات، ويظل تطبيقه على حسابك مسؤولية الشركة.</p>
    <p>هناك انتقالات تعيد تسعير الاستهلاك من الصفر، خصوصًا بعد ١٠٠ و٦٥٠ و١٠٠٠ كيلوواط ساعة؛ لا يصح ضرب كل استهلاكك في آخر شريحة دائمًا، ولا جمع الشرائح الأقل بعد إلغاء دعمها. <a href={tariffSource} target="_blank" rel="noopener noreferrer">راجع جدول التعريفة الرسمي</a>، أو <a href="https://egyptera.org/en/BillCalcApp1/billcalc1.aspx" target="_blank" rel="noopener noreferrer">حاسبة الجهاز التنظيمي</a> للمقارنة. المبلغ المستحق يُراجع في حساب الشركة.</p>
    <noscript><p>تحتاج الأداة إلى JavaScript. مثال ثابت: استهلاك ٢٠٠ يعطي طاقة ١٩٠ جنيهًا وخدمة عملاء ٦ جنيهات، ومجموعًا تقديريًا ١٩٦ جنيهًا قبل البنود الأخرى.</p></noscript>
  </section>;
}
