import { ImageResponse } from "next/og";
import { absoluteUrl } from "@/lib/site-config";

export const COVER_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const MAP_IMAGE_SIZE = { width: 1200, height: 730 } as const;

export type VisualSubject = {
  title: string;
  category: string;
  image?: string;
  items?: string[];
  subtitle?: string;
};

type Theme = { bg: string; accent: string; secondary: string; soft: string };
function themeFor(category: string): Theme {
  if (/طاقة|كهرباء|سكن|منزل|مرافق/u.test(category))
    return { bg: "#0D2B3A", accent: "#FBC26B", secondary: "#1E9EAD", soft: "#D4E8E7" };
  if (/طب|صحة|غذاء|سلامة|علاج/u.test(category))
    return { bg: "#15362E", accent: "#C9E7B0", secondary: "#51A889", soft: "#D9ECE0" };
  if (/فيزياء|علوم|رياضيات|بحث|كيمياء/u.test(category))
    return { bg: "#1A2850", accent: "#C9D5FF", secondary: "#727EC7", soft: "#E2E8FB" };
  if (/قانون|جواز|مرور|وثائق|حكوم|سفر|جنسية|خدمات/u.test(category))
    return { bg: "#2C2747", accent: "#F4D19D", secondary: "#967EBD", soft: "#F1E5DF" };
  if (/تكنولوج|تقني|إنترنت|حاسوب|رقمي|كمبيوتر|الذكاء/u.test(category))
    return { bg: "#102643", accent: "#70E4D9", secondary: "#496ECA", soft: "#D4E8F8" };
  return { bg: "#17394B", accent: "#D9E8AA", secondary: "#5295A7", soft: "#E5F3ED" };
}

function hashText(value: string) {
  let h = 2166136261;
  for (const char of value) h = Math.imul(h ^ (char.codePointAt(0) ?? 0), 16777619);
  return h >>> 0;
}

const arabicFontUrl =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/almarai/Almarai-ExtraBold.ttf";

let fontPromise: Promise<ArrayBuffer | null> | null = null;
async function getArabicFont(): Promise<ArrayBuffer | null> {
  if (!fontPromise) {
    fontPromise = (async () => {
      try {
        const response = await fetch(arabicFontUrl, {
          cache: "force-cache",
          signal: AbortSignal.timeout(4500),
        });
        if (!response.ok) return null;
        const data = await response.arrayBuffer();
        return data.byteLength < 4_500_000 ? data : null;
      } catch {
        return null;
      }
    })();
  }
  return fontPromise;
}

async function coverArtUrl(image?: string): Promise<string | null> {
  if (!image) return null;
  try {
    const url = image.startsWith("/") ? absoluteUrl(image) : image;
    const parsed = new URL(url);
    const trustedHosts = ["www.lusaill.online", "lusaill.online", "commons.wikimedia.org", "upload.wikimedia.org"];
    if (parsed.protocol !== "https:" || !trustedHosts.includes(parsed.hostname)) return null;
    const response = await fetch(parsed.toString(), {
      cache: "force-cache",
      signal: AbortSignal.timeout(5500),
      headers: { Accept: "image/png,image/jpeg,image/webp,image/svg+xml,image/*;q=0.5" },
    });
    if (!response.ok) return null;
    const type = (response.headers.get("content-type") ?? "").split(";")[0].toLowerCase();
    if (!["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(type)) return null;
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > 2_800_000) return null;
    if (type === "image/svg+xml") {
      // Original educational diagrams may include Arabic SVG <text> labels.
      // Satori's nested-SVG rasterizer can show them as missing-glyph squares.
      // Keep the topic illustration's graphical shapes in social covers and
      // preserve the complete, accessible source SVG on the article page.
      const sourceSvg = Buffer.from(buffer).toString("utf8");
      const shapesOnly = sourceSvg
        .replace(/<text\b[^>]*>[\s\S]*?<\/text>/gi, "")
        .replace(/<foreignObject\b[^>]*>[\s\S]*?<\/foreignObject>/gi, "");
      return "data:image/svg+xml;base64," + Buffer.from(shapesOnly).toString("base64");
    }
    return "data:" + type + ";base64," + Buffer.from(buffer).toString("base64");
  } catch {
    return null;
  }
}
function titleFontSize(title: string) {
  if (title.length > 105) return 34;
  if (title.length > 80) return 39;
  if (title.length > 60) return 43;
  if (title.length > 42) return 49;
  if (title.length > 28) return 55;
  return 65;
}

function responseOptions(size: { width: number; height: number }, font: ArrayBuffer | null) {
  return {
    ...size,
    ...(font ? { fonts: [{ name: "Almarai", data: font, weight: 800 as const, style: "normal" as const }] } : {}),
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400" },
  };
}

/**
 * A genuine PNG cover for every published article route. Uses the existing
 * topic-specific photo/illustration when accessible. Never invents official
 * screenshots or silently substitutes a photo from an unrelated subject.
 */
export async function createEditorialCoverImage(subject: VisualSubject) {
  const theme = themeFor(subject.category);
  const variant = hashText(subject.title) % 3;
  const artOnRight = variant === 1;
  const [font, art] = await Promise.all([getArabicFont(), coverArtUrl(subject.image)]);
  const family = font ? "Almarai" : "sans-serif";
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: artOnRight ? "row-reverse" : "row", background: theme.bg, fontFamily: family, overflow: "hidden" }}>
      <div style={{ width: "43%", height: "100%", display: "flex", position: "relative", flexShrink: 0, overflow: "hidden", background: "linear-gradient(140deg, " + theme.secondary + ", " + theme.bg + ")" }}>
        {art ? (
          // next/og rasterizes the local/external editorial art into the PNG.
          <img src={art} alt="" width={520} height={630} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", width: 390, height: 390, border: "55px solid " + theme.accent, borderRadius: variant === 2 ? 88 : 200, opacity: 0.65, transform: "rotate(-18deg)" }} />
            <div style={{ display: "flex", width: 170, height: 170, border: "22px solid #ffffff", borderRadius: 60, position: "absolute", opacity: 0.36, transform: "rotate(22deg)" }} />
          </div>
        )}
        <div style={{ display: "flex", position: "absolute", width: 280, height: 280, borderRadius: 140, border: "3px solid " + theme.accent, bottom: -130, right: -120, opacity: 0.8 }} />
        <div style={{ display: "flex", position: "absolute", width: 100, height: 7, background: theme.accent, bottom: 49, left: 42 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "space-between", color: "#FFFFFF", padding: "47px 49px", direction: "rtl", background: "linear-gradient(160deg, " + theme.bg + ", #071725)" }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 47, width: 47, borderRadius: 13, background: theme.accent, color: theme.bg, fontSize: 25, fontWeight: 900 }}>ل</div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 900, color: "#FFFFFF" }}>لوسيل</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "right", gap: 15, width: "100%" }}>
          <div style={{ display: "flex", color: theme.accent, fontSize: 18, fontWeight: 700, textAlign: "right" }}>{subject.category}</div>
          <div style={{ display: "flex", width: "100%", color: "#FFFFFF", fontSize: titleFontSize(subject.title), fontWeight: 900, lineHeight: 1.52, textAlign: "right", overflowWrap: "break-word" }}>{subject.title}</div>
          <div style={{ display: "flex", color: theme.soft, fontSize: 17, lineHeight: 1.6 }}>{subject.subtitle ?? "معرفة واضحة بخطوات ومراجع"}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 15, color: theme.soft }}>
          <div style={{ display: "flex", width: 90, height: 4, background: theme.accent }} />
          <div style={{ display: "flex", fontSize: 14, letterSpacing: 2 }}>LUSAILL.ONLINE</div>
        </div>
      </div>
    </div>,
    responseOptions(COVER_IMAGE_SIZE, font),
  );
}

/** Visual synopsis uses only actual article step/section headings. */
export async function createEditorialMapImage(subject: VisualSubject) {
  const theme = themeFor(subject.category);
  const steps = (subject.items ?? []).filter(Boolean).slice(0, 4);
  const font = await getArabicFont();
  const family = font ? "Almarai" : "sans-serif";
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: "44px 52px", background: "#F6F7F2", color: theme.bg, direction: "rtl", fontFamily: family }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", borderBottom: "3px solid " + theme.secondary, paddingBottom: 17 }}>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 800 }}>خريطة مرئية للموضوع</div>
        <div style={{ display: "flex", color: theme.bg, fontSize: 20 }}>موسوعة لوسيل</div>
      </div>
      <div style={{ display: "flex", marginTop: 21, marginBottom: 28, fontSize: subject.title.length > 70 ? 25 : 32, fontWeight: 800, lineHeight: 1.5 }}>{subject.title}</div>
      <div style={{ display: "flex", flex: 1, width: "100%", flexWrap: "wrap", gap: 18 }}>
        {steps.map((text, i) => (
          <div key={i} style={{ width: "48.8%", height: "47%", display: "flex", flexDirection: "row", alignItems: "center", gap: 15, border: "2px solid #D9E5DE", background: "#FFFFFF", borderRadius: 19, padding: "20px 22px" }}>
            <div style={{ display: "flex", height: 64, width: 64, borderRadius: 20, background: theme.bg, color: theme.accent, fontWeight: 900, fontSize: 25, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</div>
            <div style={{ display: "flex", flex: 1, fontSize: text.length > 62 ? 18 : 23, fontWeight: 700, lineHeight: 1.7, overflowWrap: "break-word" }}>{text}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: 22, color: "#566570", fontSize: 17 }}>تلخيص تحريري لعناوين الأقسام — اقرأ التفاصيل والمراجع داخل المقال</div>
    </div>,
    responseOptions(MAP_IMAGE_SIZE, font),
  );
}
