import { absoluteUrl } from "./site-config";
export function pageAlternates(path: string) {
  const url = absoluteUrl(path);
  return { canonical: url, languages: { "ar-EG": url, "x-default": url } };
}
