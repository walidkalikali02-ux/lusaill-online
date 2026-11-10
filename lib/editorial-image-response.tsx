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
function coverWords(title: string) {
  const normalized = title.replace(/\s+/gu, " ").trim();
  const words = normalized.split(" ");
  const limited = words.length > 17 ? words.slice(0, 17) : words;
  const cut = Math.max(1, Math.min(limited.length - 1, Math.round(limited.length * 0.47)));
  const primary = limited.slice(0, cut).join(" ");
  const emphasized = limited.slice(cut).join(" ");
  return {
    primary,
    emphasized: emphasized || primary,
    titleWasShortened: limited.length < words.length,
  };
}

/**
 * Editorial 2026 image format: an original Lusaill newsmagazine layout.
 * It uses the *existing article-specific illustration* as a visual source,
 * and gives every eligible slug a fresh PNG cover, not a generic shared photo.
 * The source artwork remains accessible and credited where it was originally.
 */
export async function createEditorialCoverImage(subject: VisualSubject) {
  const theme = themeFor(subject.category);
  const [font, art] = await Promise.all([getArabicFont(), coverArtUrl(subject.image)]);
  const family = font ? "Almarai" : "sans-serif";
  const { primary, emphasized, titleWasShortened } = coverWords(subject.title);
  const count = primary.length + emphasized.length;
  const primarySize = count > 100 ? 29 : count > 70 ? 36 : 44;
  const emphasizedSize = emphasized.length > 50 ? 29 : emphasized.length > 34 ? 34 : 42;
  const seed = hashText(subject.title);
  const artSpot = seed % 3 === 0 ? "40% 50%" : seed % 3 === 1 ? "65% 48%" : "50% 50%";

  return new ImageResponse(
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      fontFamily: family, background: "#FAFBF8", overflow: "hidden",
    }}>
      <div style={{
        width: "100%", height: 93, display: "flex", flexDirection: "row",
        alignItems: "center", justifyContent: "space-between",
        background: "#F8FBFA", padding: "16px 43px", flexShrink: 0,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 11, background: theme.bg,
          padding: "11px 20px", borderRadius: 33, color: "#FFFFFF",
          fontSize: 21, fontWeight: 800,
        }}>
          <span style={{
            display: "flex", width: 20, height: 20, borderRadius: 5,
            transform: "rotate(18deg)", background: theme.accent,
          }} />
          {subject.category}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0, direction: "rtl" }}>
          <div style={{ display: "flex", color: "#081D32", fontSize: 34, fontWeight: 900, lineHeight: 1.25 }}>لوسيل</div>
          <div style={{ display: "flex", color: "#334F63", fontSize: 13, lineHeight: 1.3 }}>LUSAILL.ONLINE</div>
        </div>
      </div>
      <div style={{
        display: "flex", position: "relative", height: 537, width: "100%",
        background: theme.bg, flexDirection: "row",
      }}>
        <div style={{
          display: "flex", position: "relative", width: "51%", height: "100%",
          flexShrink: 0, background: "linear-gradient(137deg, " + theme.secondary + ", " + theme.bg + ")",
          overflow: "hidden",
        }}>
          {art ? (
            <img src={art} alt="" height={537} width={612} style={{
              width: "100%", height: "100%", objectFit: "cover", objectPosition: artSpot,
            }} />
          ) : (
            <div style={{
              display: "flex", position: "absolute", width: 440, height: 440,
              left: -115, top: 30, border: "58px solid " + theme.accent,
              borderRadius: seed % 2 ? 105 : 220, transform: "rotate(-22deg)",
              opacity: 0.7,
            }} />
          )}
          <div style={{
            display: "flex", position: "absolute", width: 340, height: 340,
            border: "3px solid " + theme.accent, borderRadius: 170,
            right: -145, bottom: -180, opacity: .85,
          }} />
          <div style={{
            display: "flex", position: "absolute", height: 9, width: 120,
            left: 40, bottom: 35, background: theme.accent, borderRadius: 5,
          }} />
        </div>
        <div style={{
          display: "flex", position: "relative", width: "49%", height: "100%",
          flexDirection: "column", justifyContent: "space-between", alignItems: "stretch",
          background: "linear-gradient(130deg," + theme.bg + ", #061527)",
          color: "white", padding: "33px 38px 35px 31px", direction: "rtl",
        }}>
          <div style={{ display: "flex", width: 105, height: 5, background: theme.accent, borderRadius: 4 }} />
          <div style={{
            display: "flex", flexDirection: "column", flex: 1,
            justifyContent: "center", gap: 15, minWidth: 0,
          }}>
            <div style={{
              display: "flex", width: "100%", color: "#FFFFFF",
              fontSize: primarySize, fontWeight: 900, lineHeight: 1.45,
              overflowWrap: "break-word", textAlign: "right",
            }}>{primary}</div>
            <div style={{
              display: "flex", padding: "13px 16px 14px", borderRadius: 19,
              background: theme.accent, color: theme.bg, fontSize: emphasizedSize,
              fontWeight: 900, lineHeight: 1.43, overflowWrap: "break-word",
              textAlign: "right", width: "100%",
            }}>{emphasized}</div>
          </div>
          <div style={{
            display: "flex", flexDirection: "column", gap: 8, textAlign: "right",
          }}>
            <div style={{
              display: "flex", color: "#D6E5EB", fontSize: 17, lineHeight: 1.5,
            }}>{titleWasShortened ? subject.title : (subject.subtitle ?? "دليل مصور بمصادر موثوقة")}</div>
            <div style={{ display: "flex", color: theme.accent, fontSize: 14, letterSpacing: 1 }}>LUSAILL.ONLINE</div>
          </div>
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
