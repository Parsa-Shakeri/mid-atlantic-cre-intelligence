import { describe, expect, it } from "vitest";
import { buildDashboardData, median, parseDashboardFilters } from "../lib/dashboard-utils";
import { samplePropertyList } from "../lib/sample-data";

describe("dashboard calculations", () => {
  it("calculates medians for odd and even samples", () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 3, 2])).toBe(2.5);
    expect(median([])).toBeNull();
  });

  it("aggregates all fictional records and exposes sample sizes", () => {
    const data = buildDashboardData(samplePropertyList, parseDashboardFilters({}));
    expect(data.metrics.transactionCount).toBe(10);
    expect(data.metrics.capRateSampleSize).toBe(4);
    expect(data.metrics.medianReportedCapRate).toBeCloseTo(0.0565);
    expect(data.containsOnlySamples).toBe(true);
    expect(data.largestTransactions[0].salePrice).toBe(58_500_000);
  });

  it("combines date, state, and property-type filters", () => {
    const filters = parseDashboardFilters({ dateFrom: "2025-01-01", state: "MD", propertyType: "Industrial" });
    const data = buildDashboardData(samplePropertyList, filters);
    expect(data.metrics.transactionCount).toBe(2);
    expect(data.salesVolumeByPropertyType).toHaveLength(1);
    expect(data.salesVolumeByPropertyType[0].propertyType).toBe("Industrial");
  });

  it("suppresses cap-rate statistics below the minimum sample", () => {
    const data = buildDashboardData(samplePropertyList, parseDashboardFilters({ propertyType: "Industrial" }));
    expect(data.metrics.capRateSampleSize).toBe(1);
    expect(data.metrics.medianReportedCapRate).toBeNull();
    expect(data.capRateDistribution).toEqual([]);
  });

  it("normalizes invalid filter values", () => {
    const filters = parseDashboardFilters({ dateFrom: "not-a-date", state: "NY", propertyType: "Warehouse" });
    expect(filters.dateFrom).toBe("");
    expect(filters.state).toBe("");
    expect(filters.propertyType).toBe("");
  });
});
