import assert from "node:assert/strict";

const origin = process.argv[2] ?? "http://127.0.0.1:3028";
const get = async (path) => {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, path);
  return response.text();
};

for (const [slug, expected, unrelated] of [
  ["google-backup-codes", "/guides/account-security", "/guides/pensions"],
  ["newborn-birth-registration-egypt", "/guides/birth-documents", "/guides/slides-build"],
]) {
  const html = await get(`/articles/${slug}`);
  assert(html.includes(`href="${expected}"`));
  assert(!html.includes(`href="${unrelated}"`));
}
for (const slug of ["apply", "eligibility", "documents", "post-office", "track"]) {
  const html = await get(`/articles/old-rent-housing-${slug}`);
  assert(html.includes('id="deadline-status"'), slug);
  if (slug === "apply") assert(!html.match(/<title>(.*?)<\/title>/)[1].includes("قبل 12"));
}
const category = await get("/categories/fawatir-alkahraba");
assert(category.indexOf('id="category-articles-title"') < category.indexOf("كيف تستخدم أدلة هذا التصنيف"));
console.log("PASS: rendered recommendations, all 5 deadline notices, current housing title, category directory order");
