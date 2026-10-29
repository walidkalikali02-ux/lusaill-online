"use client";
import { track } from "@vercel/analytics";
type TaskEvent = "official_service_click" | "search_result_click" | "checklist_step_checked";
export function recordTaskEvent(name: TaskEvent, properties: { destination_host?: string; step?: number } = {}) {
  if (navigator.doNotTrack === "1") return;
  const data = { page_path: window.location.pathname, ...properties };
  track(name, data);
  const gtag = (window as Window & {gtag?: (...args: unknown[]) => void}).gtag;
  gtag?.("event", name, data);
}
