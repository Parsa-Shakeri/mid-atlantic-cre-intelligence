import { describe, expect, it } from "vitest";
import { isNavItemActive } from "../lib/navigation";

describe("isNavItemActive", () => {
  it("matches the home page only at the site root", () => {
    expect(isNavItemActive("/", "/")).toBe(true);
    expect(isNavItemActive("/research", "/")).toBe(false);
  });

  it("keeps a public section active on its detail pages", () => {
    expect(isNavItemActive("/properties/barcroft-plaza", "/properties")).toBe(true);
    expect(isNavItemActive("/research/market-monitor", "/research")).toBe(true);
    expect(isNavItemActive("/project", "/project")).toBe(true);
    expect(isNavItemActive("/comparables?state=MD", "/comparables")).toBe(false);
    expect(isNavItemActive("/comparables", "/comparables")).toBe(true);
  });

  it("does not match routes that merely share a prefix", () => {
    expect(isNavItemActive("/researcher", "/research")).toBe(false);
  });
});
