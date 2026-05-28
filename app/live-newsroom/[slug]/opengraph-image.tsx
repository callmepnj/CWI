import { ImageResponse } from "next/og";
import { getItemBySlug } from "@/data/live-newsroom";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  const title = item?.title ?? "CWI Live Newsroom";
  const summary = item?.summary ?? "Daily source-led civic update from Cockroach Watch India.";
  const label = item ? `${item.status} / ${item.category}` : "Live Newsroom";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FDF8F3",
          color: "#1A1410",
          border: "18px solid #1B5E20",
          padding: "48px",
          fontFamily: "Arial, sans-serif",
          position: "relative"
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 18, background: "#F57C00" }} />
        <div style={{ position: "absolute", right: 50, top: 70, fontSize: 130, fontWeight: 900, color: "rgba(27,94,32,0.08)" }}>CWI</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              padding: "12px 20px",
              borderRadius: 999,
              background: "#1B5E20",
              color: "#FDF8F3",
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: 2
            }}
          >
            CWI LIVE NEWSROOM
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#5D4037" }}>{label}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}>
          <div style={{ fontSize: 66, lineHeight: 0.98, fontWeight: 900 }}>{title}</div>
          <div style={{ marginTop: 24, fontSize: 28, lineHeight: 1.25, color: "#5D4037" }}>{summary}</div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 23, fontWeight: 900, color: "#1B5E20" }}>
          <span>What changed today</span>
          <span style={{ color: "#F57C00" }}>/</span>
          <span>Corrections open</span>
          <span style={{ color: "#F57C00" }}>/</span>
          <span>cockroachwatchindia.online</span>
        </div>
      </div>
    ),
    size
  );
}
