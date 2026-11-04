import type { MetadataRoute } from "next";

const xml = (value: string) => value.replace(/[&<>"']/g, (char) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!);

export function articleSitemapXml(rows: MetadataRoute.Sitemap): string {
  return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' +
    rows.map((row) => "<url><loc>" + xml(row.url) + "</loc>" +
      (row.lastModified ? "<lastmod>" + new Date(row.lastModified).toISOString() + "</lastmod>" : "") +
      [...new Set(row.images ?? [])].map((image) => "<image:image><image:loc>" + xml(image) + "</image:loc></image:image>").join("") +
      "</url>").join("") + "</urlset>";
}
