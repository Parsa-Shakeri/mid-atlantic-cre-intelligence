import { describe, expect, it } from "vitest";
import { getSiteUrl, shouldIndexSite } from "../lib/site-url";

describe("deployment URL and indexing policy", () => {
  it("prefers and normalizes the explicit public URL", () => {
    expect(getSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://research.example.com/path" })).toBe("https://research.example.com");
  });

  it("uses Vercel production and preview host values when needed", () => {
    expect(getSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "cre.example.vercel.app" })).toBe("https://cre.example.vercel.app");
    expect(getSiteUrl({ VERCEL_URL: "preview.example.vercel.app" })).toBe("https://preview.example.vercel.app");
  });

  it("falls back safely when a URL is invalid or absent", () => {
    expect(getSiteUrl({ NEXT_PUBLIC_SITE_URL: "://invalid" })).toBe("http://localhost:3000");
    expect(getSiteUrl({})).toBe("http://localhost:3000");
  });

  it("prevents indexing a production deployment without its real dataset", () => {
    expect(shouldIndexSite({ NODE_ENV: "production" })).toBe(false);
    expect(shouldIndexSite({ NODE_ENV: "production", NEXT_PUBLIC_SUPABASE_URL: "https://db.example.com", NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-key" })).toBe(true);
    expect(shouldIndexSite({ NODE_ENV: "development" })).toBe(true);
  });

  it("keeps Vercel preview deployments out of search results", () => {
    expect(shouldIndexSite({ NODE_ENV: "production", VERCEL_ENV: "preview", NEXT_PUBLIC_SUPABASE_URL: "https://db.example.com", NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-key" })).toBe(false);
    expect(shouldIndexSite({ NODE_ENV: "production", VERCEL_ENV: "production", NEXT_PUBLIC_SUPABASE_URL: "https://db.example.com", NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-key" })).toBe(true);
  });
});
