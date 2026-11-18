import { NextResponse, type NextRequest } from "next/server";
import { encyclopediaCategories } from "./lib/encyclopedia-taxonomy";
import { topicSectionSlug } from "./lib/topic-section-slugs";

// Combine host and path normalization into a single application redirect.
export function proxy(request: NextRequest) {
  const target = new URL(request.url);
  const host = request.headers.get("host")?.split(":")[0];
  const isProductionHost = host === "lusaill.online" || host === "www.lusaill.online";
  const originalPath = target.pathname;
  const cleanPath = originalPath.length > 1 ? originalPath.replace(/\/+$/, "") : originalPath;
  const aliases: Record<string, string> = {
    "/services/electricity-bill-inquiry": "/articles/electricity-bill-inquiry",
    "/categories/housing-utilities": "/categories/fawatir-alkahraba",
    "/articles/شركة-جنوب-الدلتا-لتوزيع-الكهرباء": "/articles/south-delta-electricity",
  };
  let decodedPath = cleanPath;
  try { decodedPath = decodeURIComponent(cleanPath); } catch { /* Keep malformed URLs for routing. */ }
  target.pathname = aliases[decodedPath] ?? (cleanPath === "/clusters" ? "/categories" : cleanPath.replace(/^\/clusters\//, "/categories/"));
  // Old query filters and previously shared Arabic section paths must continue
  // to resolve, but use ASCII canonical paths to avoid Unicode route mismatches.
  const root = new RegExp("^/topics/([a-z0-9-]+)$").exec(decodedPath);
  const requestedSection = target.searchParams.get("section");
  const requestedPage = target.searchParams.get("page");
  const validExtraPage = requestedPage !== null &&
    new RegExp("^(?:[2-9]|[1-9][0-9]+)$").test(requestedPage) &&
    Number.isSafeInteger(Number(requestedPage));
  let normalizedTopicFilter = false;

  if (root && requestedSection && (requestedPage === null || requestedPage === "1" || validExtraPage)) {
    const category = encyclopediaCategories.find(item => item.slug === root[1]);
    if (category?.subtopics.includes(requestedSection)) {
      target.pathname = "/topics/" + category.slug + "/section/" + topicSectionSlug(requestedSection) +
        (validExtraPage ? "/page/" + requestedPage : "");
      target.searchParams.delete("section");
      target.searchParams.delete("page");
      normalizedTopicFilter = true;
    }
  }
  const oldSectionPath = new RegExp("^/topics/([a-z0-9-]+)/section/([^/]+)(?:/page/([1-9][0-9]*))?$").exec(decodedPath);
  if (oldSectionPath) {
    const category = encyclopediaCategories.find(item => item.slug === oldSectionPath[1]);
    const label = category?.subtopics.find(item => item === oldSectionPath[2]);
    if (label) {
      target.pathname = "/topics/" + category!.slug + "/section/" + topicSectionSlug(label) +
        (oldSectionPath[3] ? "/page/" + oldSectionPath[3] : "");
      normalizedTopicFilter = true;
    }
  }

  const needsHost = isProductionHost && (host !== "www.lusaill.online" || request.headers.get("x-forwarded-proto") === "http");
  if (isProductionHost) { target.protocol = "https:"; target.hostname = "www.lusaill.online"; target.port = ""; }
  if (needsHost || target.pathname !== originalPath) return NextResponse.redirect(target, normalizedTopicFilter ? 308 : 301);
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
