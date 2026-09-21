#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";

const outputDir = await mkdtemp(join(tmpdir(), "lusaill-seo-audit-"));
const server = createServer((request, response) => {
  const base = `http://127.0.0.1:${server.address().port}`;
  if (request.url === "/sitemap.xml") {
    response.writeHead(200, { "content-type": "application/xml" });
    response.end(`<?xml version="1.0"?><urlset><url><loc>${base}/</loc><lastmod>2026-09-21</lastmod></url><url><loc>${base}/article</loc></url><url><loc>${base}/old</loc></url></urlset>`);
    return;
  }
  if (request.url === "/old") {
    response.writeHead(301, { location: `${base}/article` });
    response.end();
    return;
  }
  if (request.url === "/image.webp") {
    response.writeHead(200, { "content-type": "image/webp", "content-length": "4" });
    response.end("test");
    return;
  }
  const isArticle = request.url === "/article";
  const title = isArticle ? "دليل اختبار مقال عربي محسن لمحركات البحث" : "لوسيل — موسوعة عربية عملية موثقة";
  const description = isArticle
    ? "وصف تجريبي كافٍ لاختبار مدقق الوصف التعريفي وضمان استخراج البيانات الأساسية من صفحة المقال بصورة صحيحة ومنظمة."
    : "موسوعة عربية عملية تقدم معلومات واضحة وخطوات موثقة ومراجعة لمساعدة القارئ على تنفيذ الخدمات والإجراءات اليومية بسهولة.";
  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(`<!doctype html><html lang="ar"><head><title>${title}</title><meta name="description" content="${description}"><meta name="robots" content="index, follow"><link rel="canonical" href="${base}${request.url}"><script type="application/ld+json">{"@context":"https://schema.org","@type":"Article"}</script></head><body><h1>${title}</h1><h2>قسم</h2><p>هذا نص تجريبي للتحقق من عد الكلمات والروابط الداخلية.</p><a href="${base}/article">رابط داخلي</a>${isArticle ? `<img src="${base}/image.webp">` : ""}</body></html>`);
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", resolve);
});

const sitemap = `http://127.0.0.1:${server.address().port}/sitemap.xml`;
const child = spawn(process.execPath, ["scripts/seo-audit.mjs", "--sitemap", sitemap, "--output", outputDir, "--concurrency", "2"], {
  cwd: process.cwd(),
  stdio: "inherit",
});
const exitCode = await new Promise((resolve) => child.once("exit", resolve));
server.close();
assert.equal(exitCode, 0, "SEO audit CLI should exit successfully");

const summary = JSON.parse(await readFile(join(outputDir, "seo-summary.json"), "utf8"));
const pages = JSON.parse(await readFile(join(outputDir, "seo-master-sheet.json"), "utf8"));
assert.equal(summary.auditedUrls, 3);
assert.equal(summary.non200, 1);
assert.equal(summary.failedPages, 0);
assert.equal(summary.pagesWithAltIssues, 1);
assert.equal(pages.find((page) => page.url.endsWith("/old")).statusCode, 301);
assert.ok(pages.find((page) => page.url.endsWith("/old")).redirectDestination.endsWith("/article"));
console.log("SEO audit integration test passed.");
