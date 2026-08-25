import { PROPERTY_TYPES, US_STATES, VERIFICATION_STATUSES, type CoverageBreakdown, type CoverageData, type CoverageField, type PropertyType, type VerificationStatus } from "./types";

export interface CoveragePropertyInput {
  id: string;
  state: string;
  propertyType: PropertyType;
  buildingSqFt: number | null;
  updatedAt: string;
}

export interface CoverageTransactionInput {
  id: string;
  propertyId: string;
  saleDate: string;
  buyer: string | null;
  seller: string | null;
  reportedCapRate: number | null;
  reportedNoi: number | null;
  pricePerSqFt: number | null;
  verificationStatus: VerificationStatus;
  dateVerified: string | null;
  updatedAt: string;
}

export interface CoverageSourceInput {
  id: string;
  propertyId: string | null;
  transactionId: string | null;
  createdAt: string;
}

export interface CoverageInputs {
  properties: CoveragePropertyInput[];
  transactions: CoverageTransactionInput[];
  sources: CoverageSourceInput[];
}

const rate = (count: number, total: number) => total ? Math.round((count / total) * 1_000) / 10 : 0;
const presentNumber = (value: number | null) => value !== null && Number.isFinite(value) && value > 0;
const presentText = (value: string | null) => Boolean(value?.trim());

function field(key: CoverageField["key"], label: string, scope: CoverageField["scope"], values: boolean[]): CoverageField {
  const availableCount = values.filter(Boolean).length;
  const totalCount = values.length;
  const missingCount = totalCount - availableCount;
  return { key, label, scope, availableCount, missingCount, totalCount, availabilityRate: rate(availableCount, totalCount), missingRate: rate(missingCount, totalCount) };
}

function breakdown(labels: readonly string[], properties: CoveragePropertyInput[], transactions: CoverageTransactionInput[], selectLabel: (property: CoveragePropertyInput) => string): CoverageBreakdown[] {
  const propertiesById = new Map(properties.map((property) => [property.id, property]));
  return labels.map((label) => {
    const propertyIds = new Set(properties.filter((property) => selectLabel(property) === label).map((property) => property.id));
    const transactionCount = transactions.filter((transaction) => propertyIds.has(transaction.propertyId) && propertiesById.has(transaction.propertyId)).length;
    return { label, propertyCount: propertyIds.size, transactionCount, transactionShare: rate(transactionCount, transactions.length) };
  });
}

function dateExtreme(values: string[], direction: "earliest" | "latest") {
  if (!values.length) return null;
  const sorted = values.toSorted();
  return direction === "earliest" ? sorted[0] : sorted.at(-1) ?? null;
}

export function buildCoverageData(inputs: CoverageInputs, options: { queryLimit: number; truncated?: boolean; source?: CoverageData["source"] }): CoverageData {
  const { properties, transactions, sources } = inputs;
  const propertySources = new Map<string, Set<string>>();
  const transactionSources = new Map<string, Set<string>>();
  for (const source of sources) {
    if (source.propertyId) propertySources.set(source.propertyId, new Set([...(propertySources.get(source.propertyId) ?? []), source.id]));
    if (source.transactionId) transactionSources.set(source.transactionId, new Set([...(transactionSources.get(source.transactionId) ?? []), source.id]));
  }
  const sourceCounts = transactions.map((transaction) => new Set([
    ...(propertySources.get(transaction.propertyId) ?? []),
    ...(transactionSources.get(transaction.id) ?? []),
  ]).size);
  const sourceLinkedTransactionCount = sourceCounts.filter((count) => count >= 1).length;
  const multiSourceTransactionCount = sourceCounts.filter((count) => count >= 2).length;
  const updatedDates = [...properties.map((property) => property.updatedAt), ...transactions.map((transaction) => transaction.updatedAt), ...sources.map((source) => source.createdAt)].filter(Boolean);

  return {
    source: options.source ?? "supabase",
    propertyCount: properties.length,
    transactionCount: transactions.length,
    sourceCount: sources.length,
    earliestSaleDate: dateExtreme(transactions.map((transaction) => transaction.saleDate).filter(Boolean), "earliest"),
    latestSaleDate: dateExtreme(transactions.map((transaction) => transaction.saleDate).filter(Boolean), "latest"),
    latestUpdatedAt: dateExtreme(updatedDates, "latest"),
    sourceLinkedTransactionCount,
    multiSourceTransactionCount,
    unsourcedTransactionCount: transactions.length - sourceLinkedTransactionCount,
    byState: breakdown(US_STATES, properties, transactions, (property) => property.state),
    byPropertyType: breakdown(PROPERTY_TYPES, properties, transactions, (property) => property.propertyType),
    fields: [
      field("building-area", "Building area", "properties", properties.map((property) => presentNumber(property.buildingSqFt))),
      field("price-per-square-foot", "Price per square foot", "transactions", transactions.map((transaction) => presentNumber(transaction.pricePerSqFt))),
      field("reported-cap-rate", "Reported cap rate", "transactions", transactions.map((transaction) => presentNumber(transaction.reportedCapRate))),
      field("reported-noi", "Reported NOI", "transactions", transactions.map((transaction) => presentNumber(transaction.reportedNoi))),
      field("buyer", "Buyer", "transactions", transactions.map((transaction) => presentText(transaction.buyer))),
      field("seller", "Seller", "transactions", transactions.map((transaction) => presentText(transaction.seller))),
      field("verification-date", "Verification date", "transactions", transactions.map((transaction) => presentText(transaction.dateVerified))),
    ],
    verificationStatuses: VERIFICATION_STATUSES.map((status) => {
      const count = transactions.filter((transaction) => transaction.verificationStatus === status).length;
      return { status, count, share: rate(count, transactions.length) };
    }),
    truncated: options.truncated ?? false,
    queryLimit: options.queryLimit,
  };
}

export function unavailableCoverageData(queryLimit: number): CoverageData {
  return buildCoverageData({ properties: [], transactions: [], sources: [] }, { queryLimit, source: "unavailable" });
}
