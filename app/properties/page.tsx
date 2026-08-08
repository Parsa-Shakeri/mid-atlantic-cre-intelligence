import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PropertyFilters } from "@/components/properties/property-filters";
import { PropertyResults } from "@/components/properties/property-results";
import { PropertyResultsFrame } from "@/components/properties/property-results-frame";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getProperties, getPropertyFilterOptions } from "@/lib/data/properties";
import { buildPageHref, parsePropertyQuery } from "@/lib/property-utils";

export const metadata: Metadata = { title: "Property Database", description: "Search and filter sourced commercial property transaction records across the Mid-Atlantic region.", alternates: { canonical: "/properties" } };
type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function PropertiesPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const query = parsePropertyQuery(rawParams);
  const currentParams = new URLSearchParams();
  Object.entries(rawParams).forEach(([key, value]) => { if (typeof value === "string" && value) currentParams.set(key, value); });

  const [result, filterOptions] = await Promise.all([
    getProperties(query),
    getPropertyFilterOptions(),
  ]);

  if (result.total > 0 && result.records.length === 0 && query.page > 1) {
    redirect(buildPageHref(currentParams, Math.ceil(result.total / result.pageSize)));
  }

  const resultKey = currentParams.toString() || "all-records";
  return (
    <>
      <PageHero eyebrow="Regional transaction research" title="Property Database" description="Search transaction-level property records with visible sourcing, calculation, and verification context." disclosure={result.source === "sample" ? "This development edition uses a clearly labeled fictional dataset. No row represents a real property or transaction." : "Public records may be delayed or incomplete. Review each record's source and verification status."} />
      <Container className="py-10 sm:py-14">
        <PropertyFilters currentParams={currentParams} options={filterOptions} query={query} />
        <div className="mt-9">
          <PropertyResultsFrame resultKey={resultKey}>
            <PropertyResults currentParams={currentParams} query={query} result={result} />
          </PropertyResultsFrame>
        </div>
      </Container>
    </>
  );
}
