import { sitemapGroups } from "@/lib/sitemaps";
import { publishedCmsDocuments } from "@/lib/cms/public";
import { absoluteUrl } from "@/lib/site-config";
export const dynamic = "force-dynamic";
const xml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!,
  );
export async function GET() {
  const managed = await publishedCmsDocuments();
  const rows = sitemapGroups()["sitemap-articles.xml"].filter(
    (r) => !managed.some((d) => absoluteUrl(`/articles/${d.slug}`) === r.url),
  );
  rows.push(
    ...managed
      .filter((d) => d.status === "published")
      .map((d) => ({
        url: absoluteUrl(`/articles/${d.slug}`),
        lastModified: new Date(d.updatedAt),
      })),
  );
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      rows
        .map(
          (r) =>
            "<url><loc>" +
            xml(r.url) +
            "</loc>" +
            (r.lastModified
              ? "<lastmod>" +
                new Date(r.lastModified).toISOString() +
                "</lastmod>"
              : "") +
            "</url>",
        )
        .join("") +
      "</urlset>",
    {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public,max-age=60",
      },
    },
  );
}
