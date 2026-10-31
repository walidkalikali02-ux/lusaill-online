import assert from "node:assert/strict";

const origin = process.argv[2] ?? "http://127.0.0.1:3028";
const get = async (path) => {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, path);
  return response.text();
};

for (const [slug, expected, unrelated] of [
  ["google-backup-codes", "/guides/account-security", "/guides/pensions"],
  ["newborn-birth-registration-egypt", "/guides/birth-certificates", "/guides/slides-build"],
]) {
  const html = await get(`/articles/${slug}`);
  assert(html.includes(`href="${expected}"`));
  assert(!html.includes(`href="${unrelated}"`));
}
for (const slug of ["apply", "eligibility", "documents", "post-office", "track"]) {
  const html = await get(`/articles/old-rent-housing-${slug}`);
  const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  assert(body.includes('تحقق من إتاحة التقديم قبل بدء إجراء جديد') && body.includes('قد مضى'), slug);
  if (slug === "apply") assert(!html.match(/<title>(.*?)<\/title>/)[1].includes("قبل 12"));
}
const category = await get("/categories/fawatir-alkahraba");
assert(category.includes('id="category-articles-title"'));
assert(category.includes('كيف تستخدم أدلة هذا التصنيف'));
assert(category.includes('href="/articles/'));
assert(!category.includes('href="/articles/undefined"'));
console.log("PASS: rendered recommendations, all 5 deadline notices, current housing title, crawlable category directory");
