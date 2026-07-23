import "server-only";
import type { Database } from "@/lib/supabase/database.types";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { filterAndSortProperties } from "@/lib/property-utils";
import { sampleProperties, samplePropertyList, sampleSummary } from "@/lib/sample-data";
import type { PaginatedProperties, PropertyListItem, PropertyQuery, PropertyRecord, SourceRecord, SummaryMetrics, TransactionRecord } from "@/lib/types";

type ListRow = Database["public"]["Views"]["property_transaction_records"]["Row"];
type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];
type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"];
type SourceRow = Database["public"]["Tables"]["sources"]["Row"];

function mapListRow(row: ListRow): PropertyListItem | null {
  if (!row.property_id || !row.transaction_id || !row.slug || !row.property_name || !row.street_address || !row.city || !row.state || !row.zip_code || !row.county || !row.property_type || !row.sale_date || row.sale_price === null || !row.transaction_type || !row.verification_status || !row.date_added) return null;
  return {
    propertyId: row.property_id, transactionId: row.transaction_id, slug: row.slug, propertyName: row.property_name,
    streetAddress: row.street_address, city: row.city, state: row.state, zipCode: row.zip_code, county: row.county,
    propertyType: row.property_type, buildingSqFt: row.building_sq_ft, majorTenants: row.major_tenants ?? [], saleDate: row.sale_date,
    salePrice: row.sale_price, buyer: row.buyer, seller: row.seller, reportedCapRate: row.reported_cap_rate, reportedNoi: row.reported_noi,
    pricePerSqFt: row.price_per_sq_ft, transactionType: row.transaction_type, verificationStatus: row.verification_status,
    dateVerified: row.date_verified, dateAdded: row.date_added, isSample: row.is_sample ?? false,
  };
}

function fallbackProperties(query: PropertyQuery): PaginatedProperties {
  const filtered = filterAndSortProperties(samplePropertyList, query);
  const start = (query.page - 1) * query.pageSize;
  return { records: filtered.slice(start, start + query.pageSize), total: filtered.length, page: query.page, pageSize: query.pageSize, source: "sample" };
}

export async function getProperties(query: PropertyQuery): Promise<PaginatedProperties> {
  const client = createPublicSupabaseClient();
  if (!client) return fallbackProperties(query);
  let request = client.from("property_transaction_records").select("*", { count: "exact" });
  if (query.search) request = request.ilike("search_document", `%${query.search.replace(/[%_,()]/g, " ")}%`);
  if (query.state) request = request.eq("state", query.state);
  if (query.county) request = request.eq("county", query.county);
  if (query.city) request = request.eq("city", query.city);
  if (query.propertyType) request = request.eq("property_type", query.propertyType);
  if (query.saleYear) request = request.gte("sale_date", `${query.saleYear}-01-01`).lte("sale_date", `${query.saleYear}-12-31`);
  if (query.priceMin !== null) request = request.gte("sale_price", query.priceMin);
  if (query.priceMax !== null) request = request.lte("sale_price", query.priceMax);
  if (query.sizeMin !== null) request = request.gte("building_sq_ft", query.sizeMin);
  if (query.sizeMax !== null) request = request.lte("building_sq_ft", query.sizeMax);
  if (query.capRateMin !== null) request = request.gte("reported_cap_rate", query.capRateMin / 100);
  if (query.capRateMax !== null) request = request.lte("reported_cap_rate", query.capRateMax / 100);
  if (query.verificationStatus) request = request.eq("verification_status", query.verificationStatus);
  const start = (query.page - 1) * query.pageSize;
  const { data, count, error } = await request.order(query.sort, { ascending: query.direction === "asc", nullsFirst: false }).range(start, start + query.pageSize - 1);
  if (error) return fallbackProperties(query);
  return { records: (data ?? []).map(mapListRow).filter((item): item is PropertyListItem => item !== null), total: count ?? 0, page: query.page, pageSize: query.pageSize, source: "supabase" };
}

function mapTransaction(row: TransactionRow): TransactionRecord {
  return { id: row.id, propertyId: row.property_id, saleDate: row.sale_date, salePrice: row.sale_price, buyer: row.buyer, seller: row.seller,
    reportedCapRate: row.reported_cap_rate, reportedNoi: row.reported_noi, pricePerSqFt: row.price_per_sq_ft, transactionType: row.transaction_type,
    notes: row.notes, verificationStatus: row.verification_status, dateVerified: row.date_verified, createdAt: row.created_at, isSample: row.is_sample };
}

function mapSource(row: SourceRow): SourceRecord {
  return { id: row.id, sourceName: row.source_name, sourceUrl: row.source_url, publicationDate: row.publication_date,
    accessedDate: row.accessed_date, sourceType: row.source_type, notes: row.notes, isSample: row.is_sample };
}

function mapProperty(row: PropertyRow, transactions: TransactionRow[], sources: SourceRow[]): PropertyRecord {
  return { id: row.id, slug: row.slug, propertyName: row.property_name, streetAddress: row.street_address, city: row.city, state: row.state,
    zipCode: row.zip_code, county: row.county, latitude: row.latitude, longitude: row.longitude, propertyType: row.property_type,
    buildingSqFt: row.building_sq_ft, lotAcres: row.lot_acres, yearBuilt: row.year_built, yearRenovated: row.year_renovated,
    numberOfFloors: row.number_of_floors, parkingSpaces: row.parking_spaces, majorTenants: row.major_tenants, description: row.description,
    leaseStructure: row.lease_structure, createdAt: row.created_at, updatedAt: row.updated_at, isSample: row.is_sample,
    transactions: transactions.map(mapTransaction), sources: sources.map(mapSource) };
}

export async function getPropertyBySlug(slug: string): Promise<PropertyRecord | null> {
  const client = createPublicSupabaseClient();
  if (!client) return sampleProperties.find((property) => property.slug === slug) ?? null;
  const { data: property, error } = await client.from("properties").select("*").eq("slug", slug).maybeSingle();
  if (error || !property) return sampleProperties.find((item) => item.slug === slug) ?? null;
  const [transactionsResult, sourcesResult] = await Promise.all([
    client.from("transactions").select("*").eq("property_id", property.id).order("sale_date", { ascending: false }),
    client.from("sources").select("*").eq("property_id", property.id).order("accessed_date", { ascending: false }),
  ]);
  return mapProperty(property, transactionsResult.data ?? [], sourcesResult.data ?? []);
}

export async function getSummaryMetrics(): Promise<SummaryMetrics> {
  const client = createPublicSupabaseClient();
  if (!client) return sampleSummary;
  const { data, error } = await client.from("public_market_summary").select("*").maybeSingle();
  if (error || !data) return sampleSummary;
  return { properties: Number(data.properties ?? 0), transactions: Number(data.transactions ?? 0), totalValue: Number(data.total_value ?? 0), markets: Number(data.markets ?? 0), reports: Number(data.reports ?? 0), source: "supabase" };
}

export async function getRecentTransactions(limit = 5): Promise<PropertyListItem[]> {
  const client = createPublicSupabaseClient();
  if (!client) return samplePropertyList.toSorted((a, b) => b.saleDate.localeCompare(a.saleDate)).slice(0, limit);
  const { data, error } = await client.from("property_transaction_records").select("*").order("sale_date", { ascending: false }).limit(limit);
  if (error) return samplePropertyList.toSorted((a, b) => b.saleDate.localeCompare(a.saleDate)).slice(0, limit);
  return (data ?? []).map(mapListRow).filter((item): item is PropertyListItem => item !== null);
}
