import type { MarkdownSection } from "./types";

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
