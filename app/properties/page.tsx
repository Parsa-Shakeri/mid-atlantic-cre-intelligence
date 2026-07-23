import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { PropertyFilters } from "@/components/properties/property-filters";
import { PropertyResults } from "@/components/properties/property-results";
import { getProperties } from "@/lib/data/properties";
import { parsePropertyQuery } from "@/lib/property-utils";

export const metadata: Metadata = { title: "Property Database", description: "Search and filter sourced commercial property transaction records across the Mid-Atlantic region.", alternates: { canonical: "/properties" } };
type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function PropertiesPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const query = parsePropertyQuery(rawParams);
  const result = await getProperties(query);
  const currentParams = new URLSearchParams();
  Object.entries(rawParams).forEach(([key, value]) => { if (typeof value === "string" && value) currentParams.set(key, value); });
  return <><PageHero eyebrow="Regional transaction research" title="Property Database" description="Search transaction-level property records with visible sourcing, calculation, and verification context." disclosure={result.source === "sample" ? "This development edition uses a clearly labeled fictional dataset. No row represents a real property or transaction." : "Public records may be delayed or incomplete. Review each record's source and verification status."} /><Container className="py-10 sm:py-14"><PropertyFilters query={query} /><div className="mt-9"><PropertyResults currentParams={currentParams} result={result} /></div></Container></>;
}
