import { ImageResponse } from "next/og";

export const alt = "لوسيل — أدلة عربية عملية موثقة";
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
          background: "#f7f3ea",
          color: "#102a43",
          padding: "72px 84px",
          direction: "ltr",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#145da0", letterSpacing: 2 }}>ARABIC PRACTICAL GUIDES</div>
          <div style={{ display: "flex", width: 64, height: 64, borderRadius: 18, background: "#145da0" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 102, fontWeight: 800, letterSpacing: -3 }}>LUSAILL</div>
          <div style={{ display: "flex", fontSize: 40, marginTop: 22, color: "#334e68" }}>Clear information. Practical next steps.</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#627d98" }}>www.lusaill.online</div>
      </div>
    ),
    size,
  );
}
