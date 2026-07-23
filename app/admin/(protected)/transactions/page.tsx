import Link from "next/link";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteForm } from "@/components/admin/delete-form";
import { deleteTransactionAction, saveTransactionAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { VERIFICATION_STATUSES } from "@/lib/types";

type Params = Promise<{ edit?: string; quality?: string; status?: string; error?: string }>;
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default async function AdminTransactionsPage({ searchParams }: { searchParams: Params }) {
  const query = await searchParams;
  const { client } = await requireAdmin();
  const [transactionsResult, propertiesResult] = await Promise.all([
    client.from("transactions").select("*").order("updated_at", { ascending: false }).limit(100),
    client.from("properties").select("id, property_name, street_address").order("property_name").limit(500),
  ]);
  const allTransactions = transactionsResult.data ?? [];
  const transactions = query.quality === "incomplete" ? allTransactions.filter((row) => row.verification_status === "Incomplete") : query.quality === "verification-date" ? allTransactions.filter((row) => ["Verified", "Single Source"].includes(row.verification_status) && !row.date_verified) : allTransactions;
  const edited = query.edit ? allTransactions.find((transaction) => transaction.id === query.edit) : undefined;
  const propertyMap = new Map((propertiesResult.data ?? []).map((property) => [property.id, property]));
  return <><AdminPageHeader eyebrow="Database" title="Transactions" description="Maintain transaction history, counterparties, reported metrics, and verification status. Price per square foot is calculated when building size is available." />
    <AdminNotice error={query.error ?? transactionsResult.error?.message ?? propertiesResult.error?.message} status={query.status} />
    {query.quality ? <p className="mb-5 text-sm text-slate">Quality filter active. <Link className="font-semibold text-accent" href="/admin/transactions">Show all transactions</Link></p> : null}
    <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_410px]"><section className="panel min-w-0 p-5"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl text-navy">Transaction records</h2><span className="tag">{transactions.length} shown</span></div><div className="mt-4 overflow-x-auto"><table className="admin-table"><thead><tr><th>Property</th><th>Sale</th><th>Verification</th><th>Parties</th><th>Action</th></tr></thead><tbody>{transactions.map((transaction) => { const property = propertyMap.get(transaction.property_id); return <tr key={transaction.id}><td className="font-semibold text-navy">{property?.property_name ?? "Unknown property"}<br /><span className="font-normal text-slate">{property?.street_address}</span></td><td>{money.format(transaction.sale_price)}<br />{transaction.sale_date}</td><td><span className="tag">{transaction.verification_status}</span>{transaction.date_verified ? <><br /><span className="text-xs">{transaction.date_verified}</span></> : null}</td><td>{transaction.buyer ?? "Buyer unavailable"}<br /><span className="text-xs">from {transaction.seller ?? "seller unavailable"}</span></td><td><Link className="font-semibold text-accent" href={`/admin/transactions?edit=${transaction.id}`}>Edit</Link><DeleteForm action={deleteTransactionAction} id={transaction.id} label="this transaction" /></td></tr>; })}</tbody></table></div>{!transactions.length ? <p className="py-8 text-sm text-slate">No transactions match this view.</p> : null}</section>
      <section className="panel p-5"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl text-navy">{edited ? "Edit transaction" : "Add transaction"}</h2>{edited ? <Link className="text-xs font-semibold text-accent" href="/admin/transactions">Cancel</Link> : null}</div><form action={saveTransactionAction} className="mt-5 grid gap-4">{edited ? <input name="id" type="hidden" value={edited.id} /> : null}
        <label className="admin-field">Property<select className="admin-input" defaultValue={edited?.property_id ?? ""} name="property_id" required><option disabled value="">Select a property</option>{propertiesResult.data?.map((property) => <option key={property.id} value={property.id}>{property.property_name} — {property.street_address}</option>)}</select></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="admin-field">Sale date<input className="admin-input" defaultValue={edited?.sale_date} max={new Date().toISOString().slice(0, 10)} name="sale_date" required type="date" /></label><label className="admin-field">Sale price<input className="admin-input" defaultValue={edited?.sale_price ?? ""} min="1" name="sale_price" required type="number" /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="admin-field">Buyer<input className="admin-input" defaultValue={edited?.buyer ?? ""} name="buyer" /></label><label className="admin-field">Seller<input className="admin-input" defaultValue={edited?.seller ?? ""} name="seller" /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="admin-field">Reported cap rate (%)<input className="admin-input" defaultValue={edited?.reported_cap_rate ? edited.reported_cap_rate * 100 : ""} max="30" min="0.01" name="reported_cap_rate_percent" step="0.01" type="number" /></label><label className="admin-field">Reported NOI<input className="admin-input" defaultValue={edited?.reported_noi ?? ""} min="1" name="reported_noi" type="number" /></label></div>
        <label className="admin-field">Transaction type<input className="admin-input" defaultValue={edited?.transaction_type ?? "Asset Sale"} name="transaction_type" /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="admin-field">Verification status<select className="admin-input" defaultValue={edited?.verification_status ?? "Incomplete"} name="verification_status">{VERIFICATION_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label><label className="admin-field">Date verified<input className="admin-input" defaultValue={edited?.date_verified ?? ""} max={new Date().toISOString().slice(0, 10)} name="date_verified" type="date" /></label></div>
        <label className="admin-field">Analyst notes<textarea className="admin-input min-h-28" defaultValue={edited?.notes ?? ""} name="notes" /></label>
        <label className="flex items-center gap-2 text-sm text-navy"><input defaultChecked={edited?.is_sample ?? false} name="is_sample" type="checkbox" /> Fictional sample record</label>
        <button className="button-primary" type="submit">{edited ? "Save changes" : "Create transaction"}</button>
      </form></section></div>
  </>;
}
