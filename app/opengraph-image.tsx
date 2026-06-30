import { ImageResponse } from "next/og";

// Route segment config
export const alt = "Talal Majeed — Software Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraph() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0f",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* accent rule + tag */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "64px", height: "4px", background: "#ff5436" }} />
          <div
            style={{
              color: "#9a958c",
              fontSize: "26px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Portfolio
          </div>
        </div>

        {/* name + role */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: "128px",
              fontWeight: 600,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              color: "#f0ede6",
            }}
          >
            Talal&nbsp;<span style={{ color: "#ff5436" }}>Majeed</span>
          </div>
          <div
            style={{
              marginTop: "24px",
              fontSize: "40px",
              fontWeight: 300,
              color: "#9a958c",
            }}
          >
            Software Developer
          </div>
        </div>

        {/* tagline */}
        <div
          style={{
            fontSize: "30px",
            lineHeight: 1.4,
            color: "#9a958c",
            maxWidth: "900px",
          }}
        >
          Software &amp; AI engineer · cloud infrastructure, intelligent agents,
          and full-stack platforms.
        </div>
      </div>
    ),
    { ...size }
  );
}
