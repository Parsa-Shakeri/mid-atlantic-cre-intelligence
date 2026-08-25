import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics";
import { DashboardResultsFrame } from "@/components/dashboard/dashboard-results-frame";
import { DashboardTables } from "@/components/dashboard/dashboard-tables";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { PublicDataUnavailable } from "@/components/ui/public-data-unavailable";
import { getDashboardData } from "@/lib/data/dashboard";
import { parseDashboardFilters } from "@/lib/dashboard-utils";

export const metadata: Metadata = { title: "Market Dashboard", description: "Filter and compare commercial real estate transaction activity, sales volume, pricing, and reported cap rates across the Mid-Atlantic region.", alternates: { canonical: "/dashboard" } };
type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function DashboardPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const filters = parseDashboardFilters(rawParams);
  const currentParams = new URLSearchParams();
  Object.entries(rawParams).forEach(([key, value]) => { if (typeof value === "string" && value) currentParams.set(key, value); });
  const data = await getDashboardData(filters);
  const invalidDateRange = Boolean(filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo);
  const resultKey = currentParams.toString() || "all-dashboard-records";
  const disclosure = data.source === "sample"
    ? "The current dashboard uses fictional development records. Every amount, property, and party is invented."
    : data.source === "unavailable"
      ? "The public data service is temporarily unavailable. No sample metrics are being substituted."
      : "Results are aggregated from the public database, and every chart displays its usable sample size.";

  return (
    <>
      <PageHero eyebrow="Database-powered analysis" title="Market Dashboard" description="Explore transaction activity, sales volume, pricing, and reported cap rates within a clearly defined record sample." disclosure={disclosure} />
      <Container className="py-10 sm:py-14">
        {data.source === "unavailable" ? <PublicDataUnavailable /> : <>
        <DashboardFilters currentParams={currentParams} data={data} />
        {invalidDateRange ? <div className="mt-4 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="alert">The start date is after the end date. Adjust the date range to display records.</div> : null}
        <DashboardResultsFrame resultKey={resultKey}>
          <div className="mt-9"><DashboardMetrics metrics={data.metrics} /></div>
          {data.metrics.transactionCount === 0 ? <section className="panel mt-8 px-6 py-16 text-center" role="status"><SearchX aria-hidden="true" className="mx-auto size-7 text-accent" strokeWidth={1.5} /><p className="mt-5 font-serif text-3xl font-medium text-navy">No transactions match these filters.</p><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate">No metrics were estimated or substituted. Broaden the date, geography, or property-type selection.</p><Link className="button-secondary mt-7" href="/dashboard">Reset dashboard</Link></section> : <><div className="mt-12"><DashboardCharts data={data} /></div><div className="mt-16"><DashboardTables data={data} /></div></>}
        </DashboardResultsFrame>
        <section className="mt-16 grid gap-8 border-t-2 border-navy pt-8 lg:grid-cols-[1fr_0.55fr]"><div><p className="eyebrow">Reading the dashboard</p><h2 className="mt-3 font-serif text-3xl font-medium text-navy">Sample size before precision</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate">Medians exclude missing values and display their usable record count. Reported cap-rate metrics are suppressed below the minimum threshold. Transaction totals reflect only records inside the current filters and should not be interpreted as complete market coverage.</p></div><div className="border-l-2 border-accent pl-6"><p className="text-sm leading-6 text-slate">Calculation definitions, missing-data treatment, and verification criteria are documented in the methodology.</p><div className="mt-5 flex flex-wrap gap-x-5 gap-y-3"><Link className="text-[10px] font-bold uppercase tracking-[0.13em] text-accent" href="/methodology">Review methodology →</Link><Link className="text-[10px] font-bold uppercase tracking-[0.13em] text-accent" href="/coverage">Measure coverage →</Link></div></div></section>
        </>}
      </Container>
    </>
  );
}
