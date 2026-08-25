import "server-only";
import { buildCoverageData, unavailableCoverageData, type CoveragePropertyInput, type CoverageSourceInput, type CoverageTransactionInput } from "@/lib/coverage-utils";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import type { CoverageData } from "@/lib/types";

export const COVERAGE_QUERY_LIMIT = 5_000;

export async function getCoverageData(): Promise<CoverageData> {
  const client = createPublicSupabaseClient();
  if (!client) return unavailableCoverageData(COVERAGE_QUERY_LIMIT);

  const [propertiesResult, transactionsResult, sourcesResult] = await Promise.all([
    client.from("properties").select("id, state, property_type, building_sq_ft, updated_at").eq("is_sample", false).order("id").limit(COVERAGE_QUERY_LIMIT),
    client.from("transactions").select("id, property_id, sale_date, buyer, seller, reported_cap_rate, reported_noi, price_per_sq_ft, verification_status, date_verified, updated_at").eq("is_sample", false).order("id").limit(COVERAGE_QUERY_LIMIT),
    client.from("sources").select("id, property_id, transaction_id, created_at").eq("is_sample", false).order("id").limit(COVERAGE_QUERY_LIMIT),
  ]);

  if (propertiesResult.error || transactionsResult.error || sourcesResult.error) return unavailableCoverageData(COVERAGE_QUERY_LIMIT);

  const properties: CoveragePropertyInput[] = (propertiesResult.data ?? []).map((property) => ({
    id: property.id,
    state: property.state,
    propertyType: property.property_type,
    buildingSqFt: property.building_sq_ft,
    updatedAt: property.updated_at,
  }));
  const transactions: CoverageTransactionInput[] = (transactionsResult.data ?? []).map((transaction) => ({
    id: transaction.id,
    propertyId: transaction.property_id,
    saleDate: transaction.sale_date,
    buyer: transaction.buyer,
    seller: transaction.seller,
    reportedCapRate: transaction.reported_cap_rate,
    reportedNoi: transaction.reported_noi,
    pricePerSqFt: transaction.price_per_sq_ft,
    verificationStatus: transaction.verification_status,
    dateVerified: transaction.date_verified,
    updatedAt: transaction.updated_at,
  }));
  const sources: CoverageSourceInput[] = (sourcesResult.data ?? []).map((source) => ({
    id: source.id,
    propertyId: source.property_id,
    transactionId: source.transaction_id,
    createdAt: source.created_at,
  }));

  return buildCoverageData(
    { properties, transactions, sources },
    { queryLimit: COVERAGE_QUERY_LIMIT, truncated: properties.length === COVERAGE_QUERY_LIMIT || transactions.length === COVERAGE_QUERY_LIMIT || sources.length === COVERAGE_QUERY_LIMIT },
  );
}
