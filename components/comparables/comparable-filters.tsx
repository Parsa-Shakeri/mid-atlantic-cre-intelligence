import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { buildComparableRemovalHref } from "@/lib/comparable-utils";
import { formatCurrency, formatNumber } from "@/lib/sample-data";
import { PROPERTY_TYPES, US_STATES, VERIFICATION_STATUSES, type ComparableQuery, type PropertyFilterOptions } from "@/lib/types";

function SelectField({ label, name, value, options }: { label: string; name: string; value: string; options: readonly string[] }) {
  return <label className="filter-label">{label}<select className="filter-input" defaultValue={value} name={name}><option value="">All</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function NumberField({ label, name, value, placeholder }: { label: string; name: string; value: number | null; placeholder: string }) {
  return <label className="filter-label">{label}<input className="filter-input" defaultValue={value ?? ""} min="0" name={name} placeholder={placeholder} step="any" type="number" /></label>;
}

export function ComparableFilters({ query, options, currentParams }: { query: ComparableQuery; options: PropertyFilterOptions; currentParams: URLSearchParams }) {
  type ActiveFilter = { keys: string | string[]; label: string };

  const activeFilters = ([
    query.state ? { keys: "state", label: `State: ${query.state}` } : null,
    query.county ? { keys: "county", label: `County: ${query.county}` } : null,
    query.city ? { keys: "city", label: `City: ${query.city}` } : null,
    query.propertyType ? { keys: "propertyType", label: `Type: ${query.propertyType}` } : null,
    query.dateFrom ? { keys: "dateFrom", label: `From: ${query.dateFrom}` } : null,
    query.dateTo ? { keys: "dateTo", label: `Through: ${query.dateTo}` } : null,
    query.priceMin !== null ? { keys: "priceMin", label: `Min: ${formatCurrency(query.priceMin)}` } : null,
    query.priceMax !== null ? { keys: "priceMax", label: `Max: ${formatCurrency(query.priceMax)}` } : null,
    query.sizeTarget !== null ? { keys: ["sizeTarget", "sizeTolerance"], label: `${formatNumber(query.sizeTarget)} sf ± ${query.sizeTolerance}%` } : null,
    query.verificationStatus ? { keys: "verificationStatus", label: `Status: ${query.verificationStatus}` } : null,
  ] as Array<ActiveFilter | null>).filter((item): item is ActiveFilter => item !== null);

  return <section className="overflow-hidden border border-navy/15 bg-white shadow-[0_24px_65px_rgba(7,26,44,0.08)]" aria-labelledby="comparison-filters-title">
    <div className="flex items-start gap-4 border-b border-line bg-ink px-5 py-5 text-white sm:px-7"><SlidersHorizontal aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-copper" /><div><h2 className="font-serif text-2xl font-semibold" id="comparison-filters-title">Define a comparable set</h2><p className="mt-1.5 max-w-3xl text-xs leading-5 text-white/65">Filter recorded sales by geography, sector, timing, price, building scale, and verification status. The resulting URL is shareable.</p></div></div>
    <form action="/comparables" className="p-5 sm:p-7" method="get">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <SelectField label="State" name="state" options={US_STATES} value={query.state} />
        <SelectField label="County" name="county" options={options.counties} value={query.county} />
        <SelectField label="City" name="city" options={options.cities} value={query.city} />
        <SelectField label="Property type" name="propertyType" options={PROPERTY_TYPES} value={query.propertyType} />
        <label className="filter-label">Sale date from<input className="filter-input" defaultValue={query.dateFrom} name="dateFrom" type="date" /></label>
        <label className="filter-label">Sale date through<input className="filter-input" defaultValue={query.dateTo} name="dateTo" type="date" /></label>
        <NumberField label="Minimum sale price" name="priceMin" placeholder="10000000" value={query.priceMin} />
        <NumberField label="Maximum sale price" name="priceMax" placeholder="100000000" value={query.priceMax} />
        <NumberField label="Target building size" name="sizeTarget" placeholder="100000" value={query.sizeTarget} />
        <label className="filter-label">Building-size range<select className="filter-input" defaultValue={String(query.sizeTolerance)} name="sizeTolerance"><option value="10">± 10%</option><option value="25">± 25%</option><option value="50">± 50%</option><option value="100">± 100%</option></select></label>
        <SelectField label="Verification status" name="verificationStatus" options={VERIFICATION_STATUSES} value={query.verificationStatus} />
        <div className="flex items-end"><button className="button-primary w-full" type="submit">Find comparable sales</button></div>
      </div>
      <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-2xl text-xs leading-5 text-slate">Building-size filtering uses the selected percentage around the target area. It does not adjust for age, tenancy, condition, income, or location quality.</p><Link className="shrink-0 text-xs font-semibold text-navy underline decoration-line underline-offset-4" href="/comparables">Reset comparison</Link></div>
    </form>
    {activeFilters.length ? <div className="flex flex-wrap gap-2 border-t border-line bg-mist/45 px-5 py-4 sm:px-7" aria-label="Active comparison filters">{activeFilters.map((filter) => <Link aria-label={`Remove ${filter.label}`} className="tag gap-2 hover:border-navy" href={buildComparableRemovalHref(currentParams, filter.keys)} key={filter.label}>{filter.label}<X aria-hidden="true" className="size-3" /></Link>)}</div> : null}
  </section>;
}
