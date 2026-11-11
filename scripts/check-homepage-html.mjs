import { Buffer } from "node:buffer";

// Run after starting the built site, e.g.:
// npm run seo:homepage-budget -- http://127.0.0.1:3000
const origin = process.argv[2] ?? "http://127.0.0.1:3000";
const target = new URL("/", origin);
const response = await fetch(target, { headers: { "Accept-Encoding": "identity" } });
if (!response.ok) throw new Error(`Homepage returned HTTP ${response.status}`);
const html = await response.text();
const bytes = Buffer.byteLength(html, "utf8");
const budget = 150 * 1024;
const flightScripts = [...html.matchAll(/self\.__next_f/g)].length;
const result = { target: target.href, bytes, kib: +(bytes / 1024).toFixed(1), budgetBytes: budget, flightScripts, withinBudget: bytes < budget };
console.log(JSON.stringify(result, null, 2));
if (bytes >= budget) process.exitCode = 1;
