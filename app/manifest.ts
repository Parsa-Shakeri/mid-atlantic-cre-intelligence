import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mid-Atlantic CRE Intelligence",
    short_name: "MACRE Intelligence",
    description: "Independent student research on Mid-Atlantic commercial real estate.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: "#10263d",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
