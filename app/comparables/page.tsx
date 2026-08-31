import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AlertTriangle, Calculator, FileSearch, Scale } from "lucide-react";
import { ComparableFilters } from "@/components/comparables/comparable-filters";
import { ComparableMetricsGrid } from "@/components/comparables/comparable-metrics";
import { ComparableResults } from "@/components/comparables/comparable-results";
import { ShareComparison } from "@/components/comparables/share-comparison";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { PublicDataUnavailable } from "@/components/ui/public-data-unavailable";
import { buildComparablePageHref, parseComparableQuery } from "@/lib/comparable-utils";
import { getComparableSales } from "@/lib/data/comparables";
import { getPropertyFilterOptions } from "@/lib/data/properties";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = { title: "Comparable Sales Explorer", description: "Build and share a bounded comparable-sales set from source-backed Capital Region commercial property transactions.", alternates: { canonical: "/comparables" } };
type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ComparablesPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const query = parseComparableQuery(rawParams);
  const currentParams = new URLSearchParams();
  Object.entries(rawParams).forEach(([key, value]) => { if (typeof value === "string" && value) currentParams.set(key, value); });
  const [data, filterOptions] = await Promise.all([getComparableSales(query), getPropertyFilterOptions(false)]);
  if (data.total > 0 && !data.records.length && query.page > 1) redirect(buildComparablePageHref(currentParams, Math.ceil(data.total / data.pageSize)));
  const siteUrl = getSiteUrl();
  const structuredData = { "@context": "https://schema.org", "@type": "WebApplication", name: "Capital Parcel Comparable Sales Explorer", url: `${siteUrl}/comparables`, applicationCategory: "BusinessApplication", operatingSystem: "Web", description: metadata.description, offers: { "@type": "Offer", price: 0, priceCurrency: "USD" }, creator: { "@id": `${siteUrl}/#organization` } };
  const disclosure = data.source === "sample" ? "This development edition uses clearly labeled fictional records. No displayed sale represents a real transaction." : data.source === "unavailable" ? "The public data service is temporarily unavailable. No fictional comparison has been substituted." : "Results describe selected recorded sales in this database—not a complete market or a valuation opinion.";
  return <>
    {data.source !== "unavailable" ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /> : null}
    <PageHero eyebrow="Capital Parcel research tool" title="Comparable Sales Explorer" description="Build a transparent comp set from selected commercial property sales, compare recorded pricing, and inspect the linked evidence behind each observation." disclosure={disclosure} />
    <section className="border-b border-line bg-white"><Container className="grid sm:grid-cols-3">{[{ icon: FileSearch, title: "Filter the record", copy: "Narrow by market, type, date, price, and building scale." }, { icon: Calculator, title: "Measure the set", copy: "Review medians and usable-record counts without hidden estimates." }, { icon: Scale, title: "Inspect the evidence", copy: "Open each property record, verification status, and attached sources." }].map(({ icon: Icon, title, copy }) => <article className="flex min-h-28 gap-4 border-b border-line py-6 last:border-b-0 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0" key={title}><Icon aria-hidden="true" className="mt-1 size-5 shrink-0 text-accent" /><div><h2 className="font-serif text-xl font-semibold text-navy">{title}</h2><p className="mt-2 text-xs leading-5 text-slate">{copy}</p></div></article>)}</Container></section>
    <Container className="py-12 sm:py-16 lg:py-20">
      {data.source === "unavailable" ? <PublicDataUnavailable /> : <>
        <ComparableFilters currentParams={currentParams} options={filterOptions} query={query} />
        {data.truncated ? <div className="mt-7 flex gap-4 border border-amber-300 bg-amber-50 p-5 text-amber-950" role="alert"><AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0" /><p className="text-sm leading-6">More than {data.queryLimit} sales match these filters. Pricing aggregates reflect the {data.queryLimit} most recent matching records; the matched-sales count reflects the full query.</p></div> : null}
        <section className="mt-10" aria-labelledby="comparison-summary"><div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Comparison summary</p><h2 className="mt-3 font-serif text-3xl font-semibold text-navy" id="comparison-summary">What the selected record set shows</h2></div><ShareComparison /></div><ComparableMetricsGrid metrics={data.metrics} /><p className="mt-4 max-w-4xl text-xs leading-5 text-slate"><span aria-hidden="true">*</span> Price-per-square-foot statistics may combine values reported in a transaction record with values calculated as sale price ÷ stored building area. Each result identifies its basis when it can be confirmed.</p></section>
        <section className="mt-12" aria-labelledby="comparison-records"><div className="mb-6 border-b-2 border-navy pb-5"><p className="eyebrow">Underlying observations</p><h2 className="mt-3 font-serif text-3xl font-semibold text-navy" id="comparison-records">Comparable sale records</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-slate">Results are ordered by proximity to the target building size when supplied, then by sale date. Similar size does not establish economic comparability.</p></div><ComparableResults currentParams={currentParams} data={data} /></section>
        <aside className="mt-12 border border-line bg-mist/55 p-6 sm:p-8"><p className="eyebrow">Use with judgment</p><p className="mt-4 max-w-4xl text-sm leading-7 text-slate">This explorer organizes selected public transaction evidence. It does not adjust for tenancy, income, condition, financing, renovation, land value, or submarket differences; it does not estimate value; and it is not investment or appraisal advice. Review every underlying record before drawing a conclusion.</p></aside>
      </>}
    </Container>
  </>;
}
