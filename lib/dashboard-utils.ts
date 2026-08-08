import { CAP_RATE_MINIMUM_SAMPLE, PROPERTY_TYPES, US_STATES, type CoveredState, type DashboardCapRateBin, type DashboardData, type DashboardFilters, type DashboardLargestTransaction, type DashboardMarketComparison, type DashboardMarketPrice, type DashboardPropertyTypeVolume, type DashboardTimePoint, type PropertyListItem, type PropertyType } from "./types";

type SearchParams = Record<string, string | string[] | undefined>;

const stringValue = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";
const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

export function parseDashboardFilters(params: SearchParams): DashboardFilters {
  const state = stringValue(params.state);
  const propertyType = stringValue(params.propertyType);
  const dateFrom = stringValue(params.dateFrom);
  const dateTo = stringValue(params.dateTo);
  return {
    dateFrom: validDate(dateFrom) ? dateFrom : "",
    dateTo: validDate(dateTo) ? dateTo : "",
    state: US_STATES.includes(state as CoveredState) ? state as CoveredState : "",
    county: stringValue(params.county).trim(),
    city: stringValue(params.city).trim(),
    propertyType: PROPERTY_TYPES.includes(propertyType as PropertyType) ? propertyType as PropertyType : "",
  };
}

export function buildDashboardFilterRemovalHref(current: URLSearchParams, key: keyof DashboardFilters) {
  const next = new URLSearchParams(current);
  next.delete(key);
  const query = next.toString();
  return query ? `/dashboard?${query}` : "/dashboard";
}

export function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = values.toSorted((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
const unique = (values: string[]) => [...new Set(values)].toSorted();
const marketName = (record: PropertyListItem) => `${record.city}, ${record.state}`;
const monthLabel = (period: string) => new Intl.DateTimeFormat("en-US", { month: "short", year: "2-digit", timeZone: "UTC" }).format(new Date(`${period}-01T00:00:00Z`));

function filterRecords(records: PropertyListItem[], filters: DashboardFilters) {
  return records.filter((record) => (!filters.dateFrom || record.saleDate >= filters.dateFrom)
    && (!filters.dateTo || record.saleDate <= filters.dateTo)
    && (!filters.state || record.state === filters.state)
    && (!filters.county || record.county === filters.county)
    && (!filters.city || record.city === filters.city)
    && (!filters.propertyType || record.propertyType === filters.propertyType));
}

function groupTime(records: PropertyListItem[]): DashboardTimePoint[] {
  const groups = new Map<string, PropertyListItem[]>();
  for (const record of records) {
    const period = record.saleDate.slice(0, 7);
    groups.set(period, [...(groups.get(period) ?? []), record]);
  }
  return [...groups.entries()].toSorted(([a], [b]) => a.localeCompare(b)).map(([period, rows]) => ({
    period, label: monthLabel(period), transactionCount: rows.length, salesVolume: rows.reduce((sum, row) => sum + row.salePrice, 0),
  }));
}

function groupPropertyTypes(records: PropertyListItem[]): DashboardPropertyTypeVolume[] {
  const groups = new Map<string, PropertyListItem[]>();
  for (const record of records) groups.set(record.propertyType, [...(groups.get(record.propertyType) ?? []), record]);
  return [...groups.entries()].map(([propertyType, rows]) => ({ propertyType, salesVolume: rows.reduce((sum, row) => sum + row.salePrice, 0), transactionCount: rows.length })).toSorted((a, b) => b.salesVolume - a.salesVolume);
}

function groupMarkets(records: PropertyListItem[]): { prices: DashboardMarketPrice[]; comparison: DashboardMarketComparison[] } {
  const groups = new Map<string, PropertyListItem[]>();
  for (const record of records) groups.set(marketName(record), [...(groups.get(marketName(record)) ?? []), record]);
  const comparison = [...groups.entries()].map(([market, rows]) => {
    const prices = rows.map((row) => row.pricePerSqFt).filter((value): value is number => value !== null);
    const caps = rows.map((row) => row.reportedCapRate).filter((value): value is number => value !== null);
    const sizes = rows.map((row) => row.buildingSqFt).filter((value): value is number => value !== null);
    return { market, transactionCount: rows.length, totalSalesVolume: rows.reduce((sum, row) => sum + row.salePrice, 0),
      medianSalePrice: median(rows.map((row) => row.salePrice)), medianPricePerSqFt: median(prices), pricePerSqFtSampleSize: prices.length,
      medianReportedCapRate: caps.length >= CAP_RATE_MINIMUM_SAMPLE ? median(caps) : null, capRateSampleSize: caps.length,
      averageBuildingSize: average(sizes) };
  }).toSorted((a, b) => b.totalSalesVolume - a.totalSalesVolume);
  const prices = comparison.filter((market): market is DashboardMarketComparison & { medianPricePerSqFt: number } => market.medianPricePerSqFt !== null)
    .map((market) => ({ market: market.market, medianPricePerSqFt: market.medianPricePerSqFt, sampleSize: market.pricePerSqFtSampleSize }))
    .toSorted((a, b) => b.medianPricePerSqFt - a.medianPricePerSqFt);
  return { prices, comparison };
}

function capRateBins(records: PropertyListItem[]): DashboardCapRateBin[] {
  const caps = records.map((record) => record.reportedCapRate).filter((value): value is number => value !== null);
  if (caps.length < CAP_RATE_MINIMUM_SAMPLE) return [];
  const bins: DashboardCapRateBin[] = [{ label: "<5%", count: 0 }, { label: "5–5.99%", count: 0 }, { label: "6–6.99%", count: 0 }, { label: "7–7.99%", count: 0 }, { label: "8%+", count: 0 }];
  for (const cap of caps) {
    if (cap < 0.05) bins[0].count += 1;
    else if (cap < 0.06) bins[1].count += 1;
    else if (cap < 0.07) bins[2].count += 1;
    else if (cap < 0.08) bins[3].count += 1;
    else bins[4].count += 1;
  }
  return bins;
}

function largest(records: PropertyListItem[]): DashboardLargestTransaction[] {
  return records.toSorted((a, b) => b.salePrice - a.salePrice).slice(0, 10).map((record) => ({ slug: record.slug, propertyName: record.propertyName,
    market: marketName(record), propertyType: record.propertyType, saleDate: record.saleDate, salePrice: record.salePrice,
    verificationStatus: record.verificationStatus, isSample: record.isSample }));
}

export function buildDashboardData(allRecords: PropertyListItem[], filters: DashboardFilters, source: "supabase" | "sample" = "sample"): DashboardData {
  const records = filterRecords(allRecords, filters);
  const prices = records.map((record) => record.pricePerSqFt).filter((value): value is number => value !== null);
  const caps = records.map((record) => record.reportedCapRate).filter((value): value is number => value !== null);
  const sizes = records.map((record) => record.buildingSqFt).filter((value): value is number => value !== null);
  const markets = groupMarkets(records);
  return {
    source, containsOnlySamples: records.length > 0 && records.every((record) => record.isSample), filters,
    filterOptions: { states: unique(allRecords.map((record) => record.state)), counties: unique(allRecords.map((record) => record.county)),
      cities: unique(allRecords.map((record) => record.city)), propertyTypes: unique(allRecords.map((record) => record.propertyType)) },
    metrics: { transactionCount: records.length, totalSalesVolume: records.reduce((sum, record) => sum + record.salePrice, 0),
      medianSalePrice: median(records.map((record) => record.salePrice)), medianPricePerSqFt: median(prices),
      medianReportedCapRate: caps.length >= CAP_RATE_MINIMUM_SAMPLE ? median(caps) : null, averageBuildingSize: average(sizes),
      pricePerSqFtSampleSize: prices.length, capRateSampleSize: caps.length, buildingSizeSampleSize: sizes.length },
    transactionCountOverTime: groupTime(records), salesVolumeByPropertyType: groupPropertyTypes(records),
    medianPricePerSqFtByMarket: markets.prices, capRateDistribution: capRateBins(records), largestTransactions: largest(records),
    marketComparison: markets.comparison,
  };
}
