import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<div style={{ alignItems: "center", background: "#10263d", color: "#ffffff", display: "flex", flexDirection: "column", fontFamily: "Arial, sans-serif", height: "100%", justifyContent: "center", width: "100%" }}><span style={{ fontSize: 112, fontWeight: 700, letterSpacing: 10 }}>MAC</span><span style={{ color: "#dce1e3", fontSize: 28, letterSpacing: 8, marginTop: 20 }}>CRE INTELLIGENCE</span></div>, size);
}
