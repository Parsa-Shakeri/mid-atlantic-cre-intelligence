import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<div style={{ alignItems: "center", background: "#071a2c", color: "#f5f1e8", display: "flex", fontFamily: "Georgia, serif", height: "100%", justifyContent: "center", position: "relative", width: "100%" }}><span style={{ fontSize: 220, fontWeight: 500, letterSpacing: -18 }}>M</span><span style={{ background: "#c96743", bottom: 44, height: 14, left: 72, position: "absolute", width: 368 }} /></div>, size);
}
