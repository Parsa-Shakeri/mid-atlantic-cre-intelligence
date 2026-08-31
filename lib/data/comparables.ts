import "server-only";
import { buildComparableMetrics, filterComparableRecords } from "@/lib/comparable-utils";
import { mapPropertyListRow } from "@/lib/data/properties";
import { samplePropertyList } from "@/lib/sample-data";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import type { ComparableQuery, ComparableSalesData, PropertyListItem } from "@/lib/types";

export const COMPARABLE_QUERY_LIMIT = 250;
export const COMPARABLE_PAGE_SIZE = 12;

function pageRecords(records: PropertyListItem[], page: number) {
  const start = (page - 1) * COMPARABLE_PAGE_SIZE;
  return records.slice(start, start + COMPARABLE_PAGE_SIZE);
}

function sampleComparables(query: ComparableQuery): ComparableSalesData {
  const filtered = filterComparableRecords(samplePropertyList, query);
  return {
    records: pageRecords(filtered, query.page),
    total: filtered.length,
    page: query.page,
    pageSize: COMPARABLE_PAGE_SIZE,
    source: "sample",
    metrics: buildComparableMetrics(filtered),
    truncated: false,
    queryLimit: COMPARABLE_QUERY_LIMIT,
  };
}

export async function getComparableSales(query: ComparableQuery): Promise<ComparableSalesData> {
  const client = createPublicSupabaseClient();
  if (!client) return sampleComparables(query);

  let request = client.from("property_transaction_records").select("*", { count: "exact" }).eq("is_sample", false);
  if (query.dateFrom) request = request.gte("sale_date", query.dateFrom);
  if (query.dateTo) request = request.lte("sale_date", query.dateTo);
  if (query.state) request = request.eq("state", query.state);
  if (query.county) request = request.eq("county", query.county);
  if (query.city) request = request.eq("city", query.city);
  if (query.propertyType) request = request.eq("property_type", query.propertyType);
  if (query.priceMin !== null) request = request.gte("sale_price", query.priceMin);
  if (query.priceMax !== null) request = request.lte("sale_price", query.priceMax);
  if (query.sizeTarget !== null) {
    request = request
      .gte("building_sq_ft", query.sizeTarget * (1 - query.sizeTolerance / 100))
      .lte("building_sq_ft", query.sizeTarget * (1 + query.sizeTolerance / 100));
  }
  if (query.verificationStatus) request = request.eq("verification_status", query.verificationStatus);

  const { data, count, error } = await request.order("sale_date", { ascending: false }).range(0, COMPARABLE_QUERY_LIMIT - 1);
  if (error) {
    return { records: [], total: 0, page: query.page, pageSize: COMPARABLE_PAGE_SIZE, source: "unavailable", metrics: buildComparableMetrics([]), truncated: false, queryLimit: COMPARABLE_QUERY_LIMIT };
  }

  const mapped = (data ?? []).map(mapPropertyListRow).filter((record): record is PropertyListItem => record !== null);
  const ordered = filterComparableRecords(mapped, query);
  const matchedSales = count ?? ordered.length;
  const page = pageRecords(ordered, query.page);
  let enrichedPage = page;
  if (page.length) {
    const transactionIds = page.map((record) => record.transactionId);
    const propertyIds = [...new Set(page.map((record) => record.propertyId))];
    const [transactionMetadata, linkedSources] = await Promise.all([
      client.from("transactions").select("id, price_per_sq_ft").in("id", transactionIds),
      client.from("sources").select("id, property_id, transaction_id").or(`transaction_id.in.(${transactionIds.join(",")}),property_id.in.(${propertyIds.join(",")})`).limit(1000),
    ]);
    const rawPricePerSqFt = new Map((transactionMetadata.data ?? []).map((transaction) => [transaction.id, transaction.price_per_sq_ft]));
    const sources = linkedSources.data ?? [];
    enrichedPage = page.map((record) => ({
      ...record,
      pricePerSqFtBasis: record.pricePerSqFt === null || transactionMetadata.error || !rawPricePerSqFt.has(record.transactionId)
        ? undefined
        : rawPricePerSqFt.get(record.transactionId) === null ? "Calculated" : "Reported",
      sourceCount: linkedSources.error
        ? undefined
        : sources.filter((source) => source.transaction_id === record.transactionId || source.property_id === record.propertyId).length,
    }));
  }
  return {
    records: enrichedPage,
    total: Math.min(matchedSales, COMPARABLE_QUERY_LIMIT),
    page: query.page,
    pageSize: COMPARABLE_PAGE_SIZE,
    source: "supabase",
    metrics: buildComparableMetrics(ordered, matchedSales),
    truncated: matchedSales > COMPARABLE_QUERY_LIMIT,
    queryLimit: COMPARABLE_QUERY_LIMIT,
  };
}
