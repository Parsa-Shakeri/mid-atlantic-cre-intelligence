import { describe, expect, it } from "vitest";
import { safePublicUrl } from "../lib/public-profile";

describe("safePublicUrl", () => {
  it("accepts public HTTP links", () => {
    expect(safePublicUrl("https://github.com/example")).toBe("https://github.com/example");
  });

  it("rejects missing, malformed, and unsafe links", () => {
    expect(safePublicUrl()).toBeNull();
    expect(safePublicUrl("not a URL")).toBeNull();
    expect(safePublicUrl("javascript:alert(1)")).toBeNull();
  });
});
