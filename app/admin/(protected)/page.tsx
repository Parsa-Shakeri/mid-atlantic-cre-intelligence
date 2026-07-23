import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { requireAdmin } from "@/lib/admin-auth";

const qualityLinks = [
  ["/admin/sources?quality=missing", "Transactions without a directly or property-attached source"],
  ["/admin/transactions?quality=incomplete", "Transactions marked incomplete"],
  ["/admin/transactions?quality=verification-date", "Verified records missing a verification date"],
] as const;

export default async function AdminOverviewPage() {
  const { client } = await requireAdmin();
  const [properties, transactions, articles, sources, audits] = await Promise.all([
    client.from("properties").select("id", { count: "exact", head: true }),
    client.from("transactions").select("id, property_id, verification_status, date_verified", { count: "exact" }),
    client.from("articles").select("id, status"),
    client.from("sources").select("id, transaction_id, property_id", { count: "exact" }),
    client.from("audit_log").select("id, user_id, table_name, record_id, action, snapshot, changed_at").order("changed_at", { ascending: false }).limit(12),
  ]);
  const transactionRows = transactions.data ?? [];
  const sourceRows = sources.data ?? [];
  const sourcedTransactions = new Set(sourceRows.flatMap((source) => source.transaction_id ? [source.transaction_id] : []));
  const sourcedProperties = new Set(sourceRows.flatMap((source) => source.property_id ? [source.property_id] : []));
  const missingSources = transactionRows.filter((transaction) => !sourcedTransactions.has(transaction.id) && !sourcedProperties.has(transaction.property_id)).length;
  const cards = [
    ["Properties", properties.count ?? 0, "/admin/properties"], ["Transactions", transactions.count ?? 0, "/admin/transactions"],
    ["Published reports", (articles.data ?? []).filter((article) => article.status === "published").length, "/admin/articles"],
    ["Draft reports", (articles.data ?? []).filter((article) => article.status === "draft").length, "/admin/articles"],
    ["Sources", sources.count ?? 0, "/admin/sources"], ["Missing sources", missingSources, "/admin/sources?quality=missing"],
  ] as const;
  const qualityCounts = [missingSources, transactionRows.filter((row) => row.verification_status === "Incomplete").length, transactionRows.filter((row) => ["Verified", "Single Source"].includes(row.verification_status) && !row.date_verified).length];

  return <><AdminPageHeader eyebrow="Administration" title="Editorial overview" description="Manage the research database, publication workflow, and records that need additional verification." action={{ href: "/admin/export", label: "Export records" }} />
    <section aria-label="Record totals" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label, value, href]) => <Link className="panel p-5 transition-colors hover:border-accent" href={href} key={label}><p className="text-xs font-semibold uppercase tracking-wider text-slate">{label}</p><p className="mt-3 font-serif text-3xl text-navy">{value.toLocaleString()}</p></Link>)}</section>
    <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"><section className="panel p-6"><h2 className="font-serif text-2xl text-navy">Data-quality queue</h2><p className="mt-2 text-sm leading-6 text-slate">Warnings identify follow-up work; the system never fills missing values automatically.</p><ul className="mt-5 grid gap-3">{qualityLinks.map(([href, label], index) => <li key={href}><Link className="flex items-center justify-between gap-4 border-t border-line pt-3 text-sm text-navy" href={href}><span>{label}</span><span className="tag">{qualityCounts[index]}</span></Link></li>)}</ul></section>
      <section className="panel min-w-0 p-6"><h2 className="font-serif text-2xl text-navy">Recent edits</h2>{audits.data?.length ? <div className="mt-4 overflow-x-auto"><table className="admin-table"><thead><tr><th>Action</th><th>Record</th><th>When</th></tr></thead><tbody>{audits.data.map((entry) => <tr key={entry.id}><td><span className="tag">{entry.action}</span></td><td>{entry.table_name}<br /><span className="text-xs">{entry.record_id}</span></td><td>{new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.changed_at))}</td></tr>)}</tbody></table></div> : <p className="mt-5 text-sm text-slate">No edits have been recorded yet.</p>}</section></div>
  </>;
}
