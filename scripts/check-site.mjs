// Verify built or deployed pages: node scripts/check-site.mjs http://127.0.0.1:3000
import assert from "node:assert/strict";
import { request } from "node:http";
const skipExternal = process.argv.includes("--skip-external-images");
const origin = process.argv[2] ?? "https://www.lusaill.online";
const official = "https://www.lusaill.online";
const local = (url) => new URL(new URL(url, official).pathname + new URL(url, official).search, origin);
const get = async (url) => { const r = await fetch(url); assert.equal(r.status, 200, `${url}: HTTP ${r.status}`); return r.text(); };
const sitemap = await get(`${origin}/sitemap.xml`);
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
assert(urls.length > 0);
assert.equal(new Set(urls).size, urls.length, "Duplicate sitemap URL");
assert(!sitemap.includes("/entities/metrash"), "Uncovered Qatar page must stay outside sitemap");
for (const image of sitemap.matchAll(/<image:loc>(.*?)<\/image:loc>/g)) {
  assert(/^https:\/\//.test(image[1]), `Relative sitemap image URL: ${image[1]}`);
}
const robots = await get(`${origin}/robots.txt`);
assert(robots.includes('Disallow: /api/') && robots.includes('Disallow: /admin/'), 'Crawler exclusions missing');
const categoryPath = '/categories/digital-life';
const firstCategory = await get(`${origin}${categoryPath}`);
const secondCategory = await get(`${origin}${categoryPath}?page=2`);
assert.notEqual(firstCategory.match(/<title>(.*?)<\/title>/)?.[1], secondCategory.match(/<title>(.*?)<\/title>/)?.[1], 'Pagination titles must differ');
assert(secondCategory.includes(`"url":"${official}${categoryPath}?page=2"`), 'Pagination schema URL mismatch');
assert(secondCategory.includes(`href="${categoryPath}"`), 'Pagination must link to canonical first page');
for (const page of ['0', '-1', 'invalid', '999999']) {
  assert.equal((await fetch(`${origin}${categoryPath}?page=${page}`)).status, 404, `Invalid pagination must return 404: ${page}`);
}
const titles = new Set(); const descriptions = new Set(); const links = new Set(); const images = new Set();
let articles = 0; let diagrams = 0; let howToCount = 0;
const homepage = await get(`${origin}/`);
const homeDescription = homepage.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? '';
assert(homeDescription.length >= 140 && homeDescription.length <= 155, 'Homepage description must be 140–155 characters');
assert(homepage.includes('id="deadlines-title"'), 'Deadline box missing');
if (new URL(origin).hostname === '127.0.0.1') {
  const apexRedirect = await new Promise((resolve, reject) => {
    const req = request(`${origin}/articles/old-rent-housing-apply?test=1`, { headers: { host: 'lusaill.online' } }, (response) => { response.resume(); resolve(response); });
    req.on('error', reject);
    req.end();
  });
  assert.equal(apexRedirect.statusCode, 301, 'Apex redirect must be 301');
  assert.equal(apexRedirect.headers.location, `${official}/articles/old-rent-housing-apply?test=1`, 'Redirect must preserve path and query');
}
for (const url of urls) {
  assert(url.startsWith(`${official}/`), `Noncanonical sitemap: ${url}`);
  const html = await get(local(url));
  assert(/<html[^>]*lang="ar"[^>]*dir="rtl"/.test(html), `Arabic direction missing: ${url}`);
  const headingLevels = [...html.matchAll(/<h([1-6])(?:\s|>)/g)].map((match) => Number(match[1]));
  for (let i = 1; i < headingLevels.length; i++) assert(headingLevels[i] <= headingLevels[i - 1] + 1, `Heading level skip: ${url}`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `H1 count: ${url}`);
  assert(!/<meta name="robots" content="[^"]*noindex/.test(html), `Noindex in sitemap: ${url}`);
  assert.equal(new URL(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? origin).href, new URL(url).href, `Canonical mismatch: ${url}`);
  assert.equal(new URL(html.match(/<meta property="og:url" content="([^"]+)"/)?.[1] ?? origin).href, new URL(url).href, `OG URL mismatch: ${url}`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1]; assert(title, `Missing title: ${url}`);
  assert(title.replace(/&amp;/g, "&").length <= 60, `Long title: ${url}`);
  assert(!titles.has(title), `Duplicate title: ${title}`); titles.add(title);
  const desc = html.match(/<meta name="description" content="([^"]+)"/)?.[1]; assert(desc, `Description missing: ${url}`);
  assert(desc.replace(/&amp;/g, "&").length <= 160, `Long description: ${url}`);
  assert(!descriptions.has(desc), `Duplicate description: ${url}`); descriptions.add(desc);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  assert(schemas.some((s) => s['@type'] === 'BreadcrumbList'), `Breadcrumb missing: ${url}`);
  if (new URL(url).pathname.startsWith('/courses/learn-driving/')) {
    assert(schemas.some((schema) => Array.isArray(schema['@type']) && schema['@type'].includes('Article')), `Course Article missing: ${url}`);
  }
  if (new URL(url).pathname.startsWith('/articles/')) {
    articles++;
    assert(schemas.some((s) => s['@type'] === 'Article'), `Article missing: ${url}`);
    assert.equal(schemas.some((s) => s['@type'] === 'FAQPage'), html.includes('id="faq"'), `FAQ schema must match visible FAQs: ${url}`);
    howToCount += schemas.some((s) => s['@type'] === 'HowTo') ? 1 : 0;
    assert(html.includes('id="sources"'), `Official source box missing: ${url}`);
    assert(html.includes('id="next-step"'), `Related next step missing: ${url}`);
    assert(html.includes('آخر مراجعة: <time'), `Last-reviewed date missing: ${url}`);
    assert(title.includes('2026:'), `Service/year title missing: ${url}`);
    assert.equal([...html.matchAll(/id="quick-answer"/g)].length, 1, `Answer duplication: ${url}`);
    assert(html.indexOf('id="quick-answer"') < html.indexOf('class="article-cover"'), `Answer follows cover: ${url}`);
    diagrams += html.includes('class="guide-figure"') ? 1 : 0;
  }
  for (const m of html.matchAll(/<a\b[^>]*href="(\/[^"]*)"/g)) if (!m[1].includes('#')) links.add(m[1].replace(/&amp;/g,'&'));
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    assert(/alt="[^"]+"/.test(m[0]), `Image without meaningful alt: ${url}`);
    const src = m[0].match(/src="([^"]+)"/)?.[1]?.replace(/&amp;/g,'&'); if(src) images.add(src);
  }
}
for (const path of links) await get(local(path));
for (const src of images) { if (skipExternal && (src.includes("url=https%3A") || src.startsWith("https://upload.wikimedia.org/"))) continue; const r = await fetch(src.startsWith("https://upload.wikimedia.org/") ? src : local(src)); assert.equal(r.status, 200, `Image unavailable: ${src}`); assert(r.headers.get('content-type')?.startsWith('image/'), `Not an image: ${src}`); }
const metrash = await get(`${origin}/entities/metrash`);
assert(/<meta name="robots" content="[^"]*noindex/.test(metrash));
assert(metrash.includes('"name":"قطر"'));
assert(!metrash.includes('metrash2.gov.eg'));
assert(howToCount > 0 && howToCount < articles / 4, 'HowTo must be used selectively');
console.log(JSON.stringify({ pages: urls.length, articles, howToCount, guidesWithInlineDiagrams: diagrams, internalLinks: links.size, images: images.size, result: "PASS" }));
