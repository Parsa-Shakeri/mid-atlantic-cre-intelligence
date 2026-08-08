import Link from "next/link";
import { ArrowRight, Database, SearchX } from "lucide-react";
import { VerificationBadge } from "@/components/properties/verification-badge";
import { TableScroll } from "@/components/ui/table-scroll";
import { formatCurrency, formatDate, formatNumber } from "@/lib/sample-data";
import { buildPageHref } from "@/lib/property-utils";
import type { PaginatedProperties, PropertyListItem, PropertyQuery, PropertySort } from "@/lib/types";

function MissingValue() {
  return <span aria-label="Unavailable" className="text-slate/70">—</span>;
}

function PageControl({ disabled, href, children }: { disabled: boolean; href: string; children: string }) {
  return disabled
    ? <span aria-disabled="true" className="button-secondary cursor-not-allowed opacity-40">{children}</span>
    : <Link className="button-secondary" href={href}>{children}</Link>;
}

const sortLabels: Record<PropertySort, string> = {
  sale_date: "Sale date",
  sale_price: "Sale price",
  building_sq_ft: "Building size",
  price_per_sq_ft: "Price per square foot",
  reported_cap_rate: "Reported cap rate",
  date_added: "Date added",
};

function sortDirectionLabel(query: PropertyQuery) {
  const dateSort = query.sort === "sale_date" || query.sort === "date_added";
  if (dateSort) return query.direction === "desc" ? "newest first" : "oldest first";
  return query.direction === "desc" ? "high to low" : "low to high";
}

function PropertyCard({ record }: { record: PropertyListItem }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden border border-line bg-white p-5 shadow-[0_16px_42px_rgba(7,26,44,0.055)] transition-[border-color,box-shadow] hover:border-navy/25 hover:shadow-[0_24px_55px_rgba(7,26,44,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <span className="tag">{record.propertyType}</span>
        <VerificationBadge status={record.verificationStatus} />
      </div>
      <div className="mt-5">
        <Link className="font-serif text-2xl font-medium leading-tight text-navy underline decoration-transparent underline-offset-4 group-hover:decoration-accent" href={`/properties/${record.slug}`}>{record.propertyName}</Link>
        <p className="mt-2 text-xs leading-5 text-slate">{record.streetAddress}<br />{record.city}, {record.state} · {record.county}</p>
      </div>
      <div className="mt-5 border-y border-line py-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-slate">Sale consideration</p>
        <p className="mt-2 font-serif text-3xl font-medium tabular-nums text-navy">{formatCurrency(record.salePrice)}</p>
        <p className="mt-1 font-mono text-[10px] text-slate">Closed {formatDate(record.saleDate)}</p>
      </div>
      <dl className="grid grid-cols-3 gap-3 py-4 text-sm">
        <div><dt className="text-[9px] uppercase tracking-[0.08em] text-slate">Building</dt><dd className="mt-1 font-medium text-navy">{record.buildingSqFt !== null ? `${formatNumber(record.buildingSqFt)} sf` : <MissingValue />}</dd></div>
        <div><dt className="text-[9px] uppercase tracking-[0.08em] text-slate">Price / sf</dt><dd className="mt-1 font-medium text-navy">{record.pricePerSqFt !== null ? formatCurrency(record.pricePerSqFt) : <MissingValue />}</dd></div>
        <div><dt className="text-[9px] uppercase tracking-[0.08em] text-slate">Cap rate</dt><dd className="mt-1 font-medium text-navy">{record.reportedCapRate !== null ? `${(record.reportedCapRate * 100).toFixed(1)}%` : <MissingValue />}</dd></div>
      </dl>
      <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-4">
        {record.isSample ? <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-accent">Fictional sample</span> : <span className="text-[9px] text-slate">{record.dateVerified ? `Verified ${formatDate(record.dateVerified)}` : "Verification date unavailable"}</span>}
        <Link aria-label={`View complete record for ${record.propertyName}`} className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-navy hover:text-accent" href={`/properties/${record.slug}`}>View record <ArrowRight aria-hidden="true" className="size-3.5" /></Link>
      </div>
    </article>
  );
}

export function PropertyResults({ result, currentParams, query }: { result: PaginatedProperties; currentParams: URLSearchParams; query: PropertyQuery }) {
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const start = result.total === 0 ? 0 : (result.page - 1) * result.pageSize + 1;
  const end = Math.min(result.page * result.pageSize, result.total);

  if (result.records.length === 0) {
    return (
      <div className="panel px-6 py-16 text-center" role="status">
        <SearchX aria-hidden="true" className="mx-auto size-7 text-accent" strokeWidth={1.5} />
        <p className="mt-5 font-serif text-3xl font-medium text-navy">No records match these filters.</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate">Try removing a location, price, size, cap-rate, or verification constraint. No replacement records have been inserted.</p>
        <Link className="button-secondary mt-7" href="/properties">Reset all filters</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-5 border-y border-line py-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Database results</p>
          <h2 className="mt-2 font-serif text-3xl font-medium text-navy">{result.total} transaction {result.total === 1 ? "record" : "records"}</h2>
          <p className="mt-2 text-xs text-slate">Showing {start}–{end} · Sorted by {sortLabels[query.sort]}, {sortDirectionLabel(query)}</p>
        </div>
        <div className="flex items-center gap-2 self-start border border-line bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate sm:self-auto"><Database aria-hidden="true" className="size-3.5 text-accent" />{result.source === "sample" ? "Fictional development data" : "Public database records"}</div>
      </div>

      <TableScroll className="hidden border border-line bg-white shadow-[0_20px_55px_rgba(7,26,44,0.06)] lg:block" label="Filtered property transaction records, scroll horizontally if needed">
        <table className="w-full min-w-[1050px] border-collapse text-left">
          <caption className="sr-only">Filtered commercial property transaction records</caption>
          <thead><tr className="border-b border-line bg-mist/60 text-[10px] uppercase tracking-[0.11em] text-slate"><th className="px-4 py-4" scope="col">Property</th><th className="px-4 py-4" scope="col">Market / type</th><th className="px-4 py-4 text-right" scope="col">Sale price</th><th className="px-4 py-4 text-right" scope="col">Building size</th><th className="px-4 py-4 text-right" scope="col">Price / sq. ft.</th><th className="px-4 py-4 text-right" scope="col">Cap rate</th><th className="px-4 py-4 text-right" scope="col">Sale date</th><th className="px-4 py-4" scope="col">Status</th></tr></thead>
          <tbody>{result.records.map((record) => <tr className="group border-b border-line transition-colors last:border-b-0 hover:bg-mist/35" key={record.transactionId}><th className="px-4 py-4" scope="row"><Link className="text-sm font-semibold text-navy underline decoration-transparent underline-offset-4 group-hover:decoration-accent" href={`/properties/${record.slug}`}>{record.propertyName}</Link><span className="mt-1 block text-xs font-normal text-slate">{record.streetAddress}</span>{record.isSample ? <span className="mt-1 block text-[9px] uppercase tracking-wider text-accent">Fictional sample</span> : null}</th><td className="px-4 py-4 text-sm text-slate">{record.city}, {record.state}<span className="mt-1 block text-xs">{record.propertyType}</span></td><td className="px-4 py-4 text-right font-serif text-lg font-medium tabular-nums text-navy">{formatCurrency(record.salePrice)}</td><td className="px-4 py-4 text-right text-sm tabular-nums text-slate">{record.buildingSqFt !== null ? `${formatNumber(record.buildingSqFt)} sf` : <MissingValue />}</td><td className="px-4 py-4 text-right text-sm tabular-nums text-slate">{record.pricePerSqFt !== null ? formatCurrency(record.pricePerSqFt) : <MissingValue />}</td><td className="px-4 py-4 text-right text-sm tabular-nums text-slate">{record.reportedCapRate !== null ? `${(record.reportedCapRate * 100).toFixed(1)}%` : <MissingValue />}</td><td className="px-4 py-4 text-right font-mono text-xs tabular-nums text-slate">{formatDate(record.saleDate)}</td><td className="px-4 py-4"><VerificationBadge status={record.verificationStatus} />{record.dateVerified ? <span className="mt-2 block text-[9px] text-slate">Checked {formatDate(record.dateVerified)}</span> : null}</td></tr>)}</tbody>
        </table>
      </TableScroll>

      <div className="grid gap-5 sm:grid-cols-2 lg:hidden">{result.records.map((record) => <PropertyCard key={record.transactionId} record={record} />)}</div>

      {totalPages > 1 ? <nav aria-label="Property database pagination" className="mt-8 flex items-center justify-between border-t border-line pt-5"><PageControl disabled={result.page <= 1} href={buildPageHref(currentParams, result.page - 1)}>Previous</PageControl><p aria-live="polite" className="text-xs text-slate">Page {result.page} of {totalPages}</p><PageControl disabled={result.page >= totalPages} href={buildPageHref(currentParams, result.page + 1)}>Next</PageControl></nav> : null}
    </div>
  );
}
