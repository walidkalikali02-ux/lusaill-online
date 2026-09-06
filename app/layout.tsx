import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: "لوسيل | أدلة الخدمات المصرية اليومية",
    template: "%s | لوسيل",
  },
  description: siteConfig.description,
  creator: siteConfig.publisher,
  publisher: siteConfig.name,
  category: "government",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  keywords: ["فاتورة الكهرباء", "بوابة مصر الرقمية", "تجديد رخصة القيادة", "حماية المستهلك", "المحافظ الإلكترونية", "عقد ايجار"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: "لوسيل | أدلة الخدمات المصرية اليومية",
    description: siteConfig.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: "لوسيل", description: siteConfig.description },
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
    logo: { "@type": "ImageObject", url: absoluteUrl("/favicon.svg") },
    description: siteConfig.description,
  };

  return (
    <html lang={siteConfig.language} dir="rtl">
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
