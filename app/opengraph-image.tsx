import { ImageResponse } from "next/og";

export const alt = "شركة لوسيل — المعرفة والخدمات والمشاريع";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111715",
          color: "#f4f6ef",
          padding: "72px 84px",
          direction: "ltr",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#b8cdbf", letterSpacing: 2 }}>KNOWLEDGE / SERVICES / PROJECTS</div>
          <div style={{ display: "flex", width: 64, height: 64, borderRadius: 18, background: "#b8cdbf" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 102, fontWeight: 800, letterSpacing: -3 }}>LUSAILL</div>
          <div style={{ display: "flex", fontSize: 40, marginTop: 22, color: "#c1cec4" }}>Knowledge is the beginning. Impact is what we build.</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#a7b7ac" }}>www.lusaill.online</div>
      </div>
    ),
    size,
  );
}
