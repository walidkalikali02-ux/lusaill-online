// Retired encyclopedia topic with no equivalent in the current service guide site.
export function GET() {
  return new Response("هذا المقال القديم أزيل ولا يوجد له بديل مطابق. تصفح الأدلة الحالية: https://www.lusaill.online/guides", {
    status: 410,
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex, follow", "Cache-Control": "public, max-age=3600" },
  });
}
