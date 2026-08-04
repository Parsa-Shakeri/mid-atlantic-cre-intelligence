import { describe, expect, it } from "vitest";
import {
  parseRelatedPropertyIds,
  parseResearchExhibit,
  parseResearchExhibitFields,
  researchExhibitToFormFields,
} from "../lib/research-exhibit";

const validFields = {
  title: "Selected transaction comparison",
  description: "Verified asset sales included in the report.",
  columns: "Property | Market | Type | Sale price | Price / sq. ft.",
  rows: [
    "Barcroft Plaza | Falls Church, VA | Retail | $58.025M | $513",
    "2300 Craftsman Circle | Hyattsville, MD | Industrial | $50.000M | $278",
  ].join("\n"),
  note: "Figures reflect stored verified records.",
};

describe("research exhibit editor", () => {
  it("treats an entirely blank exhibit as optional", () => {
    expect(parseResearchExhibitFields({ title: "", description: "", columns: "", rows: "", note: "" })).toBeNull();
  });

  it("builds a structured exhibit from pipe-separated editor fields", () => {
    expect(parseResearchExhibitFields(validFields)).toEqual({
      title: "Selected transaction comparison",
      description: "Verified asset sales included in the report.",
      columns: ["Property", "Market", "Type", "Sale price", "Price / sq. ft."],
      rows: [
        ["Barcroft Plaza", "Falls Church, VA", "Retail", "$58.025M", "$513"],
        ["2300 Craftsman Circle", "Hyattsville, MD", "Industrial", "$50.000M", "$278"],
      ],
      note: "Figures reflect stored verified records.",
    });
  });

  it("rejects rows whose cell count does not match the headings", () => {
    expect(() => parseResearchExhibitFields({ ...validFields, rows: "Barcroft Plaza | Retail | $58.025M" }))
      .toThrow("Exhibit row 1 must contain exactly 5 non-empty cells.");
  });

  it("rejects incomplete exhibits rather than silently discarding them", () => {
    expect(() => parseResearchExhibitFields({ ...validFields, note: "" }))
      .toThrow("Complete every research exhibit field");
  });

  it("round-trips valid stored exhibits and rejects malformed stored data", () => {
    const exhibit = parseResearchExhibitFields(validFields);
    expect(researchExhibitToFormFields(exhibit)).toEqual(validFields);
    expect(parseResearchExhibit({
      title: "Broken",
      description: "The row is missing a cell.",
      columns: ["Property", "Price"],
      rows: [["Barcroft Plaza"]],
      note: "Invalid.",
    })).toBeNull();
  });
});

describe("related property selection", () => {
  it("deduplicates valid property identifiers", () => {
    const id = "cbf524b3-8f5e-4ae7-983f-bddddbf2bba2";
    expect(parseRelatedPropertyIds([id, id])).toEqual([id]);
  });

  it("rejects invalid identifiers", () => {
    expect(() => parseRelatedPropertyIds(["not-a-property-id"])).toThrow("Related property selection is invalid.");
  });
});
