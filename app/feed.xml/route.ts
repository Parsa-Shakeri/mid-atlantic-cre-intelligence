import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

const escapeXml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");

export async function GET() {
  const siteUrl = getSiteUrl();
  const client = createPublicSupabaseClient();
  const result = client ? await client.from("articles").select("slug, title, summary, publication_date, updated_at, author, category").eq("status", "published").eq("is_sample", false).order("publication_date", { ascending: false }).limit(100) : null;
  const items = result && !result.error ? result.data ?? [] : [];
  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(BRAND_NAME)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(BRAND_DESCRIPTION)}</description>
    <language>en-us</language>
    <atom:link href="${escapeXml(`${siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />
    ${items.map((item) => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(`${siteUrl}/research/${item.slug}`)}</link>
      <guid isPermaLink="true">${escapeXml(`${siteUrl}/research/${item.slug}`)}</guid>
      <description>${escapeXml(item.summary)}</description>
      <dc:creator>${escapeXml(item.author)}</dc:creator>
      <category>${escapeXml(item.category)}</category>
      <pubDate>${new Date(item.publication_date ?? item.updated_at).toUTCString()}</pubDate>
    </item>`).join("\n    ")}
  </channel>
</rss>`;
  return new Response(body, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400", "Content-Type": "application/rss+xml; charset=utf-8" } });
}
