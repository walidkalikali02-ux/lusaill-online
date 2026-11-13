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

export function ServiceDetail({ slug }: { slug: DetailSlug }) {
  const detail = serviceDetails[slug];
  const path = `/services/${slug}`;
  const requestUrl = `/services/request?service=${slug}`;
  const hasSubscription = slug === "website-design";
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
    <section className={s.faq}><div className={s.wrap}>
      <h2>أسئلة شائعة</h2>
      {detail.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
    </div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
  </main>;
}
