import Link from "next/link";
import { companyCoverageSource, electricityCompanies } from "@/lib/electricity-inquiry-detail";

/**
 * Decision-first entry to the bill inquiry hub.
 * Does not imply that the user has an active bill account or that any
 * third-party checkout has been tested. Detailed service requirements
 * remain in each company guide.
 */
export function ElectricityQuickStart() {
  const guides = electricityCompanies.filter((company) => Boolean(company.guide));

  return (
    <section id="electricity-quick-start" className="brief-box" aria-labelledby="electricity-quick-start-title">
      <h2 id="electricity-quick-start-title">الاستعلام عن فاتورة الكهرباء في مصر: من أين أبدأ؟</h2>
      <p>
        ابدأ باسم شركة توزيع الكهرباء المكتوب على فاتورة سابقة، وليس باسم المحافظة وحده.
        يختلف رقم الاستعلام وطريقة السداد من شركة إلى أخرى، خصوصًا في المناطق التي تتداخل فيها حدود الخدمة.
      </p>
      <ol>
        <li>اقرأ اسم شركة التوزيع على فاتورة أو إيصال يخص الحساب نفسه.</li>
        <li>اختر دليل الشركة أدناه أو ادخل إلى <a href="https://eservices.eehc.gov.eg/" target="_blank" rel="noopener noreferrer">المنصة الموحدة الرسمية لخدمات الكهرباء</a> لاستعراض الخدمات المتاحة.</li>
        <li>جهّز رقم الحساب أو المشترك أو السداد الذي يطلبه نموذج شركتك. لا تفترض أن الرقم المطبوع على جسم العداد يطابقه.</li>
        <li>طابق بيانات الحساب والشهر وقيمة الفاتورة قبل الدفع، واحتفظ بإيصال العملية إذا سددت.</li>
      </ol>
      <h3>اختر شركة التوزيع المكتوبة على فاتورتك</h3>
      <ul>
        {guides.map((company) => (
          <li key={company.name}>
            <Link href={`/articles/${company.guide}`}>دليل فاتورة الكهرباء — {company.name}</Link>
            {" — "}{company.area}
          </li>
        ))}
      </ul>
      <p>
        لا يوجد في هذا الفهرس دليل مستقل بعد لشركتي القناة ومصر الوسطى؛ يمكنك إيجاد قنواتهما في
        {" "}<a href="#electricity-companies">جدول الشركات التسع</a>.
        وللتحقق من حدود المناطق استخدم <a href={companyCoverageSource} target="_blank" rel="noopener noreferrer">دليل التوزيع الجغرافي الرسمي</a>.
      </p>
      <h3>لا تعرف رقم المشترك أو لا تظهر فاتورتك؟</h3>
      <p>
        راجع فاتورة سابقة أو اطلب من مركز خدمة الشركة تحديد بيانات حسابك. مثالان موثقان في الأدلة:
        {" "}<Link href="/articles/south-delta-electricity">جنوب الدلتا</Link> تطلب رقم مشترك من 13 خانة في نموذج الاستعلام،
        بينما ينبه نموذج <Link href="/articles/north-cairo-electricity">شمال القاهرة</Link> إلى رقم سداد من 14 خانة.
        لا تستخدم طول أحد الرقمين قاعدةً لجميع الشركات، ولا تعتبر فشل الاستعلام دليلًا على عدم وجود مستحقات.
      </p>
      <p>
        إذا كان هدفك <Link href="/articles/electricity-complaint">تقديم شكوى على مبلغ أو قراءة</Link>
        أو <Link href="/articles/prepaid-meter-mobile-charge">شحن عداد مسبق الدفع</Link>، فلكل خدمة مسار مستقل عن استعلام الفاتورة.
      </p>
    </section>
  );
}
