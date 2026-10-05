import { NextResponse, type NextRequest } from "next/server";

// Combine host and path normalization into a single application redirect.
export function proxy(request: NextRequest) {
  const target = new URL(request.url);
  const host = request.headers.get("host")?.split(":")[0];
  const isProductionHost = host === "lusaill.online" || host === "www.lusaill.online";
  const originalPath = target.pathname;
  const cleanPath = originalPath.length > 1 ? originalPath.replace(/\/+$/, "") : originalPath;
  const aliases: Record<string, string> = {
    "/categories/housing-utilities": "/categories/fawatir-alkahraba",
    "/articles/شركة-جنوب-الدلتا-لتوزيع-الكهرباء": "/articles/south-delta-electricity",
  };
  let decodedPath = cleanPath;
  try { decodedPath = decodeURIComponent(cleanPath); } catch { /* Keep malformed URLs for routing. */ }
  target.pathname = aliases[decodedPath] ?? (cleanPath === "/clusters" ? "/categories" : cleanPath.replace(/^\/clusters\//, "/categories/"));
  const needsHost = isProductionHost && (host !== "www.lusaill.online" || request.headers.get("x-forwarded-proto") === "http");
  if (isProductionHost) { target.protocol = "https:"; target.hostname = "www.lusaill.online"; target.port = ""; }
  if (needsHost || target.pathname !== originalPath) return NextResponse.redirect(target, 301);
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
