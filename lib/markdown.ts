import type { MarkdownSection } from "./types";

export function getMarkdownSectionId(heading: string, index: number) {
  const slug = heading
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${String(index + 1).padStart(2, "0")}-${slug || "analysis"}`;
}

export function parseMarkdownSections(markdown: string): MarkdownSection[] {
  const sections: MarkdownSection[] = [];
  let current: MarkdownSection | null = null;
  for (const block of markdown.trim().split(/\n\s*\n/)) {
    const value = block.trim();
    if (!value) continue;
    if (value.startsWith("## ")) {
      current = { heading: value.slice(3).trim(), paragraphs: [] };
      sections.push(current);
    } else if (current) {
      current.paragraphs.push(value.replace(/\n/g, " "));
    } else {
      current = { heading: "Analysis", paragraphs: [value.replace(/\n/g, " ")] };
      sections.push(current);
    }
  }
  return sections;
}
