import Link from "next/link";
import type { DashboardData } from "@/lib/types";

function SelectField({ label, name, value, options }: { label: string; name: string; value: string; options: string[] }) {
  return <label className="filter-label">{label}<select className="filter-input" name={name} defaultValue={value}><option value="">All</option>{options.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>;
}

export function DashboardFilters({ data }: { data: DashboardData }) {
  return <form action="/dashboard" className="panel p-5 sm:p-6" aria-label="Filter market dashboard"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7 lg:items-end"><label className="filter-label">From date<input className="filter-input" type="date" name="dateFrom" defaultValue={data.filters.dateFrom} /></label><label className="filter-label">To date<input className="filter-input" type="date" name="dateTo" defaultValue={data.filters.dateTo} /></label><SelectField label="State" name="state" value={data.filters.state} options={data.filterOptions.states} /><SelectField label="County" name="county" value={data.filters.county} options={data.filterOptions.counties} /><SelectField label="City" name="city" value={data.filters.city} options={data.filterOptions.cities} /><SelectField label="Property type" name="propertyType" value={data.filters.propertyType} options={data.filterOptions.propertyTypes} /><button className="button-primary" type="submit">Update</button></div><div className="mt-5 flex justify-end"><Link className="text-xs font-semibold text-slate underline decoration-line underline-offset-4 hover:text-navy" href="/dashboard">Reset dashboard</Link></div></form>;
}
