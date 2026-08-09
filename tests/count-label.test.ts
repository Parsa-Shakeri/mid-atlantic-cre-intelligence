import { describe, expect, it } from "vitest";
import { formatCount } from "../lib/count-label";

describe("formatCount", () => {
  it("uses readable singular and plural labels", () => {
    expect(formatCount(1, "record")).toBe("1 record");
    expect(formatCount(5, "record")).toBe("5 records");
  });

  it("supports an explicit irregular plural", () => {
    expect(formatCount(2, "property", "properties")).toBe("2 properties");
  });
});
