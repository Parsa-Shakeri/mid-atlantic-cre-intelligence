import Link from "next/link";
import { X } from "lucide-react";
import { buildPropertyFilterRemovalHref } from "@/lib/property-utils";
import { formatCurrency, formatNumber } from "@/lib/sample-data";
import { PROPERTY_TYPES, US_STATES, VERIFICATION_STATUSES, type PropertyFilterOptions, type PropertyQuery } from "@/lib/types";

function SelectField({ label, name, value, options }: { label: string; name: string; value: string; options: readonly string[] }) {
  return <label className="filter-label">{label}<select className="filter-input" name={name} defaultValue={value}><option value="">All</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function NumberField({ label, name, value, placeholder }: { label: string; name: string; value: number | null; placeholder: string }) {
  return <label className="filter-label">{label}<input className="filter-input" type="number" min="0" step="any" name={name} defaultValue={value ?? ""} placeholder={placeholder} /></label>;
}

export function PropertyFilters({ query, options, currentParams }: { query: PropertyQuery; options: PropertyFilterOptions; currentParams: URLSearchParams }) {
  const activeFilters = [
    query.search ? { key: "search", label: `Search: “${query.search}”` } : null,
    query.state ? { key: "state", label: `State: ${query.state}` } : null,
    query.county ? { key: "county", label: `County: ${query.county}` } : null,
    query.city ? { key: "city", label: `City: ${query.city}` } : null,
    query.propertyType ? { key: "propertyType", label: `Type: ${query.propertyType}` } : null,
    query.saleYear ? { key: "saleYear", label: `Sale year: ${query.saleYear}` } : null,
    query.priceMin !== null ? { key: "priceMin", label: `Price ≥ ${formatCurrency(query.priceMin)}` } : null,
    query.priceMax !== null ? { key: "priceMax", label: `Price ≤ ${formatCurrency(query.priceMax)}` } : null,
    query.sizeMin !== null ? { key: "sizeMin", label: `Size ≥ ${formatNumber(query.sizeMin)} sf` } : null,
    query.sizeMax !== null ? { key: "sizeMax", label: `Size ≤ ${formatNumber(query.sizeMax)} sf` } : null,
    query.capRateMin !== null ? { key: "capRateMin", label: `Cap rate ≥ ${query.capRateMin}%` } : null,
    query.capRateMax !== null ? { key: "capRateMax", label: `Cap rate ≤ ${query.capRateMax}%` } : null,
    query.verificationStatus ? { key: "verificationStatus", label: `Status: ${query.verificationStatus}` } : null,
  ].filter((filter): filter is { key: string; label: string } => filter !== null);
  const advancedFilterCount = activeFilters.filter(({ key }) => !["search", "state", "propertyType"].includes(key)).length;

  return (
    <form action="/properties" aria-label="Filter property transactions" className="panel p-5 sm:p-6">
      <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="eyebrow">Refine the record set</p><h2 className="mt-2 font-serif text-2xl font-medium text-navy">Search and filter transactions</h2></div>
        <p className="text-xs text-slate">{activeFilters.length ? `${activeFilters.length} active ${activeFilters.length === 1 ? "filter" : "filters"}` : "No filters applied"}</p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(260px,2fr)_0.65fr_1fr_1fr_0.9fr_auto] xl:items-end">
        <label className="filter-label sm:col-span-2 xl:col-span-1">Search records<input className="filter-input" type="search" name="search" defaultValue={query.search} placeholder="Property, address, buyer, seller, or tenant" /></label>
        <SelectField label="State" name="state" value={query.state} options={US_STATES} />
        <SelectField label="Property type" name="propertyType" value={query.propertyType} options={PROPERTY_TYPES} />
        <label className="filter-label">Sort by<select className="filter-input" name="sort" defaultValue={query.sort}><option value="sale_date">Sale date</option><option value="sale_price">Sale price</option><option value="building_sq_ft">Building size</option><option value="price_per_sq_ft">Price / sq. ft.</option><option value="reported_cap_rate">Cap rate</option><option value="date_added">Date added</option></select></label>
        <label className="filter-label">Order<select className="filter-input" name="direction" defaultValue={query.direction}><option value="desc">Descending / newest</option><option value="asc">Ascending / oldest</option></select></label>
        <button className="button-primary sm:col-span-2 xl:col-span-1" type="submit">Apply filters</button>
      </div>
      <details className="mt-5 border-t border-line pt-4" open={advancedFilterCount > 0}>
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.1em] text-navy">Advanced filters {advancedFilterCount ? <span className="ml-2 inline-flex min-w-5 justify-center bg-navy px-1.5 py-0.5 text-[9px] text-white">{advancedFilterCount}</span> : null}</summary>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField label="County" name="county" value={query.county} options={options.counties} />
          <SelectField label="City" name="city" value={query.city} options={options.cities} />
          <SelectField label="Sale year" name="saleYear" value={query.saleYear} options={options.saleYears} />
          <SelectField label="Verification" name="verificationStatus" value={query.verificationStatus} options={VERIFICATION_STATUSES} />
          <NumberField label="Minimum sale price" name="priceMin" value={query.priceMin} placeholder="0" />
          <NumberField label="Maximum sale price" name="priceMax" value={query.priceMax} placeholder="No maximum" />
          <NumberField label="Minimum size (sq. ft.)" name="sizeMin" value={query.sizeMin} placeholder="0" />
          <NumberField label="Maximum size (sq. ft.)" name="sizeMax" value={query.sizeMax} placeholder="No maximum" />
          <NumberField label="Minimum cap rate (%)" name="capRateMin" value={query.capRateMin} placeholder="0" />
          <NumberField label="Maximum cap rate (%)" name="capRateMax" value={query.capRateMax} placeholder="30" />
        </div>
      </details>
      {activeFilters.length ? <div className="mt-5 border-t border-line pt-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start"><p className="shrink-0 pt-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-slate">Active filters</p><div className="flex flex-1 flex-wrap gap-2">{activeFilters.map(({ key, label }) => <Link aria-label={`Remove ${label} filter`} className="inline-flex min-h-8 items-center gap-2 border border-line bg-mist/60 px-3 py-1.5 text-[10px] font-semibold text-navy transition-colors hover:border-navy/30 hover:bg-white" href={buildPropertyFilterRemovalHref(currentParams, key)} key={key}>{label}<X aria-hidden="true" className="size-3 text-slate" /></Link>)}</div><Link className="shrink-0 pt-2 text-xs font-semibold text-slate underline decoration-line underline-offset-4 hover:text-navy" href="/properties">Clear all</Link></div></div> : null}
    </form>
  );
}
