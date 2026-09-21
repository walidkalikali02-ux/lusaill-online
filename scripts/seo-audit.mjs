#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const DEFAULT_SITEMAP = "https://www.lusaill.online/sitemap.xml";
const DEFAULT_LIMIT = 100;
const DEFAULT_CONCURRENCY = 6;

function parseArgs(argv) {
  const options = {
    sitemap: DEFAULT_SITEMAP,
    urlsFile: "",
    output: `reports/seo-audit/${new Date().toISOString().slice(0, 10)}`,
    limit: DEFAULT_LIMIT,
    concurrency: DEFAULT_CONCURRENCY,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--sitemap" && value) options.sitemap = value;
    if (key === "--urls" && value) options.urlsFile = value;
    if (key === "--output" && value) options.output = value;
    if (key === "--limit" && value) options.limit = Math.max(1, Math.min(10000, Number(value) || DEFAULT_LIMIT));
    if (key === "--concurrency" && value) options.concurrency = Math.max(1, Math.min(20, Number(value) || DEFAULT_CONCURRENCY));
  }
  return options;
}

function decodeHtml(value = "") {
  const named = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match)
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(value = "") {
  return decodeHtml(value.replace(/<[^>]*>/g, " "));
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return decodeHtml(match?.[1] ?? match?.[2] ?? match?.[3] ?? "");
}

function getMeta(html, name, attribute = "name") {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    if (attr(tag, attribute).toLowerCase() === name.toLowerCase()) return attr(tag, "content");
  }
  return "";
}

function getCanonical(html, baseUrl) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    if (attr(tag, "rel").toLowerCase().split(/\s+/).includes("canonical")) {
      const href = attr(tag, "href");
      try { return href ? new URL(href, baseUrl).toString() : ""; } catch { return href; }
    }
  }
  return "";
}

function getHeadings(html, level) {
  const pattern = new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)<\\/h${level}>`, "gi");
  return [...html.matchAll(pattern)].map((match) => stripTags(match[1])).filter(Boolean);
}

function visibleText(html) {
  return stripTags(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg\b[\s\S]*?<\/svg>/gi, " "),
  );
}

function countWords(text) {
  return text ? text.split(/\s+/u).filter(Boolean).length : 0;
}

function pageType(url) {
  const path = new URL(url).pathname;
  if (path === "/") return "Homepage";
  if (path === "/articles") return "Article Index";
  if (path.startsWith("/articles/")) return "Article";
  if (path === "/categories") return "Category Index";
  if (path.startsWith("/categories/")) return "Category";
  if (path === "/entities") return "Entity Index";
  if (path.startsWith("/entities/")) return "Entity";
  if (path === "/courses/learn-driving") return "Course";
  if (path.startsWith("/courses/learn-driving/")) return "Course Lesson";
  return "Static Page";
}

function parseSchemas(html) {
  const types = new Set();
  const blocks = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(decodeHtml(match[1]));
      blocks.push(data);
      const visit = (node) => {
        if (!node || typeof node !== "object") return;
        const type = node["@type"];
        if (Array.isArray(type)) type.forEach((item) => types.add(String(item)));
        else if (type) types.add(String(type));
        if (Array.isArray(node["@graph"])) node["@graph"].forEach(visit);
      };
      if (Array.isArray(data)) data.forEach(visit);
      else visit(data);
    } catch {
      types.add("INVALID_JSON_LD");
    }
  }
  return { types: [...types], blocks: blocks.length };
}

function extractLinks(html, baseUrl) {
  const origin = new URL(baseUrl).origin;
  const links = [];
  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const href = attr(match[0], "href");
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript):/i.test(href)) continue;
    try {
      const url = new URL(href, baseUrl);
      links.push({ url: url.toString(), internal: url.origin === origin });
    } catch { /* ignore malformed hrefs */ }
  }
  return links;
}

function extractImages(html, baseUrl) {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => {
    const tag = match[0];
    const src = attr(tag, "src");
    let url = src;
    try { url = src ? new URL(src, baseUrl).toString() : ""; } catch { /* keep raw src */ }
    const hasAlt = /\salt\s*=/i.test(tag);
    const alt = attr(tag, "alt");
    return { url, alt, altIssue: !hasAlt ? "Missing alt" : alt ? "" : "Empty alt" };
  });
}

async function fetchWithRedirects(url, init = {}, maxRedirects = 8) {
  const chain = [];
  let current = url;
  for (let attempt = 0; attempt <= maxRedirects; attempt += 1) {
    const response = await fetch(current, {
      ...init,
      redirect: "manual",
      headers: { "user-agent": "LusaillSEOAudit/1.0 (+https://www.lusaill.online)", ...(init.headers ?? {}) },
      signal: AbortSignal.timeout(20000),
    });
    chain.push({ url: current, status: response.status });
    if (![301, 302, 303, 307, 308].includes(response.status)) return { response, finalUrl: current, chain };
    const location = response.headers.get("location");
    if (!location) return { response, finalUrl: current, chain };
    current = new URL(location, current).toString();
  }
  throw new Error(`Too many redirects for ${url}`);
}

async function mapLimit(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

async function readSitemap(url, visited = new Set()) {
  if (visited.has(url)) return [];
  visited.add(url);
  const { response } = await fetchWithRedirects(url);
  if (!response.ok) throw new Error(`Sitemap returned ${response.status}: ${url}`);
  const xml = await response.text();
  const entries = [...xml.matchAll(/<url>\s*([\s\S]*?)<\/url>/gi)].map((match) => ({
    url: decodeHtml(match[1].match(/<loc>([\s\S]*?)<\/loc>/i)?.[1] ?? ""),
    lastmod: decodeHtml(match[1].match(/<lastmod>([\s\S]*?)<\/lastmod>/i)?.[1] ?? ""),
  })).filter((entry) => entry.url);
  if (entries.length) return entries;
  const childMaps = [...xml.matchAll(/<sitemap>\s*([\s\S]*?)<\/sitemap>/gi)]
    .map((match) => decodeHtml(match[1].match(/<loc>([\s\S]*?)<\/loc>/i)?.[1] ?? ""))
    .filter(Boolean);
  const nested = await Promise.all(childMaps.map((child) => readSitemap(child, visited)));
  return nested.flat();
}

async function loadTargets(options) {
  if (!options.urlsFile) return (await readSitemap(options.sitemap)).slice(0, options.limit);
  const raw = await readFile(resolve(options.urlsFile), "utf8");
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));
  const start = lines[0]?.toLowerCase().startsWith("url") ? 1 : 0;
  return lines.slice(start, start + options.limit).map((line) => {
    const [url, primaryKeyword = ""] = line.split(",").map((part) => part.trim().replace(/^"|"$/g, ""));
    return { url, lastmod: "", primaryKeyword };
  });
}

const imageCache = new Map();
async function auditImage(image) {
  if (!image.url) return { ...image, status: 0, bytes: 0, broken: true };
  if (!imageCache.has(image.url)) {
    imageCache.set(image.url, (async () => {
      try {
        let result = await fetchWithRedirects(image.url, { method: "HEAD" });
        if ([403, 405].includes(result.response.status)) {
          result = await fetchWithRedirects(image.url, { method: "GET", headers: { range: "bytes=0-0" } });
        }
        return {
          status: result.response.status,
          bytes: Number(result.response.headers.get("content-length") ?? 0),
          finalUrl: result.finalUrl,
          broken: result.response.status >= 400 || result.response.status === 0,
        };
      } catch (error) {
        return { status: 0, bytes: 0, finalUrl: image.url, broken: true, error: error.message };
      }
    })());
  }
  return { ...image, ...(await imageCache.get(image.url)) };
}

async function auditPage(target, options) {
  const checkedAt = new Date().toISOString();
  try {
    const result = await fetchWithRedirects(target.url);
    const response = result.response;
    const initialStatus = result.chain[0]?.status ?? response.status;
    const contentType = response.headers.get("content-type") ?? "";
    const html = initialStatus === 200 && contentType.includes("text/html") ? await response.text() : "";
    const title = stripTags(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const metaDescription = getMeta(html, "description");
    const h1s = getHeadings(html, 1);
    const h2s = getHeadings(html, 2);
    const canonical = getCanonical(html, result.finalUrl);
    const robots = [getMeta(html, "robots"), response.headers.get("x-robots-tag") ?? ""].filter(Boolean).join(", ");
    const links = extractLinks(html, result.finalUrl);
    const images = extractImages(html, result.finalUrl);
    const auditedImages = await mapLimit(images, Math.min(3, options.concurrency), auditImage);
    const schemas = parseSchemas(html);
    const noindex = /(?:^|[,\s])noindex(?:$|[,\s])/i.test(robots);
    const indexable = initialStatus === 200 && !noindex;
    const primaryKeyword = target.primaryKeyword || h1s[0] || title.split("|")[0].trim();
    return {
      url: target.url,
      pageType: pageType(target.url),
      primaryKeyword,
      title,
      metaDescription,
      h1: h1s[0] ?? "",
      h1Count: h1s.length,
      h2: h2s,
      statusCode: initialStatus,
      finalStatusCode: response.status,
      redirectDestination: result.chain.length > 1 ? result.finalUrl : "",
      redirectChain: result.chain,
      canonical,
      canonicalMatches: canonical ? canonical.replace(/\/$/, "") === result.finalUrl.replace(/\/$/, "") : false,
      robots,
      indexability: indexable ? "Indexable" : "Not indexable",
      wordCount: countWords(visibleText(html)),
      internalLinks: links.filter((link) => link.internal).length,
      externalLinks: links.filter((link) => !link.internal).length,
      images: auditedImages.length,
      imageDetails: auditedImages,
      altIssues: auditedImages.filter((image) => image.altIssue).length,
      brokenImages: auditedImages.filter((image) => image.broken).length,
      schema: schemas.types,
      schemaBlocks: schemas.blocks,
      sitemapLastmod: target.lastmod || "",
      lastChecked: checkedAt,
      error: "",
    };
  } catch (error) {
    return {
      url: target.url, pageType: pageType(target.url), primaryKeyword: target.primaryKeyword || "", title: "", metaDescription: "",
      h1: "", h1Count: 0, h2: [], statusCode: 0, finalStatusCode: 0, redirectDestination: "", redirectChain: [], canonical: "", canonicalMatches: false,
      robots: "", indexability: "Not indexable", wordCount: 0, internalLinks: 0, externalLinks: 0, images: 0, imageDetails: [],
      altIssues: 0, brokenImages: 0, schema: [], schemaBlocks: 0, sitemapLastmod: target.lastmod || "", lastChecked: checkedAt,
      error: error.message,
    };
  }
}

function applyDuplicateChecks(pages) {
  const titleCounts = new Map();
  const metaCounts = new Map();
  for (const page of pages) {
    if (page.statusCode !== 200) continue;
    if (page.title) titleCounts.set(page.title, (titleCounts.get(page.title) ?? 0) + 1);
    if (page.metaDescription) metaCounts.set(page.metaDescription, (metaCounts.get(page.metaDescription) ?? 0) + 1);
  }
  return pages.map((page) => {
    const titleIssues = [];
    if (page.statusCode === 200 && !page.title) titleIssues.push("Missing title");
    else if (page.statusCode === 200) {
      if (page.title.length < 30) titleIssues.push("Title too short");
      if (page.title.length > 60) titleIssues.push("Title too long");
      if ((titleCounts.get(page.title) ?? 0) > 1) titleIssues.push("Duplicate title");
      if (page.primaryKeyword && !page.title.toLocaleLowerCase("ar").includes(page.primaryKeyword.toLocaleLowerCase("ar"))) titleIssues.push("Primary keyword absent from title");
    }
    const metaIssues = [];
    if (page.statusCode === 200 && !page.metaDescription) metaIssues.push("Missing meta description");
    else if (page.statusCode === 200) {
      if (page.metaDescription.length < 100) metaIssues.push("Meta too short");
      if (page.metaDescription.length > 165) metaIssues.push("Meta too long");
      if ((metaCounts.get(page.metaDescription) ?? 0) > 1) metaIssues.push("Duplicate meta description");
    }
    const technicalIssues = [];
    if (page.statusCode !== 200) technicalIssues.push(`HTTP ${page.statusCode || "error"}`);
    if (page.statusCode === 200 && !page.canonical) technicalIssues.push("Missing canonical");
    else if (page.statusCode === 200 && !page.canonicalMatches) technicalIssues.push("Canonical mismatch");
    if (page.statusCode === 200 && page.h1Count !== 1) technicalIssues.push(`${page.h1Count} H1 elements`);
    if (page.brokenImages) technicalIssues.push(`${page.brokenImages} broken images`);
    if (page.altIssues) technicalIssues.push(`${page.altIssues} alt issues`);
    if (page.schema.includes("INVALID_JSON_LD")) technicalIssues.push("Invalid JSON-LD");
    return { ...page, titleIssues, metaIssues, technicalIssues };
  });
}

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(pages) {
  const columns = [
    ["URL", "url"], ["Page Type", "pageType"], ["Primary Keyword", "primaryKeyword"], ["Title", "title"],
    ["Title Issues", "titleIssues"], ["Meta Description", "metaDescription"], ["Meta Issues", "metaIssues"], ["H1", "h1"],
    ["H1 Count", "h1Count"], ["Status Code", "statusCode"], ["Final Status Code", "finalStatusCode"], ["Redirect Destination", "redirectDestination"], ["Canonical", "canonical"],
    ["Indexability", "indexability"], ["Robots", "robots"], ["Word Count", "wordCount"], ["Internal Links", "internalLinks"],
    ["Images", "images"], ["Alt Issues", "altIssues"], ["Broken Images", "brokenImages"], ["Schema", "schema"],
    ["Technical Issues", "technicalIssues"], ["Sitemap Lastmod", "sitemapLastmod"], ["Last Checked", "lastChecked"], ["Error", "error"],
  ];
  return [columns.map(([label]) => csvEscape(label)).join(","), ...pages.map((page) => columns.map(([, key]) => csvEscape(page[key])).join(","))].join("\n");
}

function summarize(pages) {
  const count = (predicate) => pages.filter(predicate).length;
  return {
    generatedAt: new Date().toISOString(),
    auditedUrls: pages.length,
    indexable: count((page) => page.indexability === "Indexable"),
    non200: count((page) => page.statusCode !== 200),
    missingTitles: count((page) => page.statusCode === 200 && !page.title),
    duplicateTitles: count((page) => page.titleIssues.includes("Duplicate title")),
    missingMetaDescriptions: count((page) => page.statusCode === 200 && !page.metaDescription),
    duplicateMetaDescriptions: count((page) => page.metaIssues.includes("Duplicate meta description")),
    canonicalIssues: count((page) => page.statusCode === 200 && (!page.canonical || !page.canonicalMatches)),
    h1Issues: count((page) => page.statusCode === 200 && page.h1Count !== 1),
    pagesWithAltIssues: count((page) => page.altIssues > 0),
    pagesWithBrokenImages: count((page) => page.brokenImages > 0),
    pagesWithInvalidSchema: count((page) => page.schema.includes("INVALID_JSON_LD")),
    failedPages: count((page) => Boolean(page.error)),
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const targets = await loadTargets(options);
  if (!targets.length) throw new Error("No URLs found. Provide --sitemap or --urls.");
  console.log(`Auditing ${targets.length} URL(s) with concurrency ${options.concurrency}...`);
  const rawPages = await mapLimit(targets, options.concurrency, async (target, index) => {
    const page = await auditPage(target, options);
    console.log(`[${index + 1}/${targets.length}] ${page.statusCode || "ERR"} ${target.url}`);
    return page;
  });
  const pages = applyDuplicateChecks(rawPages);
  const summary = summarize(pages);
  const outputDir = resolve(options.output);
  await mkdir(outputDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(outputDir, "seo-master-sheet.csv"), `\uFEFF${toCsv(pages)}`, "utf8"),
    writeFile(resolve(outputDir, "seo-master-sheet.json"), `${JSON.stringify(pages, null, 2)}\n`, "utf8"),
    writeFile(resolve(outputDir, "seo-summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
    writeFile(resolve(outputDir, "seo-issues.json"), `${JSON.stringify(pages.filter((page) => page.titleIssues.length || page.metaIssues.length || page.technicalIssues.length), null, 2)}\n`, "utf8"),
  ]);
  console.log(`Audit complete: ${outputDir}`);
  console.log(JSON.stringify(summary, null, 2));
  process.exitCode = summary.failedPages ? 2 : 0;
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
