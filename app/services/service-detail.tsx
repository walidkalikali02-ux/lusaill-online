import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { serviceDetails, type DetailSlug } from "./service-detail-data";
import s from "./studio.module.css";

function ServicePreview({ slug }: { slug: DetailSlug }) {
  switch (slug) {
    case "website-design":
      return <div className={s.previewPage} aria-hidden="true">
            <div className={s.previewCopy}><strong>دار</strong><span>للعمارة والتصميم</span><p>مساحات تُصمّم للعيش.</p></div>
            <div className={s.previewPhoto} />
          </div>;
    case "video-editing":
      return <div className={`${s.mockup} ${s.videoMock}`} aria-hidden="true" dir="ltr">
        <div className={s.videoFrame}><span className={s.videoTime}>00:18 / 00:45</span><span className={s.videoPlay}>▶</span><span className={s.videoTitle} dir="rtl">حكاية المكان</span></div>
        <div className={s.timeline}><span /><span /><span /><span /><i /></div>
        <div className={s.audioTrack} />
      </div>;
    case "excel":
      return <div className={`${s.mockup} ${s.excelMock}`} aria-hidden="true">
        <strong className={s.sheetTitle}>متابعة المبيعات</strong>
        <div className={s.sheetBody}>
          <table><thead><tr><th>الشهر</th><th>الطلبات</th><th>الإيرادات</th></tr></thead><tbody>
            <tr><td>يناير</td><td>24</td><td>4,800</td></tr>
            <tr><td>فبراير</td><td>38</td><td>7,600</td></tr>
            <tr><td>مارس</td><td>46</td><td>9,200</td></tr>
          </tbody><tfoot><tr><th>الإجمالي</th><td>108</td><td>21,600</td></tr></tfoot></table>
          <div className={s.sheetChart}><span>الإيرادات</span><div dir="ltr"><i /><i /><i /></div></div>
        </div>
      </div>;
    case "social-design":
      return <div className={`${s.mockup} ${s.socialMock}`} aria-hidden="true">
        <div className={s.socialSample}><div className={s.socialPost}><small>✳ دار</small><strong>تفاصيل<br />تصنع الفرق.</strong></div><span>منشور</span></div>
        <div className={s.socialSample}><div className={s.socialStory}><small>✳ دار</small><strong>تفاصيل تصنع الفرق.</strong></div><span>قصة</span></div>
      </div>;
  }
}


const servicePreparation: Record<DetailSlug, { inputs: string[]; acceptance: string[] }> = {
  "website-design": {
    inputs: [
      "اسم النشاط والجمهور الذي تريد الوصول إليه، مع وصف الخدمة أو المنتج الأساسي.",
      "قائمة الصفحات المقترحة مثل الرئيسية والخدمات ومن نحن والتواصل، والمواد النصية والصور التي تمتلك حق استخدامها.",
      "طريقة التواصل المطلوبة، وأي نطاق أو استضافة قائمة تريد ربطها بالموقع.",
      "أمثلة مرجعية لتوضيح أسلوب التصميم، مع تحديد الوظائف الإضافية مثل الحجز أو الدفع قبل التسعير.",
    ],
    acceptance: [
      "مراجعة وضوح القوائم والنصوص ووسائل الاتصال على الهاتف والكمبيوتر.",
      "اختبار الروابط والنماذج ومسار الاستفسار الذي تم الاتفاق عليه.",
      "مطابقة الصفحات والوظائف مع قائمة المتطلبات المعتمدة قبل الإطلاق.",
    ],
  },
  "video-editing": {
    inputs: [
      "المقاطع الأصلية وروابط مشاركة يمكن فتحها، مع توضيح حقوق استخدام المواد والصوت.",
      "هدف الفيديو والجمهور والمنصة والمدة المقصودة، وما يجب إبرازُه أو حذفه.",
      "النصوص والشعار وألوان الهوية، ولغة الترجمة إذا كانت مطلوبة.",
      "قائمة المقاسات والنسخ النهائية التي تحتاجها للنشر أو الإعلان.",
    ],
    acceptance: [
      "مراجعة ترتيب القصة وعدم فقدان المعلومات المهمة أثناء الاختصار.",
      "التحقق من وضوح الصوت والعناوين والترجمة، وتباين النص على مختلف المشاهد.",
      "فحص مدة النسخة ومقاسها وجودة ملف التصدير وفق اتفاق العمل.",
    ],
  },
  excel: {
    inputs: [
      "وصف المهمة والأعمدة الأساسية والنتيجة التي تريد حسابها أو متابعتها.",
      "عينة ببيانات غير حساسة توضّح الحالات الصحيحة والاستثناءات المتوقعة.",
      "نسخة البرنامج وإصدار Excel أو البديل، وأي صيغ يجب أن تبقى متوافقة معها.",
      "أمثلة للتقارير المطلوبة، وتعريف دقيق للمؤشرات مثل صافي المبيعات والمخزون.",
    ],
    acceptance: [
      "اختبار المعادلات بعينات معروفة النتائج ومراجعة الخلايا ذات الأخطاء.",
      "فحص صحة الإجماليات والفلاتر وترابط الأوراق عند تحديث البيانات.",
      "توضيح مكان إدخال البيانات وكيفية تحديث التقارير دون إفساد المعادلات.",
    ],
  },
  "social-design": {
    inputs: [
      "الرسالة الأساسية لكل منشور، والجمهور والمنصات التي ستُنشر عليها التصاميم.",
      "الشعار والألوان والخطوط والمواد البصرية المصرح باستخدامها.",
      "النصوص النهائية أو المسودات، واللغة المطلوبة ورابط الدعوة لاتخاذ إجراء.",
      "عدد المنشورات والقصص والمقاسات، وإذا كنت تريد ملفات مصدر قابلة للتعديل.",
    ],
    acceptance: [
      "قراءة العناوين والنصوص على شاشة الهاتف قبل اعتماد التصميم.",
      "مراجعة مقاسات كل منصة وسلامة حواف القص والمساحات المخصصة للنص.",
      "مطابقة الرسالة والهوية وعدد النسخ مع الطلب، والتأكد من سلامة الروابط وبيانات التواصل.",
    ],
  },
};

export function ServiceDetail({ slug }: { slug: DetailSlug }) {
  const detail = serviceDetails[slug];
  const path = `/services/${slug}`;
  const requestUrl = `/services/request?service=${slug}`;
  const hasSubscription = slug === "website-design";
  const preparation = servicePreparation[slug];
  const serviceSchema = {
    "@context": "https://schema.org", "@type": "Service",
    name: hasSubscription ? "خدمة إنشاء المواقع الإلكترونية" : detail.name, description: detail.description,
    serviceType: hasSubscription ? "تصميم وتطوير المواقع الإلكترونية" : detail.name,
    provider: { "@type": "Organization", "@id": siteConfig.url + "/#organization", name: "لوسيل", url: siteConfig.url },
    areaServed: { "@type": "Place", name: "قطر" }, url: absoluteUrl(path),
    ...(hasSubscription ? { offers: { "@type": "Offer", price: "500", priceCurrency: "QAR", priceSpecification: { "@type": "UnitPriceSpecification", price: "500", priceCurrency: "QAR", unitText: "شهر" } } } : {}),
  };
  const breadcrumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: "الخدمات", item: absoluteUrl("/services") },
    { "@type": "ListItem", position: 3, name: detail.name, item: absoluteUrl(path) },
  ] };

  return <main id="main-content" className={s.root}>
    <header className={s.detailHero}>
      <div className={`${s.wrap} ${s.detailGrid}`}>
        <div>
          <nav className={s.crumb} aria-label="مسار التصفح"><Link href="/services">الخدمات</Link><span aria-hidden="true"> / </span><span aria-current="page">{detail.name}</span></nav>
          <h1>{detail.heading[0]}<br />{detail.heading[1]}</h1>
          <p className={s.lead}>{detail.lead}</p>
          <div className={s.actions}>
            <Link href={requestUrl} className={s.button}>{detail.cta} <span aria-hidden="true">←</span></Link>
            <a href="#pricing" className={s.textLink}>{hasSubscription ? "عرض الاشتراك" : "كيف يتحدد السعر؟"}</a>
          </div>
        </div>
        <figure className={s.preview}>
          <div className={s.browserBar} aria-hidden="true"><span>● ● ●</span><span>{detail.previewLabel}</span></div>
          <ServicePreview slug={slug} />
          <figcaption>{detail.caption}</figcaption>
        </figure>
      </div>
    </header>
    <section className={s.section} id="what-you-get"><div className={s.wrap}>
      <div className={s.sectionHeading}><h2>ماذا يشمل العمل؟</h2><p>{detail.scope}</p></div>
      <div className={s.features}>{detail.features.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </div></section>
    <section className={s.process}><div className={s.wrap}>
      <h2>{detail.process}</h2>
      <ol className={s.steps}>{detail.steps.map(([title, copy]) => <li key={title}><strong>{title}</strong><p>{copy}</p></li>)}</ol>
    </div></section>
    <section className={s.section} id="pricing"><div className={s.wrap}>
      <div className={s.pricePanel}>
        <div><h2>{detail.quote}</h2>{detail.notes.map(note => <p key={note}>{note}</p>)}</div>
        <div className={s.priceAction}>
          {hasSubscription ? <p><strong>500</strong> ريال قطري شهريًا</p> : <p>يراجع الفريق طلبك لتحديد نطاق العمل والتكلفة.</p>}
          <Link className={s.button} href={requestUrl}>{detail.cta} <span aria-hidden="true">←</span></Link>
        </div>
      </div>
    </div></section>
    <section className={s.section} aria-labelledby="service-preparation">
      <div className={s.wrap}>
        <div className={s.sectionHeading}><h2 id="service-preparation">ما الذي نحتاجه قبل بدء العمل؟</h2>
          <p>هذه قائمة تحضير تساعدنا على فهم النطاق وتحديد عرض مناسب؛ ليست شروطًا ثابتة لكل طلب.</p></div>
        <ul>{preparation.inputs.map(item => <li key={item}>{item}</li>)}</ul>
        <h2>كيف نراجع النتيجة قبل الاعتماد؟</h2>
        <p>تُحدّد خطوات المراجعة النهائية وفق نطاق الخدمة المتفق عليه. من النقاط التي ينبغي فحصها:</p>
        <ul>{preparation.acceptance.map(item => <li key={item}>{item}</li>)}</ul>
        <p>المدة والتكلفة وعدد جولات التعديل تحدد بعد مراجعة تفاصيل الطلب، ولا نذكر موعدًا أو سعرًا تقديريًا دون معرفة نطاق العمل.</p>
      </div>
    </section>
    <section className={s.faq}><div className={s.wrap}>
      <h2>أسئلة شائعة</h2>
      {detail.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
    </div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
  </main>;
}
