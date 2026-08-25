import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Material data, research, methodology, and product updates to Mid-Atlantic CRE Intelligence.",
  alternates: { canonical: "/changelog" },
};

const releases = [
  { date: "August 25, 2026", label: "Data quality", title: "Public database coverage scorecard", changes: ["Published geography and property-type distributions for every controlled segment, including segments with no observations.", "Added field-availability, source-support, and verification-status measures derived from public non-sample records.", "Documented the distinction between database share and market share, plus a visible query-ceiling safeguard."] },
  { date: "August 25, 2026", label: "Governance", title: "Public corrections and reporting workflow", changes: ["Published a public corrections policy with structured channels for evidence reviews and reproducible website bugs.", "Linked property records, research reports, methodology, and the public changelog to the review workflow.", "Documented private security reporting and corrected analytics guidance to match the capabilities of the free hosting plan."] },
  { date: "August 8, 2026", label: "Data quality", title: "Reconciliation and citation audit", changes: ["Reconciled building-area conventions used in derived price-per-square-foot fields.", "Aligned report exhibits with the underlying transaction records and clarified calculation notes.", "Completed a source-publication-date and administrator warning-queue review."] },
  { date: "August 6, 2026", label: "Database", title: "Property completion and geography pass", changes: ["Completed core public property profiles with the best-supported available fields.", "Standardized city, county, and market naming used by filters and comparison tables.", "Retained unavailable states where credible public support could not be established."] },
  { date: "July 31, 2026", label: "Research", title: "Expanded transaction monitor", changes: ["Expanded the regional monitor and connected its exhibits to the current research dataset.", "Added clearer report navigation, print behavior, source lists, and limitations.", "Reviewed related-property links for consistency with the public database."] },
  { date: "July 24, 2026", label: "Release", title: "Public platform and protected editorial workflow", changes: ["Released the searchable property database, research library, and filtered market dashboard.", "Added authenticated editorial tools, role-based database policies, CSV review, and audit history.", "Published accessibility, indexing, deployment, and fictional-sample safeguards."] },
];

export default function ChangelogPage() {
  return <>
    <PageHero eyebrow="Public release record" title="What changed, and why it matters." description="A concise record of material updates to public data, research, methodology, and product behavior." disclosure="Routine formatting changes may be omitted. Data corrections and changes that affect interpretation are documented here." />
    <Container className="py-16 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.34fr_1fr]"><aside><div className="sticky top-32 border-l-2 border-accent pl-5"><p className="eyebrow">Maintenance standard</p><p className="mt-4 text-sm leading-7 text-slate">A credible research product should show that it is maintained, not just launched. These entries prioritize changes that affect evidence, definitions, or reader interpretation.</p><Link className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-navy" href="/methodology">Review methodology <ArrowRight aria-hidden="true" className="size-4" /></Link></div></aside><ol className="grid gap-8">{releases.map((release, index) => <li className="panel overflow-hidden" key={`${release.date}-${release.title}`}><div className="grid border-b border-line bg-mist px-6 py-4 text-[10px] font-bold uppercase tracking-[0.13em] text-slate sm:grid-cols-[90px_1fr_auto] sm:items-center"><span className="font-mono text-accent">{String(index + 1).padStart(2, "0")}</span><time>{release.date}</time><span className="mt-2 sm:mt-0">{release.label}</span></div><article className="p-6 sm:p-8"><h2 className="font-serif text-3xl font-semibold text-navy">{release.title}</h2><ul className="mt-6 grid gap-4">{release.changes.map((change) => <li className="grid grid-cols-[18px_1fr] gap-3 text-sm leading-7 text-slate" key={change}><CheckCircle2 aria-hidden="true" className="mt-1.5 size-4 text-accent" /><span>{change}</span></li>)}</ul></article></li>)}</ol></div>
      <section className="mt-16 border-t border-line pt-8 sm:flex sm:items-center sm:justify-between"><div><p className="eyebrow">See the system</p><h2 className="mt-3 font-serif text-3xl font-semibold text-navy">How the product is built and governed.</h2></div><Link className="button-primary mt-6 gap-2 sm:mt-0" href="/project">Open project case study <ArrowRight aria-hidden="true" className="size-4" /></Link></section>
    </Container>
  </>;
}
