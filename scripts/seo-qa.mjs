#!/usr/bin/env node

/**
 * SEO QA Validation Script
 * Checks for common SEO issues in the codebase.
 * Run: node scripts/seo-qa.mjs
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const issues = [];
const warnings = [];

function check(file, message, severity = "error") {
  const entry = { file, message, severity };
  if (severity === "error") issues.push(entry);
  else warnings.push(entry);
}

function walkDir(dir, ext = ".tsx") {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkDir(full, ext));
    } else if (extname(full) === ext) {
      files.push(full);
    }
  }
  return files;
}

// 1. Check all page files for canonical URLs
console.log("🔍 Checking canonical URLs...");
const pageFiles = walkDir("app", ".tsx").filter(
  (f) => f.includes("/page.tsx") && !f.includes("not-found")
);
for (const file of pageFiles) {
  const content = readFileSync(file, "utf8");
  if (!content.includes("alternates") && !content.includes("canonical")) {
    check(file, "Missing canonical URL (alternates.canonical)");
  }
}

// 2. Check for /clusters/ references (should be /categories/)
console.log("🔍 Checking for old /clusters/ references...");
const allTsx = walkDir(".", ".tsx").concat(walkDir(".", ".ts"));
for (const file of allTsx) {
  if (file.includes("node_modules") || file.includes(".next")) continue;
  const content = readFileSync(file, "utf8");
  if (content.includes("/clusters/") && !file.includes("next.config")) {
    check(file, "Contains old /clusters/ reference (should be /categories/)");
  }
}

// 3. Check robots.txt
console.log("🔍 Checking robots.txt...");
const robotsFile = "app/robots.ts";
const robotsContent = readFileSync(robotsFile, "utf8");
const requiredBots = ["Googlebot", "Bingbot", "OAI-SearchBot"];
for (const bot of requiredBots) {
  if (!robotsContent.includes(bot)) {
    check(robotsFile, `Missing robot rule for ${bot}`);
  }
}

// 4. Check sitemap
console.log("🔍 Checking sitemap...");
const sitemapFile = "app/sitemap.ts";
const sitemapContent = readFileSync(sitemapFile, "utf8");
if (!sitemapContent.includes("lastModified")) {
  check(sitemapFile, "Sitemap missing lastModified");
}
if (!sitemapContent.includes("changeFrequency")) {
  check(sitemapFile, "Sitemap missing changeFrequency");
}
if (!sitemapContent.includes("priority")) {
  check(sitemapFile, "Sitemap missing priority");
}

// 5. Check for OG images
console.log("🔍 Checking OpenGraph configuration...");
const layoutFile = "app/layout.tsx";
const layoutContent = readFileSync(layoutFile, "utf8");
if (!layoutContent.includes("openGraph")) {
  check(layoutFile, "Missing OpenGraph metadata");
}
if (!layoutContent.includes("twitter")) {
  check(layoutFile, "Missing Twitter metadata");
}

// 6. Check for structured data
console.log("🔍 Checking structured data...");
const homeFile = "app/page.tsx";
const homeContent = readFileSync(homeFile, "utf8");
if (!homeContent.includes("WebSite")) {
  check(homeFile, "Missing WebSite schema on homepage");
}
if (!homeContent.includes("BreadcrumbList")) {
  check(homeFile, "Missing BreadcrumbList schema on homepage");
}

// 7. Check article pages for Article schema
console.log("🔍 Checking article schemas...");
const articleFiles = walkDir("app/articles", ".tsx").filter((f) => f.includes("[slug]"));
for (const file of articleFiles) {
  const content = readFileSync(file, "utf8");
  if (!content.includes("Article")) {
    check(file, "Missing Article schema");
  }
  if (!content.includes("BreadcrumbList")) {
    check(file, "Missing BreadcrumbList schema");
  }
}

// 8. Check for llms.txt
console.log("🔍 Checking llms.txt...");
import { existsSync } from "fs";
if (!existsSync("public/llms.txt")) {
  check("public/llms.txt", "Missing llms.txt for AI crawlers");
}

// 9. Check for duplicate titles across pages
console.log("🔍 Checking for duplicate titles...");
const titles = [];
for (const file of pageFiles) {
  const content = readFileSync(file, "utf8");
  const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
  if (titleMatch) {
    const title = titleMatch[1];
    if (titles.some((t) => t.title === title)) {
      check(file, `Duplicate title: "${title}"`);
    }
    titles.push({ file, title });
  }
}

// 10. Check for missing descriptions
console.log("🔍 Checking for missing descriptions...");
for (const file of pageFiles) {
  const content = readFileSync(file, "utf8");
  if (!content.includes("description:") && !content.includes("description =")) {
    check(file, "Missing meta description", "warn");
  }
}

// 11. Check for noindex on non-published articles
console.log("🔍 Checking noindex handling...");
const articlePageFile = "app/articles/[slug]/page.tsx";
const articleContent = readFileSync(articlePageFile, "utf8");
if (!articleContent.includes("robots:") && !articleContent.includes("noindex")) {
  check(articlePageFile, "Missing noindex handling for non-published articles");
}

// 12. Check for redirect configuration
console.log("🔍 Checking redirect configuration...");
const nextConfigFile = "next.config.ts";
const nextConfigContent = readFileSync(nextConfigFile, "utf8");
if (!nextConfigContent.includes("redirects")) {
  check(nextConfigFile, "Missing redirect configuration");
}

// Report
console.log("\n" + "=".repeat(60));
console.log("📊 SEO QA Report");
console.log("=".repeat(60));

if (issues.length === 0 && warnings.length === 0) {
  console.log("✅ All checks passed! No issues found.");
} else {
  if (issues.length > 0) {
    console.log(`\n❌ ${issues.length} errors found:\n`);
    for (const issue of issues) {
      console.log(`  🔴 ${issue.file}`);
      console.log(`     ${issue.message}`);
    }
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} warnings:\n`);
    for (const warning of warnings) {
      console.log(`  🟡 ${warning.file}`);
      console.log(`     ${warning.message}`);
    }
  }
}

console.log("\n" + "=".repeat(60));
process.exit(issues.length > 0 ? 1 : 0);
