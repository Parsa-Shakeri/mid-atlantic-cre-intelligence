import { describe, expect, it } from "vitest";
import { parseMarkdownSections } from "../lib/markdown";
import { isResearchCategory, sampleResearchArticles, sampleResearchSummaries } from "../lib/research-data";
import { RESEARCH_CATEGORIES } from "../lib/types";

describe("research content model", () => {
  it("provides one labeled sample report for every controlled category", () => {
    expect(sampleResearchArticles).toHaveLength(7);
    expect(new Set(sampleResearchArticles.map((article) => article.category))).toEqual(new Set(RESEARCH_CATEGORIES));
    expect(sampleResearchArticles.every((article) => article.isSample)).toBe(true);
  });

  it("keeps list summaries free of detail-only fields", () => {
    expect(sampleResearchSummaries).toHaveLength(sampleResearchArticles.length);
    expect("body" in sampleResearchSummaries[0]).toBe(false);
  });

  it("parses level-two Markdown headings and paragraphs", () => {
    const sections = parseMarkdownSections("## First section\n\nParagraph one.\n\n## Second section\n\nParagraph two.");
    expect(sections).toEqual([
      { heading: "First section", paragraphs: ["Paragraph one."] },
      { heading: "Second section", paragraphs: ["Paragraph two."] },
    ]);
  });

  it("rejects categories outside the controlled list", () => {
    expect(isResearchCategory("Market Reports")).toBe(true);
    expect(isResearchCategory("Invented Category")).toBe(false);
  });

  it("provides limitations, a hypothetical exhibit, and related records for each report", () => {
    for (const article of sampleResearchArticles) {
      expect(article.executiveSummary.length).toBeGreaterThan(0);
      expect(article.limitations.length).toBeGreaterThan(0);
      expect(article.exhibit?.note.toLocaleLowerCase()).toMatch(/hypothetical|fictional|illustration|conceptual|process/);
      expect(article.relatedArticles.length).toBeGreaterThan(0);
      expect(article.relatedProperties.length).toBeGreaterThan(0);
    }
  });
});
