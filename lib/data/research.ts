import "server-only";
import type { Database } from "@/lib/supabase/database.types";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { parseResearchExhibit } from "@/lib/research-exhibit";
import { isResearchCategory, sampleResearchArticles, sampleResearchSummaries } from "@/lib/research-data";
import type { PublicDataSource, RelatedPropertySummary, ResearchArticle, ResearchArticleSummary, SourceRecord } from "@/lib/types";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];
type SourceRow = Database["public"]["Tables"]["sources"]["Row"];

function mapSummary(row: ArticleRow): ResearchArticleSummary | null {
  if (row.status !== "published" || !row.publication_date) return null;
  return { id: row.id, slug: row.slug, title: row.title, thesis: row.thesis, summary: row.summary, category: row.category,
    publicationDate: row.publication_date, status: "published", featured: row.featured, readingTime: row.reading_time,
    author: row.author, isSample: row.is_sample };
}

function mapSource(row: SourceRow): SourceRecord {
  return { id: row.id, sourceName: row.source_name, sourceUrl: row.source_url, publicationDate: row.publication_date,
    accessedDate: row.accessed_date, sourceType: row.source_type, notes: row.notes, isSample: row.is_sample };
}

function mapRelatedProperty(row: PropertyRow): RelatedPropertySummary {
  return { id: row.id, slug: row.slug, propertyName: row.property_name, city: row.city, state: row.state,
    propertyType: row.property_type, isSample: row.is_sample };
}

function fallbackArticles(category?: string) {
  return category && isResearchCategory(category) ? sampleResearchSummaries.filter((article) => article.category === category) : sampleResearchSummaries;
}

export async function getResearchArticles(category?: string): Promise<{ articles: ResearchArticleSummary[]; source: PublicDataSource }> {
  const client = createPublicSupabaseClient();
  if (!client) return { articles: fallbackArticles(category), source: "sample" };
  let request = client.from("articles").select("*").eq("status", "published").order("publication_date", { ascending: false });
  if (category && isResearchCategory(category)) request = request.eq("category", category);
  const { data, error } = await request;
  if (error) return { articles: [], source: "unavailable" };
  return { articles: (data ?? []).map(mapSummary).filter((article): article is ResearchArticleSummary => article !== null), source: "supabase" };
}

export async function getFeaturedResearch(limit = 3): Promise<ResearchArticleSummary[]> {
  const client = createPublicSupabaseClient();
  if (!client) return sampleResearchSummaries.filter((article) => article.featured).slice(0, limit);
  const { data, error } = await client.from("articles").select("*").eq("status", "published").eq("featured", true).order("publication_date", { ascending: false }).limit(limit);
  if (error) return [];
  return (data ?? []).map(mapSummary).filter((article): article is ResearchArticleSummary => article !== null);
}

export async function getResearchArticleBySlug(slug: string): Promise<ResearchArticle | null> {
  const fallback = sampleResearchArticles.find((article) => article.slug === slug) ?? null;
  const client = createPublicSupabaseClient();
  if (!client) return fallback;
  const { data: article, error } = await client.from("articles").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error || !article || !article.publication_date) return null;
  const [sourcesResult, linksResult, relatedResult] = await Promise.all([
    client.from("sources").select("*").eq("article_id", article.id).order("accessed_date", { ascending: false }),
    client.from("article_properties").select("property_id").eq("article_id", article.id),
    client.from("articles").select("*").eq("status", "published").eq("category", article.category).neq("id", article.id).order("publication_date", { ascending: false }).limit(3),
  ]);
  const propertyIds = (linksResult.data ?? []).map((link) => link.property_id);
  let relatedProperties: RelatedPropertySummary[] = [];
  if (propertyIds.length) {
    const { data } = await client.from("properties").select("*").in("id", propertyIds);
    relatedProperties = (data ?? []).map(mapRelatedProperty);
  }
  let relatedRows = relatedResult.data ?? [];
  if (!relatedRows.length) {
    const { data } = await client.from("articles").select("*").eq("status", "published").neq("id", article.id).order("publication_date", { ascending: false }).limit(3);
    relatedRows = data ?? [];
  }
  const summary = mapSummary(article);
  if (!summary) return fallback;
  return { ...summary, executiveSummary: article.executive_summary, body: article.body, limitations: article.limitations,
    exhibit: parseResearchExhibit(article.exhibit), sources: (sourcesResult.data ?? []).map(mapSource), relatedProperties,
    relatedArticles: relatedRows.map(mapSummary).filter((item): item is ResearchArticleSummary => item !== null),
    createdAt: article.created_at, updatedAt: article.updated_at };
}
