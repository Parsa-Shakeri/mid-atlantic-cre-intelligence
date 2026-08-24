import "server-only";
import { buildDashboardData } from "@/lib/dashboard-utils";
import { samplePropertyList } from "@/lib/sample-data";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { VERIFICATION_STATUSES, type DashboardData, type DashboardFilters, type VerificationStatus } from "@/lib/types";
import type { Json } from "@/lib/supabase/database.types";

type JsonObject = { [key: string]: Json | undefined };
const DASHBOARD_QUERY_TIMEOUT_MS = 8_000;

const objectValue = (value: Json | undefined): JsonObject | null => value && typeof value === "object" && !Array.isArray(value) ? value : null;
const arrayValue = (value: Json | undefined) => Array.isArray(value) ? value : [];
const stringValue = (value: Json | undefined) => typeof value === "string" ? value : "";
const numberValue = (value: Json | undefined) => typeof value === "number" ? value : typeof value === "string" && value !== "" ? Number(value) : 0;
const nullableNumber = (value: Json | undefined) => value === null || value === undefined ? null : numberValue(value);
const stringArray = (value: Json | undefined) => arrayValue(value).filter((item): item is string => typeof item === "string");

function parsePayload(payload: Json, filters: DashboardFilters): DashboardData | null {
  const root = objectValue(payload);
  const metrics = objectValue(root?.metrics);
  const options = objectValue(root?.filter_options);
  if (!root || !metrics || !options) return null;
  const objectRows = (value: Json | undefined) => arrayValue(value).map(objectValue).filter((item): item is JsonObject => item !== null);
  return {
    source: "supabase", containsOnlySamples: root.contains_only_samples === true, filters,
    filterOptions: { states: stringArray(options.states), counties: stringArray(options.counties), cities: stringArray(options.cities), propertyTypes: stringArray(options.property_types) },
    metrics: { transactionCount: numberValue(metrics.transaction_count), totalSalesVolume: numberValue(metrics.total_sales_volume),
      medianSalePrice: nullableNumber(metrics.median_sale_price), medianPricePerSqFt: nullableNumber(metrics.median_price_per_sq_ft),
      medianReportedCapRate: nullableNumber(metrics.median_reported_cap_rate), averageBuildingSize: nullableNumber(metrics.average_building_size),
      pricePerSqFtSampleSize: numberValue(metrics.price_per_sq_ft_sample_size), capRateSampleSize: numberValue(metrics.cap_rate_sample_size), buildingSizeSampleSize: numberValue(metrics.building_size_sample_size) },
    transactionCountOverTime: objectRows(root.transaction_count_over_time).map((row) => ({ period: stringValue(row.period), label: stringValue(row.label), transactionCount: numberValue(row.transaction_count), salesVolume: numberValue(row.sales_volume) })),
    salesVolumeByPropertyType: objectRows(root.sales_volume_by_property_type).map((row) => ({ propertyType: stringValue(row.property_type), salesVolume: numberValue(row.sales_volume), transactionCount: numberValue(row.transaction_count) })),
    medianPricePerSqFtByMarket: objectRows(root.median_price_per_sq_ft_by_market).map((row) => ({ market: stringValue(row.market), medianPricePerSqFt: numberValue(row.median_price_per_sq_ft), sampleSize: numberValue(row.sample_size) })),
    capRateDistribution: objectRows(root.cap_rate_distribution).map((row) => ({ label: stringValue(row.label), count: numberValue(row.count) })),
    largestTransactions: objectRows(root.largest_transactions).map((row) => { const rawStatus = stringValue(row.verification_status); const verificationStatus: VerificationStatus = VERIFICATION_STATUSES.includes(rawStatus as VerificationStatus) ? rawStatus as VerificationStatus : "Incomplete"; return {
      slug: stringValue(row.slug), propertyName: stringValue(row.property_name), market: stringValue(row.market), propertyType: stringValue(row.property_type),
      saleDate: stringValue(row.sale_date), salePrice: numberValue(row.sale_price), verificationStatus, isSample: row.is_sample === true,
    }; }),
    marketComparison: objectRows(root.market_comparison).map((row) => ({ market: stringValue(row.market), transactionCount: numberValue(row.transaction_count),
      totalSalesVolume: numberValue(row.total_sales_volume), medianSalePrice: nullableNumber(row.median_sale_price), medianPricePerSqFt: nullableNumber(row.median_price_per_sq_ft),
      pricePerSqFtSampleSize: numberValue(row.price_per_sq_ft_sample_size), medianReportedCapRate: nullableNumber(row.median_reported_cap_rate),
      capRateSampleSize: numberValue(row.cap_rate_sample_size), averageBuildingSize: nullableNumber(row.average_building_size) })),
  };
}

export async function getDashboardData(filters: DashboardFilters): Promise<DashboardData> {
  const fallback = () => buildDashboardData(samplePropertyList, filters, "sample");
  const unavailable = () => buildDashboardData([], filters, "unavailable");
  const client = createPublicSupabaseClient();
  if (!client) return fallback();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DASHBOARD_QUERY_TIMEOUT_MS);
  try {
    const { data, error } = await client.rpc("get_market_dashboard", {
      filter_date_from: filters.dateFrom || null, filter_date_to: filters.dateTo || null, filter_state: filters.state || null,
      filter_county: filters.county || null, filter_city: filters.city || null, filter_property_type: filters.propertyType || null,
    }).abortSignal(controller.signal);
    if (error || data === null) return unavailable();
    return parsePayload(data, filters) ?? unavailable();
  } catch {
    return unavailable();
  } finally {
    clearTimeout(timeout);
  }
}
