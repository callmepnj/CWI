import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cockroach Watch India Document Verify Amplify social preview";
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
          background: "linear-gradient(135deg, #0B1220 0%, #102A63 52%, #0B5CFF 100%)",
          color: "white",
          padding: "70px",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              padding: "16px 24px",
              borderRadius: "999px",
              background: "#FFD23F",
              color: "#0B1220",
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: 3
            }}
          >
            CWI CIVIC WATCH
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#D8E8FF" }}>India is watching</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, lineHeight: 0.95, fontWeight: 900, letterSpacing: -4 }}>
            Cockroach Watch India
          </div>
          <div style={{ marginTop: 30, fontSize: 44, fontWeight: 900, color: "#FFD23F" }}>
            Document. Verify. Amplify.
          </div>
          <div style={{ marginTop: 22, fontSize: 32, lineHeight: 1.25, color: "#DCEBFF", maxWidth: 940 }}>
            The youth are not silent. India is watching.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 24, fontWeight: 800, color: "#BFD7FF" }}>
          <span>Youth voice</span>
          <span>•</span>
          <span>Public issues</span>
          <span>•</span>
          <span>Civic satire</span>
          <span>•</span>
          <span>Creator credit</span>
        </div>
      </div>
    ),
    size
  );
}
