import type { ResearchExhibit } from "@/lib/types";

const MAX_EXHIBIT_COLUMNS = 8;
const MAX_EXHIBIT_ROWS = 25;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface ResearchExhibitFormFields {
  title: string;
  description: string;
  columns: string;
  rows: string;
  note: string;
}

const blankFormFields: ResearchExhibitFormFields = {
  title: "",
  description: "",
  columns: "",
  rows: "",
  note: "",
};

function splitCells(value: string) {
  return value.split("|").map((cell) => cell.trim());
}

function isCompleteExhibit(value: unknown): value is ResearchExhibit {
  if (!value || Array.isArray(value) || typeof value !== "object") return false;
  const exhibit = value as Record<string, unknown>;
  if (
    typeof exhibit.title !== "string" ||
    typeof exhibit.description !== "string" ||
    typeof exhibit.note !== "string" ||
    !exhibit.title.trim() ||
    !exhibit.description.trim() ||
    !exhibit.note.trim() ||
    !Array.isArray(exhibit.columns) ||
    !Array.isArray(exhibit.rows)
  ) return false;
  const columns = exhibit.columns;
  const rows = exhibit.rows;
  if (columns.length < 2 || columns.length > MAX_EXHIBIT_COLUMNS) return false;
  if (!columns.every((column) => typeof column === "string" && column.trim())) return false;
  if (rows.length < 1 || rows.length > MAX_EXHIBIT_ROWS) return false;
  return rows.every((row) =>
    Array.isArray(row) &&
    row.length === columns.length &&
    row.every((cell) => typeof cell === "string" && cell.trim()),
  );
}

export function parseResearchExhibit(value: unknown): ResearchExhibit | null {
  if (!isCompleteExhibit(value)) return null;
  return {
    title: value.title.trim(),
    description: value.description.trim(),
    columns: value.columns.map((column) => column.trim()),
    rows: value.rows.map((row) => row.map((cell) => cell.trim())),
    note: value.note.trim(),
  };
}

export function parseResearchExhibitFields(fields: ResearchExhibitFormFields): ResearchExhibit | null {
  const normalized = {
    title: fields.title.trim(),
    description: fields.description.trim(),
    columns: fields.columns.trim(),
    rows: fields.rows.trim(),
    note: fields.note.trim(),
  };
  if (Object.values(normalized).every((value) => !value)) return null;
  if (!normalized.title || !normalized.description || !normalized.columns || !normalized.rows || !normalized.note) {
    throw new Error("Complete every research exhibit field, or leave the entire exhibit blank.");
  }

  const columns = splitCells(normalized.columns);
  if (columns.length < 2 || columns.length > MAX_EXHIBIT_COLUMNS || columns.some((column) => !column)) {
    throw new Error(`Research exhibits require 2 to ${MAX_EXHIBIT_COLUMNS} non-empty pipe-separated columns.`);
  }

  const rows = normalized.rows.split(/\r?\n/).map((row) => splitCells(row));
  if (rows.length < 1 || rows.length > MAX_EXHIBIT_ROWS) {
    throw new Error(`Research exhibits require 1 to ${MAX_EXHIBIT_ROWS} rows.`);
  }
  const invalidRow = rows.findIndex((row) => row.length !== columns.length || row.some((cell) => !cell));
  if (invalidRow >= 0) {
    throw new Error(`Exhibit row ${invalidRow + 1} must contain exactly ${columns.length} non-empty cells.`);
  }

  return {
    title: normalized.title,
    description: normalized.description,
    columns,
    rows,
    note: normalized.note,
  };
}

export function researchExhibitToFormFields(value: unknown): ResearchExhibitFormFields {
  const exhibit = parseResearchExhibit(value);
  if (!exhibit) return { ...blankFormFields };
  return {
    title: exhibit.title,
    description: exhibit.description,
    columns: exhibit.columns.join(" | "),
    rows: exhibit.rows.map((row) => row.join(" | ")).join("\n"),
    note: exhibit.note,
  };
}

export function parseRelatedPropertyIds(values: unknown[], maximum = 20) {
  const ids = [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];
  if (ids.length > maximum) throw new Error(`Select no more than ${maximum} related properties.`);
  if (ids.some((id) => !UUID_PATTERN.test(id))) throw new Error("Related property selection is invalid.");
  return ids;
}
