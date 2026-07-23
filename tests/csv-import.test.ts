import { describe, expect, it } from "vitest";
import { autoMapCsvHeaders, CSV_TARGET_FIELDS, generateSlug, mapAndValidateCsvRows, parseCsvText } from "../lib/csv-import";

const headers = CSV_TARGET_FIELDS.map(([field]) => field);
const validValues: Record<string, string> = {
  property_name: "Fictional Research Center", street_address: "10 Placeholder Street", city: "Baltimore", state: "MD",
  zip_code: "21201", county: "Baltimore City", property_type: "Office", building_sq_ft: "100000", sale_date: "2025-06-01",
  sale_price: "25000000", buyer: "Fictional Buyer LLC", seller: "Fictional Seller LLC", major_tenants: "Example Tenant; Sample Tenant",
  reported_cap_rate_percent: "6.5", reported_noi: "1625000", transaction_type: "Asset Sale", verification_status: "Estimated",
  date_verified: "", is_sample: "true", description: "Fictional record", notes: "Placeholder values",
};
const row = (overrides: Record<string, string> = {}) => headers.map((field) => ({ ...validValues, ...overrides })[field] ?? "");

describe("CSV intake", () => {
  it("parses commas and escaped quotes inside quoted fields", () => {
    expect(parseCsvText('name,notes\r\n"Office, North","A ""quoted"" note"')).toEqual([["name", "notes"], ["Office, North", 'A "quoted" note']]);
  });

  it("automatically maps normalized headers", () => {
    const mapping = autoMapCsvHeaders(["Property Name", "Street Address", "SALE DATE"]);
    expect(mapping.property_name).toBe(0);
    expect(mapping.street_address).toBe(1);
    expect(mapping.sale_date).toBe(2);
    expect(mapping.sale_price).toBe(-1);
  });

  it("normalizes a valid fictional row and emits a missing-source warning", () => {
    const [result] = mapAndValidateCsvRows([row()], autoMapCsvHeaders(headers), "2026-07-21");
    expect(result.errors).toEqual([]);
    expect(result.row?.is_sample).toBe(true);
    expect(result.row?.major_tenants).toEqual(["Example Tenant", "Sample Tenant"]);
    expect(result.warnings).toContain("No source is attached by CSV import; add one after review.");
  });

  it("blocks duplicate rows, missing verification dates, and unreasonable cap rates", () => {
    const results = mapAndValidateCsvRows([
      row({ verification_status: "Verified", date_verified: "", reported_cap_rate_percent: "31" }),
      row(),
    ], autoMapCsvHeaders(headers), "2026-07-21");
    expect(results[0].errors).toContain("Verified and Single Source records require a verification date.");
    expect(results[0].errors).toContain("Reported cap rate must be greater than 0% and no more than 30%.");
    expect(results[1].errors).toContain("Likely duplicate address within this file.");
    expect(results[1].errors).toContain("Likely duplicate transaction within this file.");
  });

  it("generates stable, URL-safe slugs", () => {
    expect(generateSlug("Café Plaza — Fictional Sample")).toBe("cafe-plaza-fictional-sample");
  });
});
