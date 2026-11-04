import { discoverableArticles } from "@/lib/cms/discovery-server";
import { searchGuides } from "@/lib/guide-search";
export async function GET(request: Request) {
  const query = (new URL(request.url).searchParams.get("q") ?? "").trim();
  const headers = { "X-Robots-Tag": "noindex", "Cache-Control": "public, max-age=30, s-maxage=60" };
  if (query.length > 200) return Response.json({ error: "QUERY_TOO_LONG" }, { status: 400, headers: { ...headers, "Cache-Control": "no-store" } });
  if (!query) return Response.json({ items: [], total: 0 }, { headers });
  try {
    const matches = searchGuides(await discoverableArticles(), query);
    return Response.json({ items: matches.slice(0, 6).map(({ slug, title }) => ({ slug, title })), total: matches.length }, { headers });
  } catch {
    return Response.json({ error: "SEARCH_UNAVAILABLE" }, { status: 503, headers: { ...headers, "Cache-Control": "no-store" } });
  }
}
