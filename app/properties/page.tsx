import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PropertyFilters } from "@/components/properties/property-filters";
import { PropertyResults } from "@/components/properties/property-results";
import { PropertyResultsFrame } from "@/components/properties/property-results-frame";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { PublicDataUnavailable } from "@/components/ui/public-data-unavailable";
import { getProperties, getPropertyFilterOptions } from "@/lib/data/properties";
import { buildPageHref, parsePropertyQuery } from "@/lib/property-utils";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = { title: "Property Database", description: "Search and filter source-backed commercial property transaction records across the Capital Region.", alternates: { canonical: "/properties" } };
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
  const disclosure = result.source === "sample"
    ? "This development edition uses a clearly labeled fictional dataset. No row represents a real property or transaction."
    : result.source === "unavailable"
      ? "The public data service is temporarily unavailable. No sample records are being substituted."
      : "Public records may be delayed or incomplete. Review each record's source and verification status.";
  const siteUrl = getSiteUrl();
  const datasetStructuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${siteUrl}/properties#dataset`,
    name: "Capital Parcel Commercial Property Transaction Database",
    description: "A source-linked research dataset of selected commercial property transactions across Maryland, Washington, D.C., and Northern Virginia.",
    url: `${siteUrl}/properties`,
    creator: { "@id": `${siteUrl}/#organization` },
    isAccessibleForFree: true,
    keywords: ["commercial real estate", "property transactions", "Maryland", "Washington DC", "Northern Virginia"],
    spatialCoverage: ["Maryland", "Washington, D.C.", "Northern Virginia"],
    variableMeasured: ["Sale price", "Sale date", "Building square footage", "Price per square foot", "Reported cap rate", "Buyer", "Seller", "Verification status"],
    distribution: { "@type": "DataDownload", name: "Filtered market dashboard export", contentUrl: `${siteUrl}/dashboard/export`, encodingFormat: "text/csv" },
  };
  return (
    <>
      {result.source === "supabase" ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetStructuredData).replace(/</g, "\\u003c") }} /> : null}
      <PageHero eyebrow="Regional transaction research" title="Property Database" description="Search transaction-level property records with visible sourcing, calculation, and verification context." disclosure={disclosure} />
      <Container className="py-10 sm:py-14">
        {result.source === "unavailable" ? <PublicDataUnavailable /> : <>
          <PropertyFilters currentParams={currentParams} options={filterOptions} query={query} />
          <div className="mt-9">
            <PropertyResultsFrame resultKey={resultKey}>
              <PropertyResults currentParams={currentParams} query={query} result={result} />
            </PropertyResultsFrame>
          </div>
        </>}
      </Container>
    </>
  );
}
