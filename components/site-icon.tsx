import type { SVGProps } from "react";
export type IconName = "search" | "book" | "arrow" | "menu" | "close" | "shield" | "bolt" | "document" | "car" | "screen" | "grid" | "clock" | "check";
export function SiteIcon({ name, className, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return <svg width="20" height="20" viewBox="0 0 24 24" className={["site-icon", className].filter(Boolean).join(" ")} aria-hidden="true" {...props}><use href={`/site-icons.svg#${name}`} /></svg>;
}
