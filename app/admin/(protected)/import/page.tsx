import Link from "next/link";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CsvImporter } from "@/components/admin/csv-importer";
import { requireAdmin } from "@/lib/admin-auth";

type Params = Promise<{ status?: string; error?: string }>;

export default async function CsvImportPage({ searchParams }: { searchParams: Params }) {
  const query = await searchParams;
  const { client } = await requireAdmin();
  const { data: properties, error } = await client.from("properties").select("street_address, city, state, zip_code").limit(5000);
  const addressKeys = (properties ?? []).map((property) => `${property.street_address}|${property.city}|${property.state}|${property.zip_code}`.toLocaleLowerCase());
  return <><AdminPageHeader eyebrow="Bulk intake" title="CSV import" description="Map, preview, and validate new property-and-transaction rows before any database write. Invalid rows are never skipped silently." />
    <AdminNotice error={query.error ?? error?.message} status={query.status} />
    <div className="mb-6 flex flex-wrap gap-3 text-sm"><a className="button-secondary" download href="/sample-import.csv">Download template</a><Link className="button-secondary" href="/admin/sources?quality=missing">Review missing sources</Link></div>
    <CsvImporter existingAddressKeys={addressKeys} />
  </>;
}
