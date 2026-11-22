export type InlineLinkPart = { kind: "text"; text: string } | { kind: "link"; label: string; href: string };

// Parse the link subset used by authored knowledge paragraphs; leave all other
// Markdown and invalid destinations as plain text. Never interpret HTML.
export function parseInlineLinks(text: string): InlineLinkPart[] {
  const parts: InlineLinkPart[] = [];
  const origin = "https://www.lusaill.online";
  let cursor = 0;
  for (const match of text.matchAll(/\[([^\]\n]+)\]\(/g)) {
    const start = match.index;
    if (start < cursor) continue;
    const urlStart = start + match[0].length;
    let end = urlStart;
    let depth = 1;
    while (end < text.length && depth > 0) {
      if (text[end] === "(") depth += 1;
      if (text[end] === ")") depth -= 1;
      if (depth > 0) end += 1;
    }
    if (depth !== 0) continue;
    const raw = text.slice(urlStart, end);
    if (/\s/.test(raw) || !/^(https?:\/\/|\/(?!\/)|#)/i.test(raw)) continue;
    let url: URL;
    try { url = new URL(raw, origin); } catch { continue; }
    if (url.protocol !== "https:" && url.protocol !== "http:") continue;
    if (start > cursor) parts.push({ kind: "text", text: text.slice(cursor, start) });
    const href = raw.startsWith("#") ? raw : url.origin === origin ? url.pathname + url.search + url.hash : url.href;
    parts.push({ kind: "link", label: match[1], href });
    cursor = end + 1;
  }
  if (cursor < text.length) parts.push({ kind: "text", text: text.slice(cursor) });
  return parts;
}
