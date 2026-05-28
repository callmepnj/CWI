import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cockroach Watch India Live Newsroom social preview";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F5E8D0",
          color: "#1D120A",
          padding: "64px",
          fontFamily: "Arial, sans-serif",
          border: "18px solid #1F5A24"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              padding: "14px 22px",
              borderRadius: "10px",
              background: "#1F5A24",
              color: "#F5E8D0",
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: 3
            }}
          >
            CWI LIVE NEWSROOM
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#7A4A22" }}>Source trail. Corrections open.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 0.95, fontWeight: 900, letterSpacing: -2 }}>
            Cockroach Watch India
          </div>
          <div style={{ marginTop: 28, width: 210, height: 10, background: "#D97918" }} />
          <div style={{ marginTop: 24, fontSize: 34, lineHeight: 1.25, color: "#3A2415", maxWidth: 940 }}>
            What changed today. What is verified. What still needs answers.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 24, fontWeight: 900, color: "#1F5A24" }}>
          <span>Live Newsroom</span>
          <span>|</span>
          <span>India Unanswered Files</span>
          <span>|</span>
          <span>Archive</span>
          <span>|</span>
          <span>Submit Source</span>
        </div>
      </div>
    ),
    size
  );
}