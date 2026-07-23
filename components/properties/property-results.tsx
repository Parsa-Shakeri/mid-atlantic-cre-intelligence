import Link from "next/link";
import { VerificationBadge } from "@/components/properties/verification-badge";
import { TableScroll } from "@/components/ui/table-scroll";
import { formatCurrency, formatDate, formatNumber } from "@/lib/sample-data";
import { buildPageHref } from "@/lib/property-utils";
import type { PaginatedProperties } from "@/lib/types";

function MissingValue() { return <span aria-label="Unavailable" className="text-slate/70">—</span>; }

function PageControl({ disabled, href, children }: { disabled: boolean; href: string; children: string }) {
  return disabled
    ? <span aria-disabled="true" className="button-secondary cursor-not-allowed opacity-40">{children}</span>
    : <Link className="button-secondary" href={href}>{children}</Link>;
}

export function PropertyResults({ result, currentParams }: { result: PaginatedProperties; currentParams: URLSearchParams }) {
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const start = result.total === 0 ? 0 : (result.page - 1) * result.pageSize + 1;
  const end = Math.min(result.page * result.pageSize, result.total);
  if (result.records.length === 0) return <div className="panel px-6 py-16 text-center" role="status"><p className="text-xl font-semibold text-navy">No records match these filters</p><p className="mt-3 text-sm text-slate">Try broadening the location, price, size, or verification criteria.</p><Link className="button-secondary mt-6" href="/properties">Reset filters</Link></div>;

  return <div>
    <div className="mb-4 flex flex-col gap-2 text-xs text-slate sm:flex-row sm:items-center sm:justify-between"><p>Showing {start}–{end} of {result.total} transaction records</p><p>{result.source === "sample" ? "Fictional development dataset" : "Supabase public dataset"}</p></div>
    <TableScroll className="hidden border border-line bg-white md:block" label="Filtered property transaction records, scroll horizontally if needed">
      <table className="w-full min-w-[1050px] border-collapse text-left"><caption className="sr-only">Filtered commercial property transaction records</caption><thead><tr className="border-b border-line bg-mist/60 text-[10px] uppercase tracking-[0.11em] text-slate"><th className="px-4 py-4" scope="col">Property</th><th className="px-4 py-4" scope="col">Market / type</th><th className="px-4 py-4 text-right" scope="col">Sale price</th><th className="px-4 py-4 text-right" scope="col">Building size</th><th className="px-4 py-4 text-right" scope="col">Price / sq. ft.</th><th className="px-4 py-4 text-right" scope="col">Cap rate</th><th className="px-4 py-4 text-right" scope="col">Sale date</th><th className="px-4 py-4" scope="col">Status</th></tr></thead>
        <tbody>{result.records.map((record) => <tr className="border-b border-line last:border-b-0" key={record.transactionId}><th className="px-4 py-4" scope="row"><Link className="text-sm font-semibold text-navy underline decoration-transparent underline-offset-4 hover:decoration-line" href={`/properties/${record.slug}`}>{record.propertyName}</Link><span className="mt-1 block text-xs font-normal text-slate">{record.streetAddress}</span>{record.isSample ? <span className="mt-1 block text-[9px] uppercase tracking-wider text-accent">Fictional sample</span> : null}</th><td className="px-4 py-4 text-sm text-slate">{record.city}, {record.state}<span className="mt-1 block text-xs">{record.propertyType}</span></td><td className="px-4 py-4 text-right text-sm tabular-nums text-navy">{formatCurrency(record.salePrice)}</td><td className="px-4 py-4 text-right text-sm tabular-nums text-slate">{record.buildingSqFt ? `${formatNumber(record.buildingSqFt)} sf` : <MissingValue />}</td><td className="px-4 py-4 text-right text-sm tabular-nums text-slate">{record.pricePerSqFt ? formatCurrency(record.pricePerSqFt) : <MissingValue />}</td><td className="px-4 py-4 text-right text-sm tabular-nums text-slate">{record.reportedCapRate ? `${(record.reportedCapRate * 100).toFixed(1)}%` : <MissingValue />}</td><td className="px-4 py-4 text-right text-sm tabular-nums text-slate">{formatDate(record.saleDate)}</td><td className="px-4 py-4"><VerificationBadge status={record.verificationStatus} /></td></tr>)}</tbody>
      </table>
    </TableScroll>
    <div className="grid gap-4 md:hidden">{result.records.map((record) => <article className="panel p-5" key={record.transactionId}><div className="flex items-start justify-between gap-4"><div><Link className="text-base font-semibold text-navy" href={`/properties/${record.slug}`}>{record.propertyName}</Link><p className="mt-1 text-xs text-slate">{record.city}, {record.state} · {record.propertyType}</p></div><VerificationBadge status={record.verificationStatus} /></div><dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm"><div><dt className="text-xs text-slate">Sale price</dt><dd className="mt-1 font-semibold text-navy">{formatCurrency(record.salePrice)}</dd></div><div><dt className="text-xs text-slate">Sale date</dt><dd className="mt-1 text-navy">{formatDate(record.saleDate)}</dd></div><div><dt className="text-xs text-slate">Building size</dt><dd className="mt-1 text-navy">{record.buildingSqFt ? `${formatNumber(record.buildingSqFt)} sf` : <MissingValue />}</dd></div><div><dt className="text-xs text-slate">Price / sq. ft.</dt><dd className="mt-1 text-navy">{record.pricePerSqFt ? formatCurrency(record.pricePerSqFt) : <MissingValue />}</dd></div></dl>{record.isSample ? <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-accent">Fictional sample record</p> : null}</article>)}</div>
    {totalPages > 1 ? <nav aria-label="Property database pagination" className="mt-8 flex items-center justify-between border-t border-line pt-5"><PageControl disabled={result.page <= 1} href={buildPageHref(currentParams, result.page - 1)}>Previous</PageControl><p aria-live="polite" className="text-xs text-slate">Page {result.page} of {totalPages}</p><PageControl disabled={result.page >= totalPages} href={buildPageHref(currentParams, result.page + 1)}>Next</PageControl></nav> : null}
  </div>;
}
