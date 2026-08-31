import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarRange, Database, FileCheck2, RefreshCcw } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { PublicDataUnavailable } from "@/components/ui/public-data-unavailable";
import { TableScroll } from "@/components/ui/table-scroll";
import { getCoverageData } from "@/lib/data/coverage";
import { formatDate, formatNumber } from "@/lib/sample-data";
import { getSiteUrl } from "@/lib/site-url";
import type { CoverageBreakdown, CoverageField } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Data Coverage",
  description: "Measured geographic, sector, sourcing, verification, and field-level coverage for the public Capital Parcel database.",
  alternates: { canonical: "/coverage" },
};

const percent = (value: number) => `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)}%`;
const sourceRate = (count: number, total: number) => total ? Math.round((count / total) * 1_000) / 10 : 0;

function BreakdownTable({ rows, title }: { rows: CoverageBreakdown[]; title: string }) {
  return <TableScroll className="mt-7 border border-line bg-white shadow-[0_16px_42px_rgba(7,26,44,0.05)]" label={`${title}, scroll horizontally if needed`}>
    <table className="w-full min-w-[620px] border-collapse text-left">
      <caption className="sr-only">{title}</caption>
      <thead><tr className="bg-mist text-[10px] font-bold uppercase tracking-[0.1em] text-slate"><th className="px-5 py-4" scope="col">Segment</th><th className="px-5 py-4 text-right" scope="col">Properties</th><th className="px-5 py-4 text-right" scope="col">Transactions</th><th className="px-5 py-4 text-right" scope="col">Database share</th></tr></thead>
      <tbody>{rows.map((row) => <tr className="border-t border-line" key={row.label}><th className="px-5 py-4 text-sm font-semibold text-navy" scope="row">{row.label}</th><td className="px-5 py-4 text-right font-mono text-xs text-slate">{formatNumber(row.propertyCount)}</td><td className="px-5 py-4 text-right font-mono text-xs text-slate">{formatNumber(row.transactionCount)}</td><td className="px-5 py-4 text-right text-sm font-semibold text-navy">{percent(row.transactionShare)}</td></tr>)}</tbody>
    </table>
  </TableScroll>;
}

function FieldCard({ field }: { field: CoverageField }) {
  return <article className="panel p-6">
    <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">{field.scope}</p><h3 className="mt-3 font-serif text-2xl font-semibold text-navy">{field.label}</h3></div><span className="font-serif text-3xl font-semibold text-navy">{percent(field.availabilityRate)}</span></div>
    <div aria-label={`${field.label}: ${percent(field.availabilityRate)} available`} className="mt-6 h-2 overflow-hidden bg-mist" role="img"><div className="h-full bg-accent" style={{ width: `${field.availabilityRate}%` }} /></div>
    <div className="mt-4 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-wide text-slate"><span>{formatNumber(field.availableCount)} available</span><span>{percent(field.missingRate)} unavailable</span></div>
  </article>;
}

export default async function CoveragePage() {
  const data = await getCoverageData();
  const siteUrl = getSiteUrl();
  const dateRange = data.earliestSaleDate && data.latestSaleDate ? `${formatDate(data.earliestSaleDate)} – ${formatDate(data.latestSaleDate)}` : "Unavailable";
  const disclosure = data.source === "unavailable"
    ? "The public data service is temporarily unavailable. No sample coverage statistics are being substituted."
    : "Every percentage describes the current public, non-sample database—not the full regional transaction universe.";
  const gaps = data.fields.filter((field) => field.missingCount > 0).toSorted((a, b) => b.missingRate - a.missingRate);
  const structuredData = data.source === "supabase" ? {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${siteUrl}/coverage#dataset`,
    name: "Capital Parcel public database coverage",
    url: `${siteUrl}/coverage`,
    description: metadata.description,
    dateModified: data.latestUpdatedAt ?? undefined,
    spatialCoverage: ["Maryland", "Washington, D.C.", "Northern Virginia"],
    variableMeasured: ["Property records", "Transaction records", "Source support", "Field availability", "Verification status"],
    creator: { "@id": `${siteUrl}/#organization` },
  } : null;

  return <>
    {structuredData ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /> : null}
    <PageHero eyebrow="Database accountability" title="Coverage, measured before conclusions." description="An inspectable scorecard of what the public database contains, where its records are concentrated, and which material fields remain unavailable." disclosure={disclosure} />

    <Container className="py-16 lg:py-24">
      {data.source === "unavailable" ? <PublicDataUnavailable /> : <>
        {data.truncated ? <div className="mb-8 flex gap-4 border border-amber-300 bg-amber-50 p-5 text-amber-950" role="alert"><AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0" /><div><p className="text-sm font-semibold">Coverage scan reached its query ceiling.</p><p className="mt-1 text-sm leading-6">One or more tables reached {formatNumber(data.queryLimit)} public records. Treat these figures as minimum counts until the aggregate query is expanded.</p></div></div> : null}

        <section aria-labelledby="coverage-summary-title">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Current scan</p><h2 className="mt-3 font-serif text-4xl font-semibold text-navy" id="coverage-summary-title">The database, as it stands</h2></div><p className="max-w-md text-xs leading-5 text-slate">Fictional sample records are excluded. Counts refresh from the production database at least hourly.</p></div>
          <dl className="mt-8 grid border border-line bg-white shadow-[0_22px_58px_rgba(7,26,44,0.07)] sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: Database, label: "Public properties", value: formatNumber(data.propertyCount), note: "Non-sample records" },
              { icon: FileCheck2, label: "Public transactions", value: formatNumber(data.transactionCount), note: "Non-sample records" },
              { icon: FileCheck2, label: "Source records", value: formatNumber(data.sourceCount), note: "Public citations" },
              { icon: CalendarRange, label: "Transaction dates", value: dateRange, note: "Earliest to latest" },
              { icon: RefreshCcw, label: "Last record update", value: data.latestUpdatedAt ? formatDate(data.latestUpdatedAt) : "Unavailable", note: "Latest stored change" },
            ].map(({ icon: Icon, label, value, note }) => <div className="min-h-44 border-b border-line p-5 last:border-b-0 sm:border-r lg:border-b-0" key={label}><Icon aria-hidden="true" className="size-5 text-accent" strokeWidth={1.5} /><dt className="mt-7 text-[9px] font-bold uppercase tracking-[0.12em] text-slate">{label}</dt><dd className="mt-3 font-serif text-2xl font-semibold leading-tight text-navy">{value}</dd><dd className="mt-2 font-mono text-[9px] uppercase tracking-wide text-slate">{note}</dd></div>)}
          </dl>
        </section>

        {data.transactionCount === 0 ? <section className="panel mt-12 px-6 py-14 text-center" role="status"><Database aria-hidden="true" className="mx-auto size-7 text-accent" /><h2 className="mt-5 font-serif text-3xl font-semibold text-navy">No public transactions are available yet.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate">The scorecard remains at zero until non-sample records pass the publication workflow.</p></section> : <>
          <section className="mt-20 grid gap-10 lg:grid-cols-2">
            <div className="min-w-0"><p className="eyebrow">Geographic distribution</p><h2 className="mt-3 font-serif text-3xl font-semibold text-navy">Coverage by state</h2><p className="mt-3 max-w-xl text-sm leading-7 text-slate">Database share is the portion of stored transactions in each geography. It is not regional market share.</p><BreakdownTable rows={data.byState} title="Coverage by state" /></div>
            <div className="min-w-0"><p className="eyebrow">Sector distribution</p><h2 className="mt-3 font-serif text-3xl font-semibold text-navy">Coverage by property type</h2><p className="mt-3 max-w-xl text-sm leading-7 text-slate">All controlled property types remain visible, including sectors with no published observations.</p><BreakdownTable rows={data.byPropertyType} title="Coverage by property type" /></div>
          </section>

          <section className="mt-20" aria-labelledby="availability-title">
            <div className="grid gap-6 lg:grid-cols-[0.62fr_1fr] lg:items-end"><div><p className="eyebrow">Field completeness</p><h2 className="mt-3 font-serif text-4xl font-semibold text-navy" id="availability-title">Available does not mean estimated</h2></div><p className="max-w-2xl text-sm leading-7 text-slate">Availability measures whether a value exists in the public record. It does not independently certify the value, and unavailable fields remain unfilled.</p></div>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data.fields.map((field) => <FieldCard field={field} key={field.key} />)}</div>
          </section>

          <section className="mt-20 grid gap-10 bg-navy p-7 text-white sm:p-10 lg:grid-cols-[0.8fr_1.2fr]" aria-labelledby="source-support-title">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-copper">Evidence support</p><h2 className="mt-4 font-serif text-4xl font-semibold" id="source-support-title">Sources and verification</h2><p className="mt-5 max-w-xl text-sm leading-7 text-white/68">Citation counts include distinct sources linked directly to a transaction or its parent property. A source count alone does not determine credibility.</p><Link className="hero-secondary-action mt-7" href="/methodology">Review verification criteria <ArrowRight aria-hidden="true" className="size-4" /></Link></div>
            <div>
              <dl className="grid gap-px bg-white/15 sm:grid-cols-3">
                {[
                  ["At least one source", data.sourceLinkedTransactionCount, sourceRate(data.sourceLinkedTransactionCount, data.transactionCount)],
                  ["Two or more sources", data.multiSourceTransactionCount, sourceRate(data.multiSourceTransactionCount, data.transactionCount)],
                  ["No linked source", data.unsourcedTransactionCount, sourceRate(data.unsourcedTransactionCount, data.transactionCount)],
                ].map(([label, count, share]) => <div className="bg-[#102d48] p-6" key={String(label)}><dt className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/55">{label}</dt><dd className="mt-5 font-serif text-4xl font-semibold">{formatNumber(Number(count))}</dd><dd className="mt-2 font-mono text-[10px] text-copper">{percent(Number(share))} of transactions</dd></div>)}
              </dl>
              <div className="mt-px grid gap-px bg-white/15 sm:grid-cols-2">{data.verificationStatuses.map((item) => <div className="flex items-center justify-between gap-4 bg-[#102d48] px-5 py-4" key={item.status}><div><p className="text-sm font-semibold">{item.status}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-wide text-white/48">{percent(item.share)} of transactions</p></div><span className="font-serif text-2xl font-semibold text-copper">{formatNumber(item.count)}</span></div>)}</div>
            </div>
          </section>

          <section className="mt-20 grid gap-10 border-t-2 border-navy pt-9 lg:grid-cols-[0.62fr_1fr]" aria-labelledby="gaps-title"><div><p className="eyebrow">Known gaps</p><h2 className="mt-3 font-serif text-4xl font-semibold text-navy" id="gaps-title">Where the public record is thinnest</h2><p className="mt-5 max-w-md text-sm leading-7 text-slate">These are internal completeness gaps, not estimates of missing transactions across the region.</p></div><div>{gaps.length ? <ul className="grid gap-4">{gaps.map((gap) => <li className="panel flex items-center justify-between gap-5 p-5" key={gap.key}><div><p className="font-semibold text-navy">{gap.label}</p><p className="mt-1 text-xs text-slate">{formatNumber(gap.missingCount)} of {formatNumber(gap.totalCount)} {gap.scope} unavailable</p></div><span className="font-serif text-2xl font-semibold text-accent">{percent(gap.missingRate)}</span></li>)}</ul> : <p className="panel p-6 text-sm leading-7 text-slate">No missing values were detected in the measured fields.</p>}<div className="mt-6 flex flex-wrap gap-3"><Link className="button-primary gap-2" href="/properties">Inspect records <ArrowRight aria-hidden="true" className="size-4" /></Link><Link className="button-secondary" href="/corrections">Report a discrepancy</Link></div></div></section>
        </>}

        <section className="mt-16 border border-line bg-mist/60 p-6 sm:p-8"><p className="eyebrow">Scope note</p><p className="mt-4 max-w-4xl text-sm leading-7 text-slate">This scorecard measures the contents of Capital Parcel only. It does not compare the database with an authoritative universe of regional transactions and therefore cannot state the percentage of the market captured. Each table is limited to {formatNumber(data.queryLimit)} records; a visible warning appears if that ceiling is reached.</p></section>
      </>}
    </Container>
  </>;
}
