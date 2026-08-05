import { describe, expect, it } from "vitest";
import { validateCoordinatePair } from "../lib/property-validation";

describe("property coordinate validation", () => {
  it("accepts an empty pair or valid coordinates", () => {
    expect(() => validateCoordinatePair(null, null)).not.toThrow();
    expect(() => validateCoordinatePair(38.900262, -77.032031)).not.toThrow();
    expect(() => validateCoordinatePair(0, 0)).not.toThrow();
  });

  it("requires latitude and longitude together", () => {
    expect(() => validateCoordinatePair(38.9, null)).toThrow("Enter both latitude and longitude");
    expect(() => validateCoordinatePair(null, -77.03)).toThrow("Enter both latitude and longitude");
  });

  it("rejects non-finite and out-of-range values", () => {
    expect(() => validateCoordinatePair(Number.NaN, -77)).toThrow("Latitude must be between -90 and 90");
    expect(() => validateCoordinatePair(91, -77)).toThrow("Latitude must be between -90 and 90");
    expect(() => validateCoordinatePair(38.9, -181)).toThrow("Longitude must be between -180 and 180");
  });
});
