import Link from "next/link";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteForm } from "@/components/admin/delete-form";
import { deleteSourceAction, saveSourceAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";

type Params = Promise<{ edit?: string; quality?: string; status?: string; error?: string }>;

export default async function AdminSourcesPage({ searchParams }: { searchParams: Params }) {
  const query = await searchParams;
  const { client } = await requireAdmin();
  const [sourcesResult, propertiesResult, transactionsResult, articlesResult] = await Promise.all([
    client.from("sources").select("*").order("created_at", { ascending: false }).limit(100),
    client.from("properties").select("id, property_name, street_address").order("property_name").limit(500),
    client.from("transactions").select("id, property_id, sale_date, sale_price").order("sale_date", { ascending: false }).limit(500),
    client.from("articles").select("id, title, status").order("title").limit(500),
  ]);
  const sources = sourcesResult.data ?? [];
  const edited = query.edit ? sources.find((source) => source.id === query.edit) : undefined;
  const properties = propertiesResult.data ?? [];
  const transactions = transactionsResult.data ?? [];
  const propertyMap = new Map(properties.map((property) => [property.id, property]));
  const transactionMap = new Map(transactions.map((transaction) => [transaction.id, transaction]));
  const articleMap = new Map((articlesResult.data ?? []).map((article) => [article.id, article]));
  const sourcedTransactionIds = new Set(sources.flatMap((source) => source.transaction_id ? [source.transaction_id] : []));
  const sourcedPropertyIds = new Set(sources.flatMap((source) => source.property_id ? [source.property_id] : []));
  const missing = transactions.filter((transaction) => !sourcedTransactionIds.has(transaction.id) && !sourcedPropertyIds.has(transaction.property_id));
  return <><AdminPageHeader eyebrow="Verification" title="Sources" description="Attach public evidence to a property, transaction, article, or an appropriate combination. Links are validated before storage." />
    <AdminNotice error={query.error ?? sourcesResult.error?.message ?? propertiesResult.error?.message ?? transactionsResult.error?.message ?? articlesResult.error?.message} status={query.status} />
    {query.quality === "missing" ? <section className="panel mb-7 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-2xl text-navy">Missing-source queue</h2><p className="mt-1 text-sm text-slate">Transactions without a directly attached source or a source on their property.</p></div><Link className="text-sm font-semibold text-accent" href="/admin/sources">Close queue</Link></div>{missing.length ? <ul className="mt-4 grid gap-2">{missing.map((transaction) => <li className="border-t border-line pt-3 text-sm text-slate" key={transaction.id}><span className="font-semibold text-navy">{propertyMap.get(transaction.property_id)?.property_name ?? "Unknown property"}</span> · {transaction.sale_date} · ${transaction.sale_price.toLocaleString()} <span className="ml-2 text-xs">Transaction ID: {transaction.id}</span></li>)}</ul> : <p className="mt-5 text-sm text-emerald-800">No missing-source warnings.</p>}</section> : null}
    <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_430px]"><section className="panel min-w-0 p-5"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl text-navy">Source library</h2><span className="tag">{sources.length} shown</span></div><div className="mt-4 overflow-x-auto"><table className="admin-table"><thead><tr><th>Source</th><th>Attached to</th><th>Accessed</th><th>Action</th></tr></thead><tbody>{sources.map((source) => { const property = source.property_id ? propertyMap.get(source.property_id) : null; const transaction = source.transaction_id ? transactionMap.get(source.transaction_id) : null; const article = source.article_id ? articleMap.get(source.article_id) : null; return <tr key={source.id}><td className="font-semibold text-navy"><a className="hover:text-accent" href={source.source_url} rel="noreferrer" target="_blank">{source.source_name}</a>{source.is_sample ? <span className="ml-2 tag">Sample</span> : null}<br /><span className="font-normal text-slate">{source.source_type}</span></td><td>{property?.property_name ?? article?.title ?? (transaction ? `${propertyMap.get(transaction.property_id)?.property_name ?? "Transaction"} (${transaction.sale_date})` : "—")}</td><td>{source.accessed_date}</td><td><Link className="font-semibold text-accent" href={`/admin/sources?edit=${source.id}`}>Edit</Link><DeleteForm action={deleteSourceAction} id={source.id} label={source.source_name} /></td></tr>; })}</tbody></table></div>{!sources.length ? <p className="py-8 text-sm text-slate">No sources found.</p> : null}</section>
      <section className="panel p-5"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl text-navy">{edited ? "Edit source" : "Attach source"}</h2>{edited ? <Link className="text-xs font-semibold text-accent" href="/admin/sources">Cancel</Link> : null}</div><form action={saveSourceAction} className="mt-5 grid gap-4">{edited ? <input name="id" type="hidden" value={edited.id} /> : null}
        <label className="admin-field">Source name<input className="admin-input" defaultValue={edited?.source_name} name="source_name" required /></label><label className="admin-field">Source URL<input className="admin-input" defaultValue={edited?.source_url} name="source_url" required type="url" /></label><label className="admin-field">Source type<input className="admin-input" defaultValue={edited?.source_type} name="source_type" placeholder="Public record, news report, filing…" required /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="admin-field">Publication date<input className="admin-input" defaultValue={edited?.publication_date ?? ""} name="publication_date" type="date" /></label><label className="admin-field">Date accessed<input className="admin-input" defaultValue={edited?.accessed_date ?? new Date().toISOString().slice(0, 10)} max={new Date().toISOString().slice(0, 10)} name="accessed_date" required type="date" /></label></div>
        <label className="admin-field">Property (optional)<select className="admin-input" defaultValue={edited?.property_id ?? ""} name="property_id"><option value="">No property link</option>{properties.map((property) => <option key={property.id} value={property.id}>{property.property_name} — {property.street_address}</option>)}</select></label>
        <label className="admin-field">Transaction (optional)<select className="admin-input" defaultValue={edited?.transaction_id ?? ""} name="transaction_id"><option value="">No transaction link</option>{transactions.map((transaction) => <option key={transaction.id} value={transaction.id}>{propertyMap.get(transaction.property_id)?.property_name ?? "Property"} — {transaction.sale_date}</option>)}</select></label>
        <label className="admin-field">Article (optional)<select className="admin-input" defaultValue={edited?.article_id ?? ""} name="article_id"><option value="">No article link</option>{articlesResult.data?.map((article) => <option key={article.id} value={article.id}>{article.title} ({article.status})</option>)}</select></label>
        <label className="admin-field">Notes<textarea className="admin-input min-h-24" defaultValue={edited?.notes ?? ""} name="notes" /></label><label className="flex items-center gap-2 text-sm text-navy"><input defaultChecked={edited?.is_sample ?? false} name="is_sample" type="checkbox" /> Fictional placeholder source</label>
        <button className="button-primary" type="submit">{edited ? "Save changes" : "Attach source"}</button>
      </form></section></div>
  </>;
}
