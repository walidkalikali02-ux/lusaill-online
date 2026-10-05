"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function pageView(pathname: string) {
  if (navigator.doNotTrack === "1") return;
  let referrer = "";
  try {
    const url = new URL(document.referrer);
    referrer = `${url.origin}${url.pathname}`;
  } catch { /* Empty referrer on a direct visit. */ }
  window.gtag?.("event", "page_view", {
    page_title: document.title,
    page_location: `${window.location.origin}${pathname}`,
    page_referrer: referrer,
  });
}

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  useEffect(() => { pageView(pathname); }, [pathname]);

  return <Script
    id="ga4-library"
    src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
    strategy="afterInteractive"
    onReady={() => {
      if (navigator.doNotTrack === "1" || window.gtag) return;
      window.dataLayer ??= [];
      window.gtag = (...args) => { window.dataLayer!.push(args); };
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      pageView(pathname);
    }}
  />;
}
