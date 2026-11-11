// Verify the two repaired company guides are both crawlable and search-ready.
// Usage: node scripts/verify-electricity-pages.mjs http://127.0.0.1:3000
import assert from "node:assert/strict";

const origin = process.argv[2] ?? "http://127.0.0.1:3000";
const slugs = ["south-cairo-electricity", "north-delta-electricity"];
const site = await fetch(new URL("/sitemap-articles.xml", origin));
assert.equal(site.status, 200, "article sitemap response");
const sitemap = await site.text();

for (const slug of slugs) {
  const canonical = `https://www.lusaill.online/articles/${slug}`;
  const url = new URL(`/articles/${slug}`, origin);
  const response = await fetch(url);
  assert.equal(response.status, 200, `${slug}: HTTP 200`);
  const html = await response.text();
  assert(!/<meta\\s+name="robots"[^>]*noindex/i.test(html), `${slug}: must be indexable before inclusion in sitemap`);
  assert(sitemap.includes(`<loc>${canonical}</loc>`), `${slug}: missing from XML sitemap`);
  assert(html.includes('href="/articles/electricity-bill-inquiry"'), `${slug}: missing central hub link`);
  assert(html.includes('application/ld+json'), `${slug}: missing JSON-LD`);
  const block = sitemap.slice(sitemap.indexOf(`<loc>${canonical}</loc>`), sitemap.indexOf("</url>", sitemap.indexOf(`<loc>${canonical}</loc>`)));
  assert(block.includes("2026-11-11"), `${slug}: content update should be dated, not deploy-timestamped`);
  console.log(`SEARCH_READY ${slug}`);
}
console.log("ELECTRICITY_SITEMAP_PASS");
