import { NextResponse } from "next/server";
import { createAuthenticatedSupabaseClient } from "@/lib/supabase/auth-server";

const fields = [
  "property_name", "street_address", "city", "state", "zip_code", "county", "property_type", "building_sq_ft", "major_tenants",
  "sale_date", "sale_price", "buyer", "seller", "reported_cap_rate", "reported_noi", "price_per_sq_ft", "transaction_type",
  "verification_status", "date_verified", "date_added", "is_sample",
] as const;

function safeCell(value: unknown) {
  const raw = Array.isArray(value) ? value.join("; ") : value == null ? "" : String(value);
  const formulaSafe = /^[=+@-]/.test(raw) ? `'${raw}` : raw;
  return `"${formulaSafe.replaceAll('"', '""')}"`;
}

export async function GET() {
  const client = await createAuthenticatedSupabaseClient();
  if (!client) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { data: { user } } = await client.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { data: profile } = await client.from("admin_profiles").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!profile) return NextResponse.json({ error: "Administrator role required." }, { status: 403 });
  const { data, error } = await client.from("property_transaction_records").select(fields.join(",")).order("sale_date", { ascending: false }).limit(10000);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const rows = (data ?? []).map((record) => {
    const values = record as unknown as Record<string, unknown>;
    return fields.map((field) => safeCell(values[field])).join(",");
  });
  const csv = [fields.join(","), ...rows].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, { headers: { "Content-Disposition": `attachment; filename="mid-atlantic-cre-records-${date}.csv"`, "Content-Type": "text/csv; charset=utf-8", "Cache-Control": "private, no-store" } });
}
