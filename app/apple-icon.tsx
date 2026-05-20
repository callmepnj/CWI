import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 512,
  height: 512
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B1220 0%, #0B5CFF 100%)",
          color: "#FFD23F",
          fontSize: 180,
          fontWeight: 900,
          fontFamily: "Arial, sans-serif"
        }}
      >
        CWI
      </div>
    ),
    size
  );
}
