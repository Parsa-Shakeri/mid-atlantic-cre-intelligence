import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardTables } from "@/components/dashboard/dashboard-tables";
import { getDashboardData } from "@/lib/data/dashboard";
import { parseDashboardFilters } from "@/lib/dashboard-utils";

export const metadata: Metadata = { title: "Market Dashboard", description: "Filter and compare commercial real estate transaction activity, sales volume, pricing, and reported cap rates across the Mid-Atlantic region.", alternates: { canonical: "/dashboard" } };
type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function DashboardPage({ searchParams }: PageProps) {
  const filters = parseDashboardFilters(await searchParams);
  const data = await getDashboardData(filters);
  const invalidDateRange = Boolean(filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo);
  return <><PageHero eyebrow="Database-powered analysis" title="Market Dashboard" description="Explore transaction activity, sales volume, pricing, and reported cap rates within a clearly defined record sample." disclosure={data.source === "sample" ? "The current dashboard uses fictional development records. Every amount, property, and party is invented." : "Results are aggregated from the public database, and every chart displays its usable sample size."} />
    <Container className="py-10 sm:py-14"><DashboardFilters data={data} />{invalidDateRange ? <div className="mt-4 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="alert">The start date is after the end date. Adjust the date range to display records.</div> : null}<div className="mt-8"><DashboardMetrics metrics={data.metrics} /></div>
      {data.metrics.transactionCount === 0 ? <section className="panel mt-8 px-6 py-16 text-center" role="status"><p className="font-serif text-3xl font-semibold text-navy">No transactions match these filters</p><p className="mt-3 text-sm text-slate">No metrics were estimated or substituted. Broaden the date, geography, or property-type selection.</p><Link className="button-secondary mt-7" href="/dashboard">Reset dashboard</Link></section> : <><div className="mt-8"><DashboardCharts data={data} /></div><div className="mt-16"><DashboardTables data={data} /></div></>}
      <section className="mt-16 grid gap-8 border-t-2 border-navy pt-8 lg:grid-cols-[1fr_0.55fr]"><div><p className="eyebrow">Reading the dashboard</p><h2 className="mt-3 font-serif text-3xl font-semibold text-navy">Sample size before precision</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate">Medians exclude missing values and display their usable record count. Reported cap-rate metrics are suppressed below the minimum threshold. Transaction totals reflect only records inside the current filters and should not be interpreted as complete market coverage.</p></div><div className="border-l-2 border-accent pl-6"><p className="text-sm leading-6 text-slate">Calculation definitions, missing-data treatment, and verification criteria are documented in the methodology.</p><Link className="mt-5 inline-block text-[10px] font-bold uppercase tracking-[0.13em] text-accent" href="/methodology">Review methodology →</Link></div></section>
    </Container>
  </>;
}
