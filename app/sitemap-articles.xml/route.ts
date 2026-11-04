import { articleSitemapXml } from "@/lib/article-sitemap-xml";
import { sitemapGroups } from "@/lib/sitemaps";
import { publishedCmsDocuments } from "@/lib/cms/public";
import { absoluteUrl } from "@/lib/site-config";
export const dynamic = "force-dynamic";
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
    articleSitemapXml(rows),
    {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public,max-age=60",
      },
    },
  );
}
