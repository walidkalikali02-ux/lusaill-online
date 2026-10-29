import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { pageAlternates } from "@/lib/page-alternates";
import type { Metadata } from "next";
import "./globals.css";
import "./editorial.css";
import "./identity.css";
import { SiteAnalytics } from "@/components/site-analytics";
import { GoogleAnalytics } from "@/components/google-analytics";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

const bodyFont = IBM_Plex_Sans_Arabic({ weight: ["400", "700"], subsets: ["arabic"], variable: "--font-arabic-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: "لوسيل | أدلة الخدمات المصرية والحياة الرقمية",
    template: "%s | لوسيل",
  },
  description: siteConfig.description,
  creator: siteConfig.publisher,
  publisher: siteConfig.name,
  authors: [{ name: siteConfig.publisher }],
  alternates: pageAlternates("/"),
  category: "reference",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  keywords: ["فواتير الكهرباء", "شركات توزيع الكهرباء", "تعلم القيادة", "خدمات إلكترونية", "أدلة عربية"],
  other: {
    "geo.region": siteConfig.geo.region,
    "geo.placename": siteConfig.geo.placename,
    ICBM: siteConfig.geo.icbm,
    "theme-color": "#182e49",
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
    title: "لوسيل | أدلة الخدمات المصرية والحياة الرقمية",
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
  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg"), width: 64, height: 64 },
    description: siteConfig.description,
    areaServed: {
      "@type": "Place",
      name: siteConfig.market,
    },
    sameAs: [],
  };

  return (
    <html lang={siteConfig.language} dir="rtl" className={bodyFont.variable}>
      <head>
        <link rel="alternate" type="application/rss+xml" href={absoluteUrl("/feed.xml")} />
        <meta name="theme-color" content="#182e49" />
        <meta name="color-scheme" content="light" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">انتقل إلى المحتوى</a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <SiteAnalytics />
        {measurementId && /^G-[A-Z0-9]+$/.test(measurementId) && <GoogleAnalytics measurementId={measurementId} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </body>
    </html>
  );
}
