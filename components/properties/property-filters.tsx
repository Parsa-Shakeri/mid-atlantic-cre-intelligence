import Link from "next/link";
import { PROPERTY_TYPES, US_STATES, VERIFICATION_STATUSES, type PropertyQuery } from "@/lib/types";
import { sampleProperties } from "@/lib/sample-data";

const unique = (values: string[]) => [...new Set(values)].toSorted();
const counties = unique(sampleProperties.map((property) => property.county));
const cities = unique(sampleProperties.map((property) => property.city));

function SelectField({ label, name, value, options }: { label: string; name: string; value: string; options: readonly string[] }) {
  return <label className="filter-label">{label}<select className="filter-input" name={name} defaultValue={value}><option value="">All</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function NumberField({ label, name, value, placeholder }: { label: string; name: string; value: number | null; placeholder: string }) {
  return <label className="filter-label">{label}<input className="filter-input" type="number" min="0" step="any" name={name} defaultValue={value ?? ""} placeholder={placeholder} /></label>;
}

export function PropertyFilters({ query }: { query: PropertyQuery }) {
  return (
    <form action="/properties" className="panel p-5 sm:p-6" aria-label="Filter property transactions">
      <div className="grid gap-4 lg:grid-cols-[2fr_0.7fr_1fr_1fr_auto] lg:items-end">
        <label className="filter-label">Search records<input className="filter-input" type="search" name="search" defaultValue={query.search} placeholder="Property, address, buyer, seller, or tenant" /></label>
        <SelectField label="State" name="state" value={query.state} options={US_STATES} />
        <SelectField label="Property type" name="propertyType" value={query.propertyType} options={PROPERTY_TYPES} />
        <label className="filter-label">Sort by<select className="filter-input" name="sort" defaultValue={query.sort}><option value="sale_date">Sale date</option><option value="sale_price">Sale price</option><option value="building_sq_ft">Building size</option><option value="price_per_sq_ft">Price / sq. ft.</option><option value="reported_cap_rate">Cap rate</option><option value="date_added">Date added</option></select></label>
        <button className="button-primary" type="submit">Apply</button>
      </div>
      <details className="mt-5 border-t border-line pt-4">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.1em] text-navy">Advanced filters</summary>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField label="County" name="county" value={query.county} options={counties} />
          <SelectField label="City" name="city" value={query.city} options={cities} />
          <label className="filter-label">Sale year<select className="filter-input" name="saleYear" defaultValue={query.saleYear}><option value="">All</option>{[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((year) => <option key={year} value={year}>{year}</option>)}</select></label>
          <SelectField label="Verification" name="verificationStatus" value={query.verificationStatus} options={VERIFICATION_STATUSES} />
          <NumberField label="Minimum sale price" name="priceMin" value={query.priceMin} placeholder="0" />
          <NumberField label="Maximum sale price" name="priceMax" value={query.priceMax} placeholder="No maximum" />
          <NumberField label="Minimum size (sq. ft.)" name="sizeMin" value={query.sizeMin} placeholder="0" />
          <NumberField label="Maximum size (sq. ft.)" name="sizeMax" value={query.sizeMax} placeholder="No maximum" />
          <NumberField label="Minimum cap rate (%)" name="capRateMin" value={query.capRateMin} placeholder="0" />
          <NumberField label="Maximum cap rate (%)" name="capRateMax" value={query.capRateMax} placeholder="30" />
          <label className="filter-label">Direction<select className="filter-input" name="direction" defaultValue={query.direction}><option value="desc">High to low / newest</option><option value="asc">Low to high / oldest</option></select></label>
        </div>
      </details>
      <div className="mt-5 flex justify-end"><Link className="text-xs font-semibold text-slate underline decoration-line underline-offset-4 hover:text-navy" href="/properties">Clear all filters</Link></div>
    </form>
  );
}
