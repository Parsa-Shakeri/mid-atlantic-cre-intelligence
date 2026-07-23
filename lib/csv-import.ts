import { PROPERTY_TYPES, US_STATES, VERIFICATION_STATUSES, type CoveredState, type PropertyType, type VerificationStatus } from "./types";

export const CSV_TARGET_FIELDS = [
  ["property_name", "Property name", true], ["street_address", "Street address", true], ["city", "City", true],
  ["state", "State", true], ["zip_code", "ZIP code", true], ["county", "County", true],
  ["property_type", "Property type", true], ["building_sq_ft", "Building sq. ft.", false], ["sale_date", "Sale date", true],
  ["sale_price", "Sale price", true], ["buyer", "Buyer", false], ["seller", "Seller", false],
  ["major_tenants", "Major tenants (; separated)", false], ["reported_cap_rate_percent", "Reported cap rate (%)", false],
  ["reported_noi", "Reported NOI", false], ["transaction_type", "Transaction type", false],
  ["verification_status", "Verification status", true], ["date_verified", "Date verified", false],
  ["is_sample", "Fictional sample (true/false)", false], ["description", "Description", false], ["notes", "Transaction notes", false],
] as const;

export type CsvTargetField = (typeof CSV_TARGET_FIELDS)[number][0];
export type CsvColumnMapping = Record<CsvTargetField, number>;

export interface CsvImportRow {
  slug: string;
  property_name: string;
  street_address: string;
  city: string;
  state: CoveredState;
  zip_code: string;
  county: string;
  property_type: PropertyType;
  building_sq_ft: string;
  sale_date: string;
  sale_price: string;
  buyer: string;
  seller: string;
  major_tenants: string[];
  reported_cap_rate_percent: string;
  reported_noi: string;
  transaction_type: string;
  verification_status: VerificationStatus;
  date_verified: string;
  is_sample: boolean;
  description: string;
  notes: string;
}

export interface CsvRowValidation {
  rowNumber: number;
  row: CsvImportRow | null;
  errors: string[];
  warnings: string[];
}

export function parseCsvText(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];
    if (char === '"' && quoted && next === '"') { field += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(field.trim()); field = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field.trim());
      if (row.some((value) => value !== "")) rows.push(row);
      row = []; field = "";
    } else field += char;
  }
  row.push(field.trim());
  if (row.some((value) => value !== "")) rows.push(row);
  return rows;
}

const normalizedHeader = (value: string) => value.toLocaleLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

export function autoMapCsvHeaders(headers: string[]): CsvColumnMapping {
  const normalized = headers.map(normalizedHeader);
  return Object.fromEntries(CSV_TARGET_FIELDS.map(([field]) => [field, normalized.indexOf(field)])) as CsvColumnMapping;
}

export function generateSlug(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100);
}

const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const positive = (value: string) => value !== "" && Number.isFinite(Number(value)) && Number(value) > 0;

export function mapAndValidateCsvRows(rows: string[][], mapping: CsvColumnMapping, today = new Date().toISOString().slice(0, 10)): CsvRowValidation[] {
  const seenAddresses = new Set<string>();
  const seenTransactions = new Set<string>();
  const seenSlugs = new Map<string, number>();
  return rows.map((values, index) => {
    const raw = Object.fromEntries(CSV_TARGET_FIELDS.map(([field]) => [field, mapping[field] >= 0 ? values[mapping[field]]?.trim() ?? "" : ""])) as Record<CsvTargetField, string>;
    const errors: string[] = [];
    const warnings: string[] = [];
    for (const [field, label, required] of CSV_TARGET_FIELDS) if (required && !raw[field]) errors.push(`${label} is required.`);
    if (raw.state && !US_STATES.includes(raw.state.toUpperCase() as CoveredState)) errors.push("State must be MD, DC, or VA.");
    if (raw.property_type && !PROPERTY_TYPES.includes(raw.property_type as PropertyType)) errors.push("Property type is not in the controlled list.");
    if (raw.verification_status && !VERIFICATION_STATUSES.includes(raw.verification_status as VerificationStatus)) errors.push("Verification status is not recognized.");
    if (raw.is_sample && !["true", "false"].includes(raw.is_sample.toLocaleLowerCase())) errors.push("Fictional sample must be true or false.");
    if (raw.sale_price && !positive(raw.sale_price)) errors.push("Sale price must be positive.");
    if (raw.building_sq_ft && !positive(raw.building_sq_ft)) errors.push("Building square footage must be positive.");
    if (raw.reported_noi && !positive(raw.reported_noi)) errors.push("Reported NOI must be positive.");
    if (raw.reported_cap_rate_percent && (!positive(raw.reported_cap_rate_percent) || Number(raw.reported_cap_rate_percent) > 30)) errors.push("Reported cap rate must be greater than 0% and no more than 30%.");
    if (raw.sale_date && (!validDate(raw.sale_date) || raw.sale_date > today)) errors.push("Sale date must be a valid date that is not in the future.");
    if (raw.date_verified && (!validDate(raw.date_verified) || raw.date_verified > today)) errors.push("Verification date must be valid and not in the future.");
    if (["Verified", "Single Source"].includes(raw.verification_status) && !raw.date_verified) errors.push("Verified and Single Source records require a verification date.");
    if (!raw.buyer || !raw.seller) warnings.push("Buyer or seller is missing.");
    warnings.push("No source is attached by CSV import; add one after review.");
    const addressKey = `${raw.street_address}|${raw.city}|${raw.state}|${raw.zip_code}`.toLocaleLowerCase();
    if (seenAddresses.has(addressKey)) errors.push("Likely duplicate address within this file.");
    else if (raw.street_address) seenAddresses.add(addressKey);
    const transactionKey = `${addressKey}|${raw.sale_date}|${raw.sale_price}`;
    if (seenTransactions.has(transactionKey)) errors.push("Likely duplicate transaction within this file.");
    else if (raw.sale_date && raw.sale_price) seenTransactions.add(transactionKey);
    const baseSlug = generateSlug(raw.property_name || `property-${index + 1}`);
    const slugCount = seenSlugs.get(baseSlug) ?? 0;
    seenSlugs.set(baseSlug, slugCount + 1);
    const slug = slugCount ? `${baseSlug}-${slugCount + 1}` : baseSlug;
    const normalized: CsvImportRow | null = errors.length ? null : {
      slug, property_name: raw.property_name, street_address: raw.street_address, city: raw.city,
      state: raw.state.toUpperCase() as CoveredState, zip_code: raw.zip_code, county: raw.county,
      property_type: raw.property_type as PropertyType, building_sq_ft: raw.building_sq_ft, sale_date: raw.sale_date,
      sale_price: raw.sale_price, buyer: raw.buyer, seller: raw.seller,
      major_tenants: raw.major_tenants.split(";").map((tenant) => tenant.trim()).filter(Boolean),
      reported_cap_rate_percent: raw.reported_cap_rate_percent, reported_noi: raw.reported_noi,
      transaction_type: raw.transaction_type || "Asset Sale", verification_status: raw.verification_status as VerificationStatus,
      date_verified: raw.date_verified, is_sample: raw.is_sample.toLocaleLowerCase() === "true", description: raw.description, notes: raw.notes,
    };
    return { rowNumber: index + 2, row: normalized, errors, warnings };
  });
}
