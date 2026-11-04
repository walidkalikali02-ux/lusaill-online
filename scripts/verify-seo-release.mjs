// Run the release gate against the exact deployment tree, then crawl its built server.
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
const run = (args) => {
  const result = spawnSync(process.execPath, args, { stdio: "inherit", env: process.env });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, args.join(" "));
};
run(["node_modules/eslint/bin/eslint.js", "proxy.ts", "lib/category-pagination.ts", "lib/article-sitemap-xml.ts", "app/categories", "app/sitemap-articles.xml", "app/articles", "scripts/test-crawl-normalization.mts", "scripts/verify-seo-release.mjs"]);
run(["--import", "tsx", "scripts/test-crawl-normalization.mts"]);
run(["scripts/seo-qa.mjs"]);
run(["scripts/check-guide-paths.mjs"]);
run(["node_modules/next/dist/bin/next", "build"]);
const origin = "http://127.0.0.1:3049";
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", "3049"], { stdio: "inherit", env: process.env });
try {
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    try { ready = (await fetch(origin, { signal: AbortSignal.timeout(3000) })).status === 200; } catch {}
    if (ready) break;
    if (server.exitCode !== null) throw new Error("Built server exited during startup");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  assert(ready, "Built server must become ready");
  for (const [path, target] of [
    ["/categories/digital-life?page=01", "/categories/digital-life"],
    ["/categories/digital-life?page=02", "/categories/digital-life?page=2"],
    ["/categories/digital-life/?page=02", "/categories/digital-life?page=2"],
  ]) {
    const response = await fetch(origin + path, { redirect: "manual" });
    assert.equal(response.status, 301, path);
    const location = new URL(response.headers.get("location"), origin);
    assert.equal(location.pathname + location.search, target);
    assert.equal((await fetch(location, { redirect: "manual" })).status, 200, "No second redirect");
  }
  for (const page of ["2e0", "2.0", "0", "-1", "invalid", "999999", "2&page=3"]) {
    assert.equal((await fetch(origin + "/categories/digital-life?page=" + page)).status, 404, page);
  }
  const sitemap = await (await fetch(origin + "/sitemap-articles.xml")).text();
  assert(sitemap.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'));
  assert(sitemap.includes("<image:loc>https://www.lusaill.online/images/articles/alexandria-electricity.webp</image:loc>"));
  assert(sitemap.includes("<lastmod>2026-11-04T00:00:00.000Z</lastmod>"), "Preserve substantive tax-guide update");
  run(["scripts/check-site.mjs", origin, "--skip-external-images"]);
  run(["scripts/test-rendered-seo.mjs", origin]);
  console.log("PASS: built-site full crawl, 301 normalization without chains, invalid-page 404 and preserved image sitemap");
} finally {
  server.kill("SIGTERM");
}
