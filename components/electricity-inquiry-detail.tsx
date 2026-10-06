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
    <section id="electricity-next-services" className="brief-box"><h2>تسجيل القراءة والتقديم على عداد: اختر الخدمة المنفصلة</h2><p>إذا كانت مهمتك إرسال قراءة، استخدم قناة القراءة التي تعلنها شركتك مثل <Link href="/articles/north-cairo-electricity">دليل شمال القاهرة</Link>، أو <a href="https://bedc.gov.eg/" target="_blank" rel="noopener noreferrer">خدمة إبلاغ القراءة لدى البحيرة</a>. جهّز قراءة واضحة تخص العداد نفسه والفترة المطلوبة. وللتقديم على عداد انتقل إلى <a href="https://eservices.eehc.gov.eg/" target="_blank" rel="noopener noreferrer">المنصة الموحدة الرسمية</a> وراجع مستندات الطلب المتاح لحالتك؛ صفحة الاستعلام لا تقدّم طلب تركيب نيابة عنك.</p><p><Link href="/guides/electricity">جميع أدلة الكهرباء المنشورة</Link> تجمع المسارات المتاحة دون إنشاء صفحات محلية متشابهة بلا معلومات إضافية.</p></section>
  </>;
}
