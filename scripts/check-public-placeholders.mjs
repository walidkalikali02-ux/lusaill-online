// Fail the build if draft-only editorial text leaks into reader-facing source files.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
const roots = ["app", "components", "lib"];
const terms = ["إضافات ذات قيمة", "صور مقترحة", "روابط داخلية تخطيطية", "بيانات تجريبية مختلقة"];
const skipped = new Set(["lib/editorial-indexing.ts"]);
const extensions = /\.(?:ts|tsx|json)$/;
const problems = [];
let checked = 0;
function walk(dir) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, ent.name).replaceAll("\\", "/");
    if (ent.isDirectory()) { walk(path); continue; }
    if (!ent.isFile() || !extensions.test(path) || skipped.has(path)) continue;
    checked++;
    const lines = readFileSync(path, "utf8").split(/\r?\n/u);
    lines.forEach((line, index) => {
      for (const phrase of terms) {
        if (line.includes(phrase)) problems.push({ path, line: index + 1, phrase });
      }
    });
  }
}
roots.forEach(walk);
for (const p of problems) console.error("DRAFT_LEAK " + JSON.stringify(p));
if (problems.length) {
  console.error("FAIL: " + problems.length + " editorial placeholder(s) found in " + checked + " reader-facing source files.");
  process.exitCode = 1;
} else {
  console.log("PASS: no editorial placeholder phrases found in " + checked + " source files.");
}
