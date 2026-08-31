import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Capital Parcel",
    short_name: "Capital Parcel",
    description: "Independent commercial property research for the Capital Region.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: "#10263d",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
