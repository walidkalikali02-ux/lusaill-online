export type SearchItem = { slug: string; title: string; keyword: string; quickAnswer?: string };
export const normalizeSearch = (value: string) => value.normalize("NFKC").replace(/[ً-ْ]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").toLowerCase();
export function searchGuides<T extends SearchItem>(items: T[], query: string): T[] {
  const words = normalizeSearch(query).trim().split(/\s+/).filter(Boolean).slice(0, 20);
  return words.length ? items.filter((a) => words.every((word) => normalizeSearch(`${a.title} ${a.keyword} ${a.quickAnswer ?? ""}`).includes(word))) : [];
}
