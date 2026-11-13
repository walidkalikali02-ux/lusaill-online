import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";

export async function GET() {
  const html = await readFile(join(process.cwd(), "app", "knowledge", "manahej", "qatar", "grade-1", "math", "math.html"), "utf8");
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
