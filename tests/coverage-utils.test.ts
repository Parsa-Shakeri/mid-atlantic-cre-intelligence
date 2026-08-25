import { describe, expect, it } from "vitest";
import { buildCoverageData } from "../lib/coverage-utils";

const properties = [
  { id: "p1", state: "MD", propertyType: "Office" as const, buildingSqFt: 100_000, updatedAt: "2026-08-01T00:00:00Z" },
  { id: "p2", state: "VA", propertyType: "Retail" as const, buildingSqFt: null, updatedAt: "2026-08-02T00:00:00Z" },
];

const transactions = [
  { id: "t1", propertyId: "p1", saleDate: "2025-01-15", buyer: "Buyer A", seller: "Seller A", reportedCapRate: 0.06, reportedNoi: null, pricePerSqFt: 250, verificationStatus: "Verified" as const, dateVerified: "2026-08-01", updatedAt: "2026-08-03T00:00:00Z" },
  { id: "t2", propertyId: "p2", saleDate: "2026-02-20", buyer: null, seller: "Seller B", reportedCapRate: null, reportedNoi: null, pricePerSqFt: null, verificationStatus: "Incomplete" as const, dateVerified: null, updatedAt: "2026-08-04T00:00:00Z" },
];

describe("buildCoverageData", () => {
  it("calculates geography, field availability, and date bounds", () => {
    const data = buildCoverageData({ properties, transactions, sources: [] }, { queryLimit: 5000 });
    expect(data.propertyCount).toBe(2);
    expect(data.transactionCount).toBe(2);
    expect(data.earliestSaleDate).toBe("2025-01-15");
    expect(data.latestSaleDate).toBe("2026-02-20");
    expect(data.latestUpdatedAt).toBe("2026-08-04T00:00:00Z");
    expect(data.byState.find((row) => row.label === "MD")).toMatchObject({ propertyCount: 1, transactionCount: 1, transactionShare: 50 });
    expect(data.fields.find((row) => row.key === "building-area")).toMatchObject({ availableCount: 1, missingCount: 1, missingRate: 50 });
    expect(data.fields.find((row) => row.key === "reported-noi")).toMatchObject({ availableCount: 0, missingRate: 100 });
  });

  it("deduplicates property and transaction citations before measuring source support", () => {
    const sources = [
      { id: "s1", propertyId: "p1", transactionId: "t1", createdAt: "2026-08-05T00:00:00Z" },
      { id: "s2", propertyId: "p1", transactionId: null, createdAt: "2026-08-06T00:00:00Z" },
    ];
    const data = buildCoverageData({ properties, transactions, sources }, { queryLimit: 5000 });
    expect(data.sourceLinkedTransactionCount).toBe(1);
    expect(data.multiSourceTransactionCount).toBe(1);
    expect(data.unsourcedTransactionCount).toBe(1);
    expect(data.latestUpdatedAt).toBe("2026-08-06T00:00:00Z");
  });
});
