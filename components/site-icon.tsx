import type { SVGProps } from "react";
export type IconName = "search" | "book" | "arrow" | "menu" | "close" | "shield" | "bolt" | "document" | "car" | "screen" | "grid" | "clock" | "check";
const paths: Record<IconName, string> = {
  search: "m21 21-4.5-4.5M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z",
  book: "M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1m0-15c3-2 7-2 10-1v15c-3-1-7-1-10 1V5Z",
  arrow: "M19 12H5m6-6-6 6 6 6", menu: "M4 6h16M4 12h16M4 18h16", close: "m6 6 12 12M18 6 6 18",
  shield: "m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Zm-4 10 3 3 5-6",
  bolt: "m13 2-9 12h7l-1 8 10-13h-7l1-7Z", document: "M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8M8 16h8",
  car: "m5 6-3 7v6h3v-3h14v3h3v-6l-3-7H5Zm-3 7h20M6 13v3m12-3v3", screen: "M2 3h20v14H2V3Zm6 18h8m-4-4v4",
  grid: "M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z", clock: "M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z", check: "m5 12 4 4L19 6",
};
export function SiteIcon({name,...props}:{name:IconName}&SVGProps<SVGSVGElement>) {return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>;}
