// Canonicalize only numeric category pagination; never touch search/auth/tool queries.
export function categoryPageNumber(value?: string | string[]): number | null {
  if (value === undefined) return 1;
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : null;
}

export function normalizeCategoryPagination(url: URL): void {
  if (!/^\/categories\/[^/]+$/.test(url.pathname)) return;
  const values = url.searchParams.getAll("page");
  if (values.length !== 1 || !/^\d+$/.test(values[0])) return;
  const page = Number(values[0]);
  if (!Number.isSafeInteger(page) || page < 1) return;
  if (page === 1) url.searchParams.delete("page");
  else if (values[0] !== String(page)) url.searchParams.set("page", String(page));
}
