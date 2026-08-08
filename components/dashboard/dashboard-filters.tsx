import Link from "next/link";
import { Download, X } from "lucide-react";
import { buildDashboardFilterRemovalHref } from "@/lib/dashboard-utils";
import { formatDate } from "@/lib/sample-data";
import type { DashboardData, DashboardFilters } from "@/lib/types";

function SelectField({ label, name, value, options }: { label: string; name: string; value: string; options: string[] }) {
  return <label className="filter-label">{label}<select className="filter-input" name={name} defaultValue={value}><option value="">All</option>{options.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>;
}

export function DashboardFilters({ data, currentParams }: { data: DashboardData; currentParams: URLSearchParams }) {
  const activeFilters = [
    data.filters.dateFrom ? { key: "dateFrom" as const, label: `From ${formatDate(data.filters.dateFrom)}` } : null,
    data.filters.dateTo ? { key: "dateTo" as const, label: `Through ${formatDate(data.filters.dateTo)}` } : null,
    data.filters.state ? { key: "state" as const, label: `State: ${data.filters.state}` } : null,
    data.filters.county ? { key: "county" as const, label: `County: ${data.filters.county}` } : null,
    data.filters.city ? { key: "city" as const, label: `City: ${data.filters.city}` } : null,
    data.filters.propertyType ? { key: "propertyType" as const, label: `Type: ${data.filters.propertyType}` } : null,
  ].filter((filter): filter is { key: keyof DashboardFilters; label: string } => filter !== null);
  const exportQuery = currentParams.toString();
  const exportHref = exportQuery ? `/dashboard/export?${exportQuery}` : "/dashboard/export";

  return (
    <form action="/dashboard" aria-label="Filter market dashboard" className="panel p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="eyebrow">Define the sample</p><h2 className="mt-2 font-serif text-2xl font-medium text-navy">Filter the market view</h2><p className="mt-2 text-xs text-slate">{activeFilters.length ? `${activeFilters.length} active ${activeFilters.length === 1 ? "filter" : "filters"}` : "All available dashboard records"}</p></div>
        <Link className="button-secondary gap-2" download href={exportHref}><Download aria-hidden="true" className="size-4" /> Export filtered CSV</Link>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-7 xl:items-end">
        <label className="filter-label">From date<input className="filter-input" type="date" name="dateFrom" defaultValue={data.filters.dateFrom} /></label>
        <label className="filter-label">To date<input className="filter-input" type="date" name="dateTo" defaultValue={data.filters.dateTo} /></label>
        <SelectField label="State" name="state" value={data.filters.state} options={data.filterOptions.states} />
        <SelectField label="County" name="county" value={data.filters.county} options={data.filterOptions.counties} />
        <SelectField label="City" name="city" value={data.filters.city} options={data.filterOptions.cities} />
        <SelectField label="Property type" name="propertyType" value={data.filters.propertyType} options={data.filterOptions.propertyTypes} />
        <button className="button-primary sm:col-span-2 xl:col-span-1" type="submit">Update view</button>
      </div>
      {activeFilters.length ? <div className="mt-5 border-t border-line pt-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start"><p className="shrink-0 pt-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-slate">Active filters</p><div className="flex flex-1 flex-wrap gap-2">{activeFilters.map(({ key, label }) => <Link aria-label={`Remove ${label} filter`} className="inline-flex min-h-8 items-center gap-2 border border-line bg-mist/60 px-3 py-1.5 text-[10px] font-semibold text-navy transition-colors hover:border-navy/30 hover:bg-white" href={buildDashboardFilterRemovalHref(currentParams, key)} key={key}>{label}<X aria-hidden="true" className="size-3 text-slate" /></Link>)}</div><Link className="shrink-0 pt-2 text-xs font-semibold text-slate underline decoration-line underline-offset-4 hover:text-navy" href="/dashboard">Reset all</Link></div></div> : null}
    </form>
  );
}
