"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { CSV_TARGET_FIELDS, generateSlug, mapAndValidateCsvRows, type CsvColumnMapping, type CsvImportRow } from "@/lib/csv-import";
import { PROPERTY_TYPES, RESEARCH_CATEGORIES, US_STATES, VERIFICATION_STATUSES, type CoveredState, type PropertyType, type ResearchCategory, type VerificationStatus } from "@/lib/types";
import type { Database, Json } from "@/lib/supabase/database.types";

type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];
type TransactionInsert = Database["public"]["Tables"]["transactions"]["Insert"];
type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];
type SourceInsert = Database["public"]["Tables"]["sources"]["Insert"];

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();
const nullableText = (formData: FormData, key: string) => text(formData, key) || null;
const nullableNumber = (formData: FormData, key: string) => { const value = text(formData, key); return value ? Number(value) : null; };
const lines = (value: string) => value.split(/\r?\n|;/).map((item) => item.trim()).filter(Boolean);
const checkbox = (formData: FormData, key: string) => formData.get(key) === "on";
const fail = (path: string, message: string): never => redirect(`${path}?error=${encodeURIComponent(message)}`);
const succeed = (path: string, message: string): never => redirect(`${path}?status=${encodeURIComponent(message)}`);
const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const today = () => new Date().toISOString().slice(0, 10);
const validHttpUrl = (value: string) => { try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; } };

function ensurePositive(value: number | null, label: string, required = false) {
  if (required && value === null) throw new Error(`${label} is required.`);
  if (value !== null && (!Number.isFinite(value) || value <= 0)) throw new Error(`${label} must be positive.`);
}

function revalidatePropertyData() {
  revalidatePath("/");
  revalidatePath("/properties", "layout");
  revalidatePath("/dashboard");
}

function revalidateResearchData() {
  revalidatePath("/");
  revalidatePath("/research", "layout");
}

function revalidateSourcePages() {
  revalidatePath("/properties", "layout");
  revalidatePath("/research", "layout");
}

export async function savePropertyAction(formData: FormData) {
  const { client } = await requireAdmin();
  const id = text(formData, "id");
  const state = text(formData, "state") as CoveredState;
  const propertyType = text(formData, "property_type") as PropertyType;
  const propertyName = text(formData, "property_name");
  const buildingSqFt = nullableNumber(formData, "building_sq_ft");
  try {
    if (!propertyName || !text(formData, "street_address") || !text(formData, "city") || !text(formData, "zip_code") || !text(formData, "county")) throw new Error("Complete all required property fields.");
    if (!US_STATES.includes(state)) throw new Error("State must be MD, DC, or VA.");
    if (!PROPERTY_TYPES.includes(propertyType)) throw new Error("Select a controlled property type.");
    ensurePositive(buildingSqFt, "Building square footage");
    ensurePositive(nullableNumber(formData, "lot_acres"), "Lot acreage");
    ensurePositive(nullableNumber(formData, "number_of_floors"), "Number of floors");
    const parkingSpaces = nullableNumber(formData, "parking_spaces");
    if (parkingSpaces !== null && (!Number.isInteger(parkingSpaces) || parkingSpaces < 0)) throw new Error("Parking spaces must be a non-negative whole number.");
    const yearBuilt = nullableNumber(formData, "year_built");
    const yearRenovated = nullableNumber(formData, "year_renovated");
    const currentYear = new Date().getUTCFullYear();
    if (yearBuilt !== null && (!Number.isInteger(yearBuilt) || yearBuilt < 1700 || yearBuilt > currentYear)) throw new Error("Year built is outside the supported range.");
    if (yearRenovated !== null && (!Number.isInteger(yearRenovated) || yearRenovated < (yearBuilt ?? 1700) || yearRenovated > currentYear)) throw new Error("Year renovated must be after year built and not in the future.");
    const payload: PropertyInsert = { slug: text(formData, "slug") || generateSlug(propertyName), property_name: propertyName,
      street_address: text(formData, "street_address"), city: text(formData, "city"), state, zip_code: text(formData, "zip_code"), county: text(formData, "county"),
      property_type: propertyType, building_sq_ft: buildingSqFt, lot_acres: nullableNumber(formData, "lot_acres"), year_built: yearBuilt,
      year_renovated: yearRenovated, number_of_floors: nullableNumber(formData, "number_of_floors"), parking_spaces: parkingSpaces,
      major_tenants: lines(text(formData, "major_tenants")), description: text(formData, "description"), lease_structure: nullableText(formData, "lease_structure"), is_sample: checkbox(formData, "is_sample") };
    const result = id ? await client.from("properties").update(payload).eq("id", id) : await client.from("properties").insert(payload);
    if (result.error) throw result.error;
  } catch (error) { fail("/admin/properties", error instanceof Error ? error.message : "Property could not be saved."); }
  revalidatePath("/admin"); revalidatePath("/admin/properties"); revalidatePropertyData();
  succeed("/admin/properties", id ? "Property updated." : "Property created.");
}

export async function deletePropertyAction(formData: FormData) {
  const { client } = await requireAdmin();
  if (text(formData, "confirm") !== "DELETE") fail("/admin/properties", "Type DELETE to confirm property deletion.");
  const { error } = await client.from("properties").delete().eq("id", text(formData, "id"));
  if (error) fail("/admin/properties", error.message);
  revalidatePath("/admin"); revalidatePath("/admin/properties"); revalidatePropertyData();
  succeed("/admin/properties", "Property and related transactions were deleted.");
}

export async function saveTransactionAction(formData: FormData) {
  const { client } = await requireAdmin();
  const id = text(formData, "id");
  const salePrice = nullableNumber(formData, "sale_price");
  const capPercent = nullableNumber(formData, "reported_cap_rate_percent");
  const status = text(formData, "verification_status") as VerificationStatus;
  try {
    if (!text(formData, "property_id") || !validDate(text(formData, "sale_date")) || text(formData, "sale_date") > today()) throw new Error("Property and a valid sale date that is not in the future are required.");
    ensurePositive(salePrice, "Sale price", true); ensurePositive(nullableNumber(formData, "reported_noi"), "Reported NOI");
    if (capPercent !== null && (capPercent <= 0 || capPercent > 30)) throw new Error("Reported cap rate must be greater than 0% and no more than 30%.");
    if (!VERIFICATION_STATUSES.includes(status)) throw new Error("Select a verification status.");
    const dateVerified = nullableText(formData, "date_verified");
    if (["Verified", "Single Source"].includes(status) && !dateVerified) throw new Error("This verification status requires a verification date.");
    if (dateVerified && (!validDate(dateVerified) || dateVerified > today())) throw new Error("Verification date must be valid and not in the future.");
    const { data: property } = await client.from("properties").select("building_sq_ft").eq("id", text(formData, "property_id")).single();
    const payload: TransactionInsert = { property_id: text(formData, "property_id"), sale_date: text(formData, "sale_date"), sale_price: salePrice as number,
      buyer: nullableText(formData, "buyer"), seller: nullableText(formData, "seller"), reported_cap_rate: capPercent === null ? null : capPercent / 100,
      reported_noi: nullableNumber(formData, "reported_noi"), price_per_sq_ft: property?.building_sq_ft ? Math.round(((salePrice as number) / property.building_sq_ft) * 100) / 100 : null,
      transaction_type: text(formData, "transaction_type") || "Asset Sale", notes: nullableText(formData, "notes"), verification_status: status,
      date_verified: dateVerified, is_sample: checkbox(formData, "is_sample") };
    const result = id ? await client.from("transactions").update(payload).eq("id", id) : await client.from("transactions").insert(payload);
    if (result.error) throw result.error;
  } catch (error) { fail("/admin/transactions", error instanceof Error ? error.message : "Transaction could not be saved."); }
  revalidatePath("/admin"); revalidatePath("/admin/transactions"); revalidatePropertyData();
  succeed("/admin/transactions", id ? "Transaction updated." : "Transaction created.");
}

export async function deleteTransactionAction(formData: FormData) {
  const { client } = await requireAdmin();
  if (text(formData, "confirm") !== "DELETE") fail("/admin/transactions", "Type DELETE to confirm transaction deletion.");
  const { error } = await client.from("transactions").delete().eq("id", text(formData, "id"));
  if (error) fail("/admin/transactions", error.message);
  revalidatePath("/admin"); revalidatePath("/admin/transactions"); revalidatePropertyData();
  succeed("/admin/transactions", "Transaction deleted.");
}

export async function saveArticleAction(formData: FormData) {
  const { client } = await requireAdmin();
  const id = text(formData, "id");
  const title = text(formData, "title");
  const category = text(formData, "category") as ResearchCategory;
  const status = text(formData, "status") as "draft" | "published" | "archived";
  try {
    if (!title || !text(formData, "thesis") || !text(formData, "summary") || !text(formData, "body") || !text(formData, "author")) throw new Error("Complete all required article fields.");
    if (!RESEARCH_CATEGORIES.includes(category)) throw new Error("Select a controlled research category.");
    if (!["draft", "published", "archived"].includes(status)) throw new Error("Select a valid publication status.");
    const publicationDate = nullableText(formData, "publication_date");
    if (status === "published" && !publicationDate) throw new Error("Published articles require a publication date.");
    if (status === "published" && text(formData, "body").length <= 100) throw new Error("Published article body must exceed 100 characters.");
    if (status === "published" && !lines(text(formData, "executive_summary")).length) throw new Error("Published articles require an executive summary.");
    const featuredImage = nullableText(formData, "featured_image");
    if (featuredImage && !validHttpUrl(featuredImage)) throw new Error("Featured image must use a valid http or https URL.");
    ensurePositive(nullableNumber(formData, "reading_time"), "Reading time", true);
    const payload: ArticleInsert = { slug: text(formData, "slug") || generateSlug(title), title, thesis: text(formData, "thesis"), summary: text(formData, "summary"),
      executive_summary: lines(text(formData, "executive_summary")), body: text(formData, "body"), category, featured_image: featuredImage,
      publication_date: publicationDate, status, featured: checkbox(formData, "featured"), reading_time: nullableNumber(formData, "reading_time") ?? 1,
      author: text(formData, "author"), limitations: lines(text(formData, "limitations")), is_sample: checkbox(formData, "is_sample") };
    const result = id ? await client.from("articles").update(payload).eq("id", id) : await client.from("articles").insert(payload);
    if (result.error) throw result.error;
  } catch (error) { fail("/admin/articles", error instanceof Error ? error.message : "Article could not be saved."); }
  revalidatePath("/admin"); revalidatePath("/admin/articles"); revalidateResearchData();
  succeed("/admin/articles", id ? "Article updated." : "Article created.");
}

export async function deleteArticleAction(formData: FormData) {
  const { client } = await requireAdmin();
  if (text(formData, "confirm") !== "DELETE") fail("/admin/articles", "Type DELETE to confirm article deletion.");
  const { error } = await client.from("articles").delete().eq("id", text(formData, "id"));
  if (error) fail("/admin/articles", error.message);
  revalidatePath("/admin"); revalidatePath("/admin/articles"); revalidateResearchData();
  succeed("/admin/articles", "Article deleted.");
}

export async function saveSourceAction(formData: FormData) {
  const { client } = await requireAdmin();
  const id = text(formData, "id");
  const sourceUrl = text(formData, "source_url");
  try {
    if (!text(formData, "source_name") || !sourceUrl || !text(formData, "accessed_date") || !text(formData, "source_type")) throw new Error("Complete all required source fields.");
    if (!validHttpUrl(sourceUrl)) throw new Error("Source URL must use http or https.");
    if (!validDate(text(formData, "accessed_date")) || text(formData, "accessed_date") > today()) throw new Error("Date accessed must be valid and not in the future.");
    const publicationDate = nullableText(formData, "publication_date");
    if (publicationDate && !validDate(publicationDate)) throw new Error("Publication date must be valid.");
    if (!text(formData, "property_id") && !text(formData, "transaction_id") && !text(formData, "article_id")) throw new Error("Attach the source to at least one record.");
    const payload: SourceInsert = { property_id: nullableText(formData, "property_id"), transaction_id: nullableText(formData, "transaction_id"), article_id: nullableText(formData, "article_id"),
      source_name: text(formData, "source_name"), source_url: sourceUrl, publication_date: publicationDate, accessed_date: text(formData, "accessed_date"),
      source_type: text(formData, "source_type"), notes: nullableText(formData, "notes"), is_sample: checkbox(formData, "is_sample") };
    const result = id ? await client.from("sources").update(payload).eq("id", id) : await client.from("sources").insert(payload);
    if (result.error) throw result.error;
  } catch (error) { fail("/admin/sources", error instanceof Error ? error.message : "Source could not be saved."); }
  revalidatePath("/admin"); revalidatePath("/admin/sources"); revalidateSourcePages();
  succeed("/admin/sources", id ? "Source updated." : "Source attached.");
}

export async function deleteSourceAction(formData: FormData) {
  const { client } = await requireAdmin();
  if (text(formData, "confirm") !== "DELETE") fail("/admin/sources", "Type DELETE to confirm source deletion.");
  const { error } = await client.from("sources").delete().eq("id", text(formData, "id"));
  if (error) fail("/admin/sources", error.message);
  revalidatePath("/admin"); revalidatePath("/admin/sources"); revalidateSourcePages();
  succeed("/admin/sources", "Source deleted.");
}

export async function importCsvRowsAction(formData: FormData) {
  const { client } = await requireAdmin();
  let rows: CsvImportRow[] = [];
  try {
    const parsed: unknown = JSON.parse(text(formData, "payload"));
    if (!Array.isArray(parsed)) throw new Error("Import payload is invalid.");
    const submitted = parsed as Array<Record<string, unknown>>;
    const mapping = Object.fromEntries(CSV_TARGET_FIELDS.map(([field], index) => [field, index])) as CsvColumnMapping;
    const values = submitted.map((row) => CSV_TARGET_FIELDS.map(([field]) => {
      const value = row[field];
      return Array.isArray(value) ? value.join(";") : typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : "";
    }));
    const checked = mapAndValidateCsvRows(values, mapping);
    if (!checked.length || checked.some((result) => result.errors.length || !result.row)) throw new Error("Import was rejected because one or more rows failed server validation.");
    rows = checked.flatMap((result) => result.row ? [result.row] : []);
    if (text(formData, "confirm_import") !== "yes") throw new Error("Confirm the reviewed import before continuing.");
    const { error } = await client.rpc("import_property_transactions", { import_rows: rows as unknown as Json });
    if (error) throw error;
  } catch (error) { fail("/admin/import", error instanceof Error ? error.message : "CSV import failed."); }
  revalidatePath("/admin"); revalidatePath("/admin/properties"); revalidatePath("/admin/transactions"); revalidatePropertyData();
  succeed("/admin/import", `${rows.length} rows imported atomically.`);
}
