import { describe, expect, it } from "vitest";
import {
  buildComparableMetrics,
  buildComparablePageHref,
  buildComparableRemovalHref,
  filterComparableRecords,
  parseComparableQuery,
} from "../lib/comparable-utils";
import { samplePropertyList } from "../lib/sample-data";

describe("comparable query parsing", () => {
  it("rejects invalid values and clamps pagination", () => {
    const query = parseComparableQuery({
      dateFrom: "2026-02-30",
      dateTo: "not-a-date",
      state: "NY",
      propertyType: "Warehouse",
      verificationStatus: "Unverified",
      priceMin: "-1",
      priceMax: "not-a-number",
      sizeTarget: "0",
      sizeTolerance: "75",
      page: "999",
    });

    expect(query).toMatchObject({
      dateFrom: "",
      dateTo: "",
      state: "",
      propertyType: "",
      verificationStatus: "",
      priceMin: null,
      priceMax: null,
      sizeTarget: null,
      sizeTolerance: 25,
      page: 100,
    });
  });

  it("normalizes a reversed date range", () => {
    const query = parseComparableQuery({ dateFrom: "2026-06-30", dateTo: "2025-01-01", priceMin: "50000000", priceMax: "10000000" });

    expect(query.dateFrom).toBe("2025-01-01");
    expect(query.dateTo).toBe("2026-06-30");
    expect(query.priceMin).toBe(10_000_000);
    expect(query.priceMax).toBe(50_000_000);
  });
});

describe("comparable filtering and ordering", () => {
  it("combines date, geography, sector, price, and building-size filters", () => {
    const query = parseComparableQuery({
      dateFrom: "2025-01-01",
      dateTo: "2025-12-31",
      state: "MD",
      propertyType: "Industrial",
      priceMin: "20000000",
      priceMax: "40000000",
      sizeTarget: "200000",
      sizeTolerance: "50",
    });

    const records = filterComparableRecords(samplePropertyList, query);

    expect(records.map((record) => record.slug)).toEqual([
      "i95-distribution-annex-sample",
      "potomac-trade-center-sample",
    ]);
  });

  it("sorts by newest sale when no target building size is supplied", () => {
    const records = filterComparableRecords(samplePropertyList, parseComparableQuery({ state: "DC" }));

    expect(records.map((record) => record.saleDate)).toEqual(["2025-06-30", "2024-02-16"]);
  });
});

describe("comparable metrics", () => {
  const records = [
    { ...samplePropertyList[0], transactionId: "metric-1", salePrice: 10, buildingSqFt: 1_000, pricePerSqFt: 100, reportedCapRate: 0.05 },
    { ...samplePropertyList[1], transactionId: "metric-2", salePrice: 20, buildingSqFt: 2_000, pricePerSqFt: null, reportedCapRate: 0.06 },
    { ...samplePropertyList[2], transactionId: "metric-3", salePrice: 30, buildingSqFt: null, pricePerSqFt: 300, reportedCapRate: 0.07 },
  ];

  it("calculates medians from usable values and preserves the full matched count", () => {
    expect(buildComparableMetrics(records, 7)).toEqual({
      matchedSales: 7,
      metricRecordCount: 3,
      totalSalesVolume: 60,
      medianSalePrice: 20,
      medianPricePerSqFt: 200,
      pricePerSqFtSampleSize: 2,
      medianBuildingSqFt: 1_500,
      buildingSizeSampleSize: 2,
      medianReportedCapRate: 0.06,
      capRateSampleSize: 3,
    });
  });

  it("suppresses the cap-rate median below the minimum reported sample", () => {
    const metrics = buildComparableMetrics(records.slice(0, 2));

    expect(metrics.capRateSampleSize).toBe(2);
    expect(metrics.medianReportedCapRate).toBeNull();
  });
});

describe("comparable URLs", () => {
  it("changes only the requested page without mutating the source parameters", () => {
    const current = new URLSearchParams("state=MD&sizeTarget=200000&sizeTolerance=25&page=4&propertyType=Industrial");

    expect(buildComparablePageHref(current, 2)).toBe("/comparables?state=MD&sizeTarget=200000&sizeTolerance=25&page=2&propertyType=Industrial");
    expect(current.get("page")).toBe("4");
  });

  it("removes grouped filters and pagination while preserving other filters", () => {
    const current = new URLSearchParams("state=MD&sizeTarget=200000&sizeTolerance=25&page=4&propertyType=Industrial");

    expect(buildComparableRemovalHref(current, ["sizeTarget", "sizeTolerance"])).toBe("/comparables?state=MD&propertyType=Industrial");
    expect(current.get("sizeTarget")).toBe("200000");
    expect(current.get("page")).toBe("4");
  });
});
