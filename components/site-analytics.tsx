"use client";
import { useEffect } from "react";
import { recordTaskEvent } from "@/lib/task-events";
import { Analytics } from "@vercel/analytics/next";
export function SiteAnalytics() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.origin);
      if (anchor.dataset.taskEvent === "search_result_click") recordTaskEvent("search_result_click");
      else if (anchor.closest("main") && url.protocol === "https:" && ( /(^|\.)gov\.eg$/i.test(url.hostname) || ["support.google.com", "support.microsoft.com", "support.apple.com"].includes(url.hostname) )) recordTaskEvent("official_service_click", { destination_host: url.hostname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return <Analytics beforeSend={(event) => {
    if (navigator.doNotTrack === "1") return null;
    const url = new URL(event.url);
    url.search = "";
    url.hash = "";
    return { ...event, url: url.toString() };
  }} />;
}
