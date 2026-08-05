import Link from "next/link";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteForm } from "@/components/admin/delete-form";
import { deletePropertyAction, savePropertyAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { PROPERTY_TYPES, US_STATES } from "@/lib/types";

type Params = Promise<{ edit?: string; status?: string; error?: string }>;

export default async function AdminPropertiesPage({ searchParams }: { searchParams: Params }) {
  const query = await searchParams;
  const { client } = await requireAdmin();
  const { data: properties, error } = await client.from("properties").select("*").order("updated_at", { ascending: false }).limit(75);
  const edited = query.edit ? properties?.find((property) => property.id === query.edit) : undefined;
  return <><AdminPageHeader eyebrow="Database" title="Properties" description="Create and maintain the physical property record. Transactions and sources are linked separately." />
    <AdminNotice error={query.error ?? error?.message} status={query.status} />
    <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_410px]"><section className="panel min-w-0 p-5"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl text-navy">Recent properties</h2><span className="tag">{properties?.length ?? 0} shown</span></div><div className="mt-4 overflow-x-auto"><table className="admin-table"><thead><tr><th>Property</th><th>Market</th><th>Type</th><th>Updated</th><th>Action</th></tr></thead><tbody>{properties?.map((property) => <tr key={property.id}><td className="font-semibold text-navy">{property.property_name}{property.is_sample ? <span className="ml-2 tag">Sample</span> : null}<br /><span className="font-normal text-slate">{property.street_address}</span></td><td>{property.city}, {property.state}<br />{property.county}</td><td>{property.property_type}</td><td>{new Intl.DateTimeFormat("en-US").format(new Date(property.updated_at))}</td><td><Link className="font-semibold text-accent" href={`/admin/properties?edit=${property.id}`}>Edit</Link><DeleteForm action={deletePropertyAction} id={property.id} label={property.property_name} /></td></tr>)}</tbody></table></div>{!properties?.length ? <p className="py-8 text-sm text-slate">No properties found.</p> : null}</section>
      <section className="panel p-5"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl text-navy">{edited ? "Edit property" : "Add property"}</h2>{edited ? <Link className="text-xs font-semibold text-accent" href="/admin/properties">Cancel</Link> : null}</div><form action={savePropertyAction} className="mt-5 grid gap-4">{edited ? <input name="id" type="hidden" value={edited.id} /> : null}
        <label className="admin-field">Property name<input className="admin-input" defaultValue={edited?.property_name} name="property_name" required /></label>
        <label className="admin-field">Slug <span className="font-normal text-slate">Leave blank to generate.</span><input className="admin-input" defaultValue={edited?.slug} name="slug" /></label>
        <label className="admin-field">Street address<input className="admin-input" defaultValue={edited?.street_address} name="street_address" required /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="admin-field">City<input className="admin-input" defaultValue={edited?.city} name="city" required /></label><label className="admin-field">ZIP code<input className="admin-input" defaultValue={edited?.zip_code} name="zip_code" required /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="admin-field">State<select className="admin-input" defaultValue={edited?.state ?? "MD"} name="state">{US_STATES.map((state) => <option key={state}>{state}</option>)}</select></label><label className="admin-field">County / district<input className="admin-input" defaultValue={edited?.county} name="county" required /></label></div>
        <fieldset className="grid gap-4 sm:grid-cols-2"><legend className="col-span-full text-xs font-semibold text-slate">Map coordinates <span className="font-normal">Enter both values or leave both blank.</span></legend><label className="admin-field">Latitude<input className="admin-input" defaultValue={edited?.latitude ?? ""} inputMode="decimal" max="90" min="-90" name="latitude" placeholder="38.900262" step="any" type="number" /></label><label className="admin-field">Longitude<input className="admin-input" defaultValue={edited?.longitude ?? ""} inputMode="decimal" max="180" min="-180" name="longitude" placeholder="-77.032031" step="any" type="number" /></label></fieldset>
        <label className="admin-field">Property type<select className="admin-input" defaultValue={edited?.property_type ?? "Office"} name="property_type">{PROPERTY_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="admin-field">Building sq. ft.<input className="admin-input" defaultValue={edited?.building_sq_ft ?? ""} min="1" name="building_sq_ft" type="number" /></label><label className="admin-field">Lot acres<input className="admin-input" defaultValue={edited?.lot_acres ?? ""} min="0" name="lot_acres" step="0.01" type="number" /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="admin-field">Year built<input className="admin-input" defaultValue={edited?.year_built ?? ""} name="year_built" type="number" /></label><label className="admin-field">Year renovated<input className="admin-input" defaultValue={edited?.year_renovated ?? ""} name="year_renovated" type="number" /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="admin-field">Floors<input className="admin-input" defaultValue={edited?.number_of_floors ?? ""} min="0" name="number_of_floors" type="number" /></label><label className="admin-field">Parking spaces<input className="admin-input" defaultValue={edited?.parking_spaces ?? ""} min="0" name="parking_spaces" type="number" /></label></div>
        <label className="admin-field">Major tenants <span className="font-normal text-slate">One per line or separated by semicolons.</span><textarea className="admin-input min-h-24" defaultValue={edited?.major_tenants.join("\n")} name="major_tenants" /></label>
        <label className="admin-field">Lease structure<input className="admin-input" defaultValue={edited?.lease_structure ?? ""} name="lease_structure" /></label>
        <label className="admin-field">Description<textarea className="admin-input min-h-28" defaultValue={edited?.description} name="description" /></label>
        <label className="flex items-center gap-2 text-sm text-navy"><input defaultChecked={edited?.is_sample ?? false} name="is_sample" type="checkbox" /> Fictional sample record</label>
        <button className="button-primary" type="submit">{edited ? "Save changes" : "Create property"}</button>
      </form></section></div>
  </>;
}
