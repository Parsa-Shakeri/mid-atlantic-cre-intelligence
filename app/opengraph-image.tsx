import { ImageResponse } from "next/og";

export const alt = "Capital Parcel — Public records, made useful";
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ background: "#071a2c", color: "#f5f1e8", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: "64px 72px", position: "relative", width: "100%" }}>
      <div style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px)", backgroundSize: "48px 48px", inset: 0, maskImage: "linear-gradient(90deg, transparent, black)", position: "absolute" }} />
      <div style={{ alignItems: "center", display: "flex", fontFamily: "Arial, sans-serif", fontSize: 20, fontWeight: 700, justifyContent: "space-between", letterSpacing: 3, position: "relative", textTransform: "uppercase" }}>
        <span>Capital Parcel</span><span style={{ color: "#c96743", fontFamily: "monospace", fontSize: 16 }}>MD / DC / VA</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{ color: "#c96743", fontFamily: "Arial, sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: 4, marginBottom: 24, textTransform: "uppercase" }}>Independent commercial property research</div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Georgia, serif", fontSize: 76, letterSpacing: -4, lineHeight: 0.92, maxWidth: 880 }}><span>Find the deal.</span><span style={{ color: "#aeb9bf", fontStyle: "italic", marginTop: 10 }}>Trace the evidence.</span></div>
      </div>
      <div style={{ alignItems: "center", borderTop: "1px solid rgba(255,255,255,.16)", display: "flex", fontFamily: "Arial, sans-serif", fontSize: 15, justifyContent: "space-between", letterSpacing: 2, paddingTop: 24, position: "relative", textTransform: "uppercase" }}>
        <span style={{ color: "rgba(255,255,255,.62)" }}>Transactions · comparables · public evidence</span><span style={{ color: "#c96743" }}>Capital Region research</span>
      </div>
    </div>,
    size,
  );
}
