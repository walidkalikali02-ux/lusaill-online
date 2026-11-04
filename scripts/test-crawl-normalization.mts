import assert from "node:assert/strict";
import { categoryPageNumber, normalizeCategoryPagination } from "../lib/category-pagination";
import { articleSitemapXml } from "../lib/article-sitemap-xml";
for (const [value, expected] of [[undefined, 1], ["1", 1], ["2", 2], ["0", null], ["-1", null], ["02", null], ["2e0", null], ["2.0", null], [" 2", null], ["", null], [["2", "3"], null], ["9007199254740992", null]] as const) {
  assert.equal(categoryPageNumber(Array.isArray(value) ? [...value] : value as string | undefined), expected);
}
for (const [input, expected] of [
  ["/categories/digital-life?page=01", "/categories/digital-life"],
  ["/categories/digital-life?page=002", "/categories/digital-life?page=2"],
  ["/categories/digital-life?page=2", "/categories/digital-life?page=2"],
  ["/categories/digital-life?page=1&utm_source=test", "/categories/digital-life?utm_source=test"],
  ["/categories/digital-life?page=2&page=3", "/categories/digital-life?page=2&page=3"],
  ["/categories/digital-life?page=2e0", "/categories/digital-life?page=2e0"],
  ["/categories/digital-life?page=0", "/categories/digital-life?page=0"],
  ["/search?q=test&page=01", "/search?q=test&page=01"],
  ["/admin?page=01", "/admin?page=01"],
  ["/courses/example?page=01", "/courses/example?page=01"],
]) {
  const url = new URL(input, "https://www.lusaill.online");
  normalizeCategoryPagination(url);
  assert.equal(url.pathname + url.search, expected);
  normalizeCategoryPagination(url);
  assert.equal(url.pathname + url.search, expected, "Normalization must be idempotent");
}
const output = articleSitemapXml([{ url: "https://www.lusaill.online/articles/example", lastModified: new Date("2026-10-22"), images: ["https://www.lusaill.online/image.webp?a=1&b=2", "https://www.lusaill.online/image.webp?a=1&b=2"] }, { url: "https://www.lusaill.online/articles/no-image" }]);
assert(output.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'));
assert.equal([...output.matchAll(/<image:loc>/g)].length, 1);
assert(output.includes("a=1&amp;b=2"));
assert(output.includes("<lastmod>2026-10-22T00:00:00.000Z</lastmod>"));
assert.equal([...output.matchAll(/<lastmod>/g)].length, 1, "Missing dates must stay omitted");
console.log("PASS: strict category pagination, canonical redirects, unrelated query preservation and image sitemap serialization");
