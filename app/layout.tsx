import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: "لوسيل | موسوعة عربية للخدمات والإجراءات الحكومية",
    template: "%s | لوسيل",
  },
  description: siteConfig.description,
  creator: siteConfig.publisher,
  publisher: siteConfig.name,
  authors: [{ name: siteConfig.publisher }],
  alternates: {
    canonical: "/",
  },
  category: "government",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  keywords: ["فواتير الكهرباء", "شركات توزيع الكهرباء", "تعلم القيادة", "خدمات إلكترونية", "أدلة عربية"],
  other: {
    "geo.region": siteConfig.geo.region,
    "geo.placename": siteConfig.geo.placename,
    ICBM: siteConfig.geo.icbm,
    "theme-color": "#145da0",
    ...Object.fromEntries(
      [
        siteConfig.verification.google ? ["google-site-verification", siteConfig.verification.google] : null,
        siteConfig.verification.bing ? ["msvalidate.01", siteConfig.verification.bing] : null,
      ].filter(Boolean) as [string, string][]
    ),
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: "لوسيل | موسوعة عربية للخدمات والإجراءات الحكومية",
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "لوسيل",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg"), width: 64, height: 64 },
    description: siteConfig.description,
    areaServed: {
      "@type": "Country",
      name: siteConfig.market,
    },
    sameAs: [],
  };

  return (
    <html lang={siteConfig.language} dir="rtl">
      <head>
        <link rel="alternate" type="application/rss+xml" href={absoluteUrl("/feed.xml")} />
        <meta name="theme-color" content="#145da0" />
        <meta name="color-scheme" content="light" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">انتقل إلى المحتوى</a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </body>
    </html>
  );
}
