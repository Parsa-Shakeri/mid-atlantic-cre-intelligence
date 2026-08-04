import { PROPERTY_TYPES, US_STATES, VERIFICATION_STATUSES, type CoveredState, type PropertyFilterOptions, type PropertyListItem, type PropertyQuery, type PropertySort, type PropertyType, type SortDirection, type VerificationStatus } from "./types";

type SearchParams = Record<string, string | string[] | undefined>;
type PropertyFilterRecord = {
  city: string | null;
  county: string | null;
  saleDate: string | null;
};

const stringValue = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";
const uniqueStrings = (values: Array<string | null | undefined>) =>
  [...new Set(values.filter((value): value is string => Boolean(value?.trim())).map((value) => value.trim()))].toSorted();
const numberValue = (value: string | string[] | undefined) => {
  const raw = stringValue(value).trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

export function parsePropertyQuery(params: SearchParams): PropertyQuery {
  const sortOptions: PropertySort[] = ["sale_date", "sale_price", "building_sq_ft", "price_per_sq_ft", "reported_cap_rate", "date_added"];
  const requestedSort = stringValue(params.sort) as PropertySort;
  const requestedDirection = stringValue(params.direction) as SortDirection;
  const requestedPage = Math.floor(Number(stringValue(params.page)) || 1);
  const requestedState = stringValue(params.state);
  const requestedPropertyType = stringValue(params.propertyType);
  const requestedStatus = stringValue(params.verificationStatus);
  return {
    search: stringValue(params.search).trim(), state: US_STATES.includes(requestedState as CoveredState) ? requestedState as CoveredState : "", county: stringValue(params.county), city: stringValue(params.city),
    propertyType: PROPERTY_TYPES.includes(requestedPropertyType as PropertyType) ? requestedPropertyType as PropertyType : "", saleYear: stringValue(params.saleYear), priceMin: numberValue(params.priceMin), priceMax: numberValue(params.priceMax),
    sizeMin: numberValue(params.sizeMin), sizeMax: numberValue(params.sizeMax), capRateMin: numberValue(params.capRateMin), capRateMax: numberValue(params.capRateMax),
    verificationStatus: VERIFICATION_STATUSES.includes(requestedStatus as VerificationStatus) ? requestedStatus as VerificationStatus : "", sort: sortOptions.includes(requestedSort) ? requestedSort : "sale_date",
    direction: requestedDirection === "asc" ? "asc" : "desc", page: Math.max(1, requestedPage), pageSize: 10,
  };
}

export function buildPropertyFilterOptions(records: PropertyFilterRecord[]): PropertyFilterOptions {
  const saleYears = uniqueStrings(records.map((record) => {
    const year = record.saleDate?.slice(0, 4);
    return year && /^\d{4}$/.test(year) ? year : null;
  })).toSorted((a, b) => b.localeCompare(a));

  return {
    counties: uniqueStrings(records.map((record) => record.county)),
    cities: uniqueStrings(records.map((record) => record.city)),
    saleYears,
  };
}

export function calculatePricePerSquareFoot(salePrice: number | null, buildingSqFt: number | null) {
  if (!salePrice || salePrice <= 0 || !buildingSqFt || buildingSqFt <= 0) return null;
  return Math.round((salePrice / buildingSqFt) * 100) / 100;
}

export function calculateCapRate(noi: number | null, propertyValue: number | null, valuesVerified: boolean) {
  if (!valuesVerified || !noi || noi <= 0 || !propertyValue || propertyValue <= 0) return null;
  return Math.round((noi / propertyValue) * 10000) / 10000;
}

const sortValue = (record: PropertyListItem, sort: PropertySort): number | string | null => ({
  sale_date: record.saleDate, sale_price: record.salePrice, building_sq_ft: record.buildingSqFt,
  price_per_sq_ft: record.pricePerSqFt, reported_cap_rate: record.reportedCapRate, date_added: record.dateAdded,
})[sort];

export function filterAndSortProperties(records: PropertyListItem[], query: PropertyQuery) {
  const search = query.search.toLocaleLowerCase();
  const filtered = records.filter((record) => {
    const haystack = [record.propertyName, record.streetAddress, record.city, record.buyer, record.seller, ...record.majorTenants].filter(Boolean).join(" ").toLocaleLowerCase();
    return (!search || haystack.includes(search))
      && (!query.state || record.state === query.state)
      && (!query.county || record.county === query.county)
      && (!query.city || record.city === query.city)
      && (!query.propertyType || record.propertyType === query.propertyType)
      && (!query.saleYear || record.saleDate.startsWith(query.saleYear))
      && (query.priceMin === null || record.salePrice >= query.priceMin)
      && (query.priceMax === null || record.salePrice <= query.priceMax)
      && (query.sizeMin === null || (record.buildingSqFt !== null && record.buildingSqFt >= query.sizeMin))
      && (query.sizeMax === null || (record.buildingSqFt !== null && record.buildingSqFt <= query.sizeMax))
      && (query.capRateMin === null || (record.reportedCapRate !== null && record.reportedCapRate * 100 >= query.capRateMin))
      && (query.capRateMax === null || (record.reportedCapRate !== null && record.reportedCapRate * 100 <= query.capRateMax))
      && (!query.verificationStatus || record.verificationStatus === query.verificationStatus);
  });
  return filtered.toSorted((a, b) => {
    const aValue = sortValue(a, query.sort);
    const bValue = sortValue(b, query.sort);
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    const comparison = typeof aValue === "number" && typeof bValue === "number" ? aValue - bValue : String(aValue).localeCompare(String(bValue));
    return query.direction === "asc" ? comparison : -comparison;
  });
}

export function buildPageHref(current: URLSearchParams, page: number) {
  const next = new URLSearchParams(current);
  next.set("page", String(page));
  return `/properties?${next.toString()}`;
}
