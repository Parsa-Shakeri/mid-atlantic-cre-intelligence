import type { MetadataRoute } from "next";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const corePages: MetadataRoute.Sitemap = ["", "/properties", "/research", "/dashboard", "/coverage", "/project", "/changelog", "/corrections", "/about", "/methodology"].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: path === "" || path === "/properties" || path === "/research" || path === "/dashboard" || path === "/coverage" || path === "/changelog" ? "weekly" : "monthly", priority: path === "" ? 1 : 0.7 }));
  const client = createPublicSupabaseClient();
  if (!client) return corePages;
  const [propertyResult, researchResult] = await Promise.all([
    client.from("properties").select("slug, updated_at").eq("is_sample", false).order("updated_at", { ascending: false }).limit(5000),
    client.from("articles").select("slug, updated_at, featured").eq("status", "published").eq("is_sample", false).order("updated_at", { ascending: false }).limit(5000),
  ]);
  const propertyPages: MetadataRoute.Sitemap = propertyResult.error ? [] : (propertyResult.data ?? []).map((property) => ({ url: `${baseUrl}/properties/${property.slug}`, lastModified: new Date(property.updated_at), changeFrequency: "monthly", priority: 0.6 }));
  const researchPages: MetadataRoute.Sitemap = researchResult.error ? [] : (researchResult.data ?? []).map((article) => ({ url: `${baseUrl}/research/${article.slug}`, lastModified: new Date(article.updated_at), changeFrequency: "monthly", priority: article.featured ? 0.8 : 0.6 }));
  return [...corePages, ...propertyPages, ...researchPages];
}
