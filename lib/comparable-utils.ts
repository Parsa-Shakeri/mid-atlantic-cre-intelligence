import { CAP_RATE_MINIMUM_SAMPLE, PROPERTY_TYPES, US_STATES, VERIFICATION_STATUSES, type ComparableMetrics, type ComparableQuery, type CoveredState, type PropertyListItem, type PropertyType, type VerificationStatus } from "./types";

type SearchParams = Record<string, string | string[] | undefined>;

const stringValue = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";
const cleanText = (value: string | string[] | undefined) => stringValue(value).trim().slice(0, 100);
const positiveNumber = (value: string | string[] | undefined) => {
  const raw = stringValue(value).trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};
const validDate = (value: string | string[] | undefined) => {
  const raw = stringValue(value).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return "";
  const parsed = new Date(`${raw}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== raw ? "" : raw;
};

export function parseComparableQuery(params: SearchParams): ComparableQuery {
  const requestedState = cleanText(params.state);
  const requestedType = cleanText(params.propertyType);
  const requestedStatus = cleanText(params.verificationStatus);
  const requestedTolerance = Number(stringValue(params.sizeTolerance));
  const toleranceOptions = [10, 25, 50, 100] as const;
  let dateFrom = validDate(params.dateFrom);
  let dateTo = validDate(params.dateTo);
  if (dateFrom && dateTo && dateFrom > dateTo) [dateFrom, dateTo] = [dateTo, dateFrom];
  let priceMin = positiveNumber(params.priceMin);
  let priceMax = positiveNumber(params.priceMax);
  if (priceMin !== null && priceMax !== null && priceMin > priceMax) [priceMin, priceMax] = [priceMax, priceMin];
  return {
    dateFrom,
    dateTo,
    state: US_STATES.includes(requestedState as CoveredState) ? requestedState as CoveredState : "",
    county: cleanText(params.county),
    city: cleanText(params.city),
    propertyType: PROPERTY_TYPES.includes(requestedType as PropertyType) ? requestedType as PropertyType : "",
    priceMin,
    priceMax,
    sizeTarget: positiveNumber(params.sizeTarget),
    sizeTolerance: toleranceOptions.includes(requestedTolerance as ComparableQuery["sizeTolerance"]) ? requestedTolerance as ComparableQuery["sizeTolerance"] : 25,
    verificationStatus: VERIFICATION_STATUSES.includes(requestedStatus as VerificationStatus) ? requestedStatus as VerificationStatus : "",
    page: Math.min(100, Math.max(1, Math.floor(Number(stringValue(params.page)) || 1))),
  };
}

export function filterComparableRecords(records: PropertyListItem[], query: ComparableQuery) {
  const sizeMin = query.sizeTarget === null ? null : query.sizeTarget * (1 - query.sizeTolerance / 100);
  const sizeMax = query.sizeTarget === null ? null : query.sizeTarget * (1 + query.sizeTolerance / 100);
  const filtered = records.filter((record) => (
    (!query.dateFrom || record.saleDate >= query.dateFrom)
    && (!query.dateTo || record.saleDate <= query.dateTo)
    && (!query.state || record.state === query.state)
    && (!query.county || record.county === query.county)
    && (!query.city || record.city === query.city)
    && (!query.propertyType || record.propertyType === query.propertyType)
    && (query.priceMin === null || record.salePrice >= query.priceMin)
    && (query.priceMax === null || record.salePrice <= query.priceMax)
    && (sizeMin === null || (record.buildingSqFt !== null && record.buildingSqFt >= sizeMin))
    && (sizeMax === null || (record.buildingSqFt !== null && record.buildingSqFt <= sizeMax))
    && (!query.verificationStatus || record.verificationStatus === query.verificationStatus)
  ));
  return filtered.toSorted((a, b) => {
    if (query.sizeTarget !== null) {
      const aDifference = a.buildingSqFt === null ? Number.POSITIVE_INFINITY : Math.abs(a.buildingSqFt - query.sizeTarget);
      const bDifference = b.buildingSqFt === null ? Number.POSITIVE_INFINITY : Math.abs(b.buildingSqFt - query.sizeTarget);
      if (aDifference !== bDifference) return aDifference - bDifference;
    }
    const dateComparison = b.saleDate.localeCompare(a.saleDate);
    return dateComparison || a.transactionId.localeCompare(b.transactionId);
  });
}

const median = (values: number[]) => {
  if (!values.length) return null;
  const ordered = values.toSorted((a, b) => a - b);
  const midpoint = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[midpoint] : (ordered[midpoint - 1] + ordered[midpoint]) / 2;
};

export function buildComparableMetrics(records: PropertyListItem[], matchedSales = records.length): ComparableMetrics {
  const pricesPerSqFt = records.flatMap((record) => record.pricePerSqFt === null ? [] : [record.pricePerSqFt]);
  const buildingSizes = records.flatMap((record) => record.buildingSqFt === null ? [] : [record.buildingSqFt]);
  const capRates = records.flatMap((record) => record.reportedCapRate === null ? [] : [record.reportedCapRate]);
  return {
    matchedSales,
    metricRecordCount: records.length,
    totalSalesVolume: records.reduce((sum, record) => sum + record.salePrice, 0),
    medianSalePrice: median(records.map((record) => record.salePrice)),
    medianPricePerSqFt: median(pricesPerSqFt),
    pricePerSqFtSampleSize: pricesPerSqFt.length,
    medianBuildingSqFt: median(buildingSizes),
    buildingSizeSampleSize: buildingSizes.length,
    medianReportedCapRate: capRates.length >= CAP_RATE_MINIMUM_SAMPLE ? median(capRates) : null,
    capRateSampleSize: capRates.length,
  };
}

export function buildComparablePageHref(current: URLSearchParams, page: number) {
  const next = new URLSearchParams(current);
  next.set("page", String(page));
  return `/comparables?${next.toString()}`;
}

export function buildComparableRemovalHref(current: URLSearchParams, keys: string | string[]) {
  const next = new URLSearchParams(current);
  for (const key of Array.isArray(keys) ? keys : [keys]) next.delete(key);
  next.delete("page");
  const query = next.toString();
  return query ? `/comparables?${query}` : "/comparables";
}
