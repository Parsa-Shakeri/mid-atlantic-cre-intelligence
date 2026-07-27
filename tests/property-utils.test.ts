import { describe, expect, it } from "vitest";
import { samplePropertyList } from "../lib/sample-data";
import { buildPropertyFilterOptions, calculateCapRate, calculatePricePerSquareFoot, filterAndSortProperties, parsePropertyQuery } from "../lib/property-utils";

describe("property calculations", () => {
  it("calculates price per square foot", () => expect(calculatePricePerSquareFoot(1_000_000, 10_000)).toBe(100));
  it("does not calculate with missing or invalid inputs", () => {
    expect(calculatePricePerSquareFoot(1_000_000, null)).toBeNull();
    expect(calculatePricePerSquareFoot(-1, 10_000)).toBeNull();
  });
  it("calculates cap rate only from verified inputs", () => {
    expect(calculateCapRate(600_000, 10_000_000, true)).toBe(0.06);
    expect(calculateCapRate(600_000, 10_000_000, false)).toBeNull();
  });
});

describe("property database queries", () => {
  it("builds current location and sale-year options from stored records", () => {
    const options = buildPropertyFilterOptions([
      { city: "Rockville", county: "Montgomery County", saleDate: "2025-05-14" },
      { city: "Falls Church", county: "Fairfax County", saleDate: "2026-05-22" },
      { city: "Rockville", county: "Montgomery County", saleDate: "invalid" },
      { city: null, county: "", saleDate: null },
    ]);

    expect(options).toEqual({
      counties: ["Fairfax County", "Montgomery County"],
      cities: ["Falls Church", "Rockville"],
      saleYears: ["2026", "2025"],
    });
  });

  it("searches names, parties, and tenants", () => {
    const query = parsePropertyQuery({ search: "Example Logistics" });
    const result = filterAndSortProperties(samplePropertyList, query);
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("potomac-trade-center-sample");
  });
  it("combines location, type, and price filters", () => {
    const query = parsePropertyQuery({ state: "MD", propertyType: "Industrial", priceMin: "20000000" });
    const result = filterAndSortProperties(samplePropertyList, query);
    expect(result).toHaveLength(2);
    expect(result.every((record) => record.state === "MD" && record.propertyType === "Industrial")).toBe(true);
  });
  it("filters cap rates as user-facing percentages", () => {
    const query = parsePropertyQuery({ capRateMin: "5.7", capRateMax: "6.2" });
    const result = filterAndSortProperties(samplePropertyList, query);
    expect(result.map((record) => record.reportedCapRate)).toEqual([0.061, 0.058]);
  });
  it("sorts prices in ascending order", () => {
    const query = parsePropertyQuery({ sort: "sale_price", direction: "asc" });
    const result = filterAndSortProperties(samplePropertyList, query);
    expect(result[0].salePrice).toBe(9_800_000);
    expect(result.at(-1)?.salePrice).toBe(58_500_000);
  });
  it("normalizes unsafe page and sort inputs", () => {
    const query = parsePropertyQuery({ page: "-20", sort: "not-a-sort", direction: "sideways" });
    expect(query.page).toBe(1);
    expect(query.sort).toBe("sale_date");
    expect(query.direction).toBe("desc");
  });
});
