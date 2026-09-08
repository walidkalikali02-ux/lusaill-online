import { NextResponse } from "next/server";

/**
 * IndexNow API endpoint
 * Submit URLs to search engines (Bing, Yandex, etc.) when content changes.
 *
 * Usage: POST /api/indexnow
 * Body: { "url": "https://lusaill.online/articles/some-article" }
 * Or:   { "urls": ["url1", "url2"] }
 *
 * Requires an IndexNow key (generate at https://www.indexnow.org/)
 * Set INDEXNOW_KEY environment variable.
 */
export async function POST(request: Request) {
  const key = process.env.INDEXNOW_KEY;

  if (!key) {
    return NextResponse.json(
      { error: "IndexNow key not configured. Set INDEXNOW_KEY environment variable." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const urls: string[] = body.urls || (body.url ? [body.url] : []);

    if (urls.length === 0) {
      return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
    }

    // Validate URLs are from our domain
    const validUrls = urls.filter((url) => url.startsWith("https://lusaill.online"));
    if (validUrls.length === 0) {
      return NextResponse.json({ error: "All URLs must be from lusaill.online" }, { status: 400 });
    }

    // Submit to IndexNow endpoint (Bing/Yandex)
    const endpoints = [
      "https://api.indexnow.org/indexnow",
    ];

    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            host: "lusaill.online",
            key,
            keyLocation: `https://lusaill.online/${key}.txt`,
            urlList: validUrls,
          }),
        });
        return { endpoint, status: response.status, ok: response.ok };
      })
    );

    return NextResponse.json({
      submitted: validUrls.length,
      results: results.map((r) => r.status === "fulfilled" ? r.value : { error: r.reason }),
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "IndexNow API endpoint. POST with { url: string } or { urls: string[] }",
    documentation: "https://www.indexnow.org/documentation",
  });
}
