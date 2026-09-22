export async function GET() {
  return new Response("Gone", {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
