import type { MetadataRoute } from "next";
import { getSiteUrl, shouldIndexSite } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();
  const rules = shouldIndexSite()
    ? { userAgent: "*", allow: "/", disallow: ["/admin/", "/admin"] }
    : { userAgent: "*", disallow: "/" };
  return { rules, sitemap: `${baseUrl}/sitemap.xml`, host: baseUrl };
}
