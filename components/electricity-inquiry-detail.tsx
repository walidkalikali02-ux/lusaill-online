import Image from "next/image";
import Link from "next/link";
import { companyCoverageSource, electricityCompanies, inquirySections } from "@/lib/electricity-inquiry-detail";
import { ElectricityCalculator } from "./electricity-calculator";

export function ElectricityCompanies() {
  return <section id="electricity-companies" className="brief-box">
    <h2>شركات توزيع الكهرباء التسع: اختر الشركة الصحيحة</h2>
    <p>هذا جدول إرشادي للنطاق الجغرافي، وليس بديلًا عن اسم الشركة على فاتورتك. للقاهرة والقليوبية والمنوفية حدود خدمة واستثناءات؛ راجع <a href={companyCoverageSource} target="_blank" rel="noopener noreferrer">التوزيع الجغرافي الرسمي</a> عند وقوع عنوانك قرب الحدود. تعلن قنوات الشركات رقم <a href="tel:121">121</a> للأعطال والشكاوى، وليس رقمًا للبحث عن الفاتورة بالاسم.</p>
    <div className="electricity-table-scroll" role="region" aria-label="جدول شركات الكهرباء، يمكن تمريره أفقيًا" tabIndex={0}>
      <table className="todo-table"><caption>روابط وقنوات رسمية — مراجعة 6 أكتوبر 2026، مع بيان حدود التحقق</caption>
        <thead><tr><th scope="col">الشركة</th><th scope="col">نطاق الخدمة المختصر</th><th scope="col">الرابط الرسمي وملاحظته</th><th scope="col">الأعطال</th></tr></thead>
        <tbody>{electricityCompanies.map(company => <tr key={company.name}><th scope="row">{company.guide ? <Link href={`/articles/${company.guide}`}>{company.name}</Link> : company.name}</th><td>{company.area}</td><td><a href={company.url} target="_blank" rel="noopener noreferrer">{company.label}</a><p>{company.note}</p></td><td><a href="tel:121">121</a></td></tr>)}</tbody>
      </table>
    </div>
    <p>روابط القناة ومصر الوسطى تقود لدليل مراكز الخدمة؛ لم نثبت نموذج فاتورة حيًا لهما. وتوفر صفحة البحيرة أو نموذج مصر العليا لا يعني أننا اختبرنا حساب عميل أو نفذنا سدادًا. إذا تعذّر رابط، استخدم موقع القابضة الرسمي ومركز الشركة بدل إعلان وسيط.</p>
  </section>;
}
export function ElectricityInquiryDetail() {
  return <>
    {inquirySections.slice(0, 3).map(section => <section id={section.id} className="brief-box" key={section.id}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p><a href={section.source} target="_blank" rel="noopener noreferrer">المصدر الرسمي لهذا القسم</a></p></section>)}
    <ElectricityCalculator />
    <figure className="guide-figure"><Image src="/images/diagrams/electricity-cost-example.webp" alt="مثال حساب منزلي لاستهلاك 200 كيلوواط ساعة: طاقة 190 جنيهًا وخدمة عملاء 6 جنيهات، مجموع 196 قبل البنود الأخرى" width={1200} height={540} sizes="(max-width: 768px) 100vw, 760px" /><figcaption>رسم توضيحي أصلي وفق جدول الجهاز التنظيمي؛ ليس فاتورة أو لقطة واجهة رسمية.</figcaption></figure>
    {inquirySections.slice(3).map(section => <section id={section.id} className="brief-box" key={section.id}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p><a href={section.source} target="_blank" rel="noopener noreferrer">المصدر الرسمي لهذا القسم</a></p></section>)}
    <section id="electricity-next-services" className="brief-box">
      <h2 id="electricity-task-routing">ما الخطوة التالية: فاتورة أم قراءة أم شحن أم شكوى؟</h2>
      <p>ابدأ بنوع المهمة؛ سداد فاتورة شهرية يختلف عن شحن عداد مسبق الدفع، والإبلاغ عن قراءة لا يحل شكوى على مبلغ الفاتورة. احتفظ باسم الشركة ورقم الطلب أو العملية عند الانتقال بين القنوات.</p>
      <div className="electricity-table-scroll" role="region" aria-label="اختيار دليل خدمة الكهرباء المناسب" tabIndex={0}>
        <table className="todo-table">
          <thead><tr><th scope="col">مهمتك</th><th scope="col">الدليل المناسب وما تراجعه</th></tr></thead>
          <tbody>
            <tr><th scope="row">استعلام أو سداد فاتورة شهرية</th><td>اختر <a href="#electricity-companies">دليل شركة التوزيع على فاتورتك</a> من الجدول أعلاه؛ راجع رقم الحساب وقنوات السداد التي يشرحها دليلها، ولا تستخدم بيانات شركة أخرى.</td></tr>
            <tr><th scope="row">إرسال قراءة العداد</th><td>راجع قناة القراءة في <a href="#electricity-companies">دليل شركتك</a>؛ أمثلة الأدلة المنشورة: <Link href="/articles/north-cairo-electricity">شمال القاهرة</Link> و<Link href="/articles/north-delta-electricity">شمال الدلتا</Link>. ظهور خدمة لدى شركة لا يثبت إتاحتها بالطريقة نفسها لدى شركة أخرى.</td></tr>
            <tr><th scope="row">شحن عداد مسبق الدفع</th><td><Link href="/articles/prepaid-meter-mobile-charge">شحن العداد بالموبايل</Link> يوضح فحوص التوافق ومسار الشحن؛ لا تعتبره طريقة دفع لكل فاتورة شهرية.</td></tr>
            <tr><th scope="row">اعتراض على مبلغ أو شكوى لم تُحل</th><td>اتبع <Link href="/articles/electricity-complaint">تقديم شكوى الكهرباء والتصعيد</Link>، وراجع <Link href="/articles/electricity-consumer-rights">حقوق مستخدم الكهرباء</Link> لتحديد ما توثقه في الشكوى.</td></tr>
            <tr><th scope="row">انقطاع أو عطل</th><td>ابدأ بـ<Link href="/articles/electricity-outage-report">دليل بلاغ انقطاع الكهرباء</Link>. وإذا كان الاعتراض على قياس الاستهلاك، راجع <Link href="/articles/electricity-meter-test">طلب فحص العداد</Link> دون العبث به.</td></tr>
            <tr><th scope="row">طلب عداد أو تغيير المشترك</th><td>اختر <Link href="/articles/electricity-meter-apply">طلب عداد جديد</Link> أو <Link href="/articles/electricity-meter-transfer">نقل ملكية العداد</Link>؛ كل منهما إجراء مستقل عن الاستعلام عن الفاتورة.</td></tr>
          </tbody>
        </table>
      </div>
      <p>تحديث تنظيم المسارات: <time dateTime="2026-11-04">4 نوفمبر 2026</time>. تواريخ التحقق من القنوات الرسمية مبيّنة في الأدلة المرتبطة.</p>
    </section>
  </>;
}
