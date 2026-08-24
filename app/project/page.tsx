import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CodeXml, Database, FileCheck2, LineChart, LockKeyhole, SearchCheck, Workflow } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { safePublicUrl } from "@/lib/public-profile";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Project Case Study",
  description: "How Mid-Atlantic CRE Intelligence turns fragmented public evidence into a source-linked research database, dashboard, and publication workflow.",
  alternates: { canonical: "/project" },
};

const workflow = [
  { icon: SearchCheck, step: "01", title: "Collect", copy: "Identify public records, filings, releases, and credible reporting without treating any single source as automatically complete." },
  { icon: FileCheck2, step: "02", title: "Verify", copy: "Attach evidence, distinguish reported and calculated values, and surface missing fields instead of filling gaps with assumptions." },
  { icon: Database, step: "03", title: "Structure", copy: "Normalize properties, transactions, parties, markets, sources, and articles in PostgreSQL with controlled values and validation." },
  { icon: LineChart, step: "04", title: "Publish", copy: "Turn the same bounded records into searchable pages, transparent aggregates, downloadable tables, and thesis-led research." },
];

const decisions = [
  ["Server-first delivery", "Next.js App Router keeps public content indexable and limits client JavaScript to filters, charts, and motion that need browser state."],
  ["Evidence before interface", "Every public record can carry source links, verification status, access dates, and explicit missing-value states."],
  ["Suppression before false precision", "Cap-rate statistics stay hidden below the minimum usable-record threshold, while every exhibit states its record count in plain language."],
  ["Independent administration", "Supabase authentication, Row Level Security, role checks, CSV review, and audit logs separate the public publication from its editing workflow."],
];

const flagshipReportHref = "/research/mid-atlantic-transaction-monitor-sixteen-verified-sales-and-1-33-billion-in-recorded-volume";

export default function ProjectPage() {
  const repositoryUrl = safePublicUrl(process.env.NEXT_PUBLIC_GITHUB_URL);
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${siteUrl}/project#case-study`,
    name: "Mid-Atlantic CRE Intelligence project case study",
    url: `${siteUrl}/project`,
    creator: { "@id": `${siteUrl}/#organization` },
    about: ["Commercial real estate research", "Public-source verification", "Data product development"],
    description: metadata.description,
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <PageHero eyebrow="Product case study" title="From scattered evidence to an auditable research product." description="A full-stack research platform designed, built, and maintained as an independent student project—from database rules and protected editorial tools to public analysis." disclosure="This page documents the product decisions and responsibilities behind the work. It does not claim coverage of every regional transaction." />

    <Container className="py-16 lg:py-24">
      <section aria-labelledby="project-overview" className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <div><p className="eyebrow">The brief</p><h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-navy" id="project-overview">Make public CRE evidence useful without making it look more certain than it is.</h2></div>
        <div className="grid gap-5 text-sm leading-7 text-slate sm:grid-cols-2"><p className="border-t-2 border-navy pt-5">Commercial property evidence is fragmented across deeds, filings, press releases, reporting, and owner disclosures. The product creates a repeatable way to reconcile those materials into readable records.</p><p className="border-t-2 border-accent pt-5">The core constraint is credibility: values must remain traceable, sample content must stay labeled, and unavailable information must never be silently invented.</p></div>
      </section>

      <dl className="mt-14 grid border border-line bg-white shadow-[0_18px_48px_rgba(7,26,44,0.055)] sm:grid-cols-2 lg:grid-cols-4">
        {[["Framework", "Next.js 16 + React 19"], ["Data layer", "Supabase + PostgreSQL"], ["Product scope", "Public and protected workflows"], ["Quality gate", "Lint, types, tests, build"]].map(([label, value]) => <div className="border-b border-line p-5 last:border-b-0 sm:border-r lg:border-b-0" key={label}><dt className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate">{label}</dt><dd className="mt-3 font-serif text-xl font-semibold text-navy">{value}</dd></div>)}
      </dl>

      <section className="mt-24 overflow-hidden border border-line bg-white shadow-[0_24px_65px_rgba(7,26,44,0.08)]" aria-labelledby="flagship-report-title">
        <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
          <div className="bg-navy p-7 text-white sm:p-10 lg:p-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-copper">Flagship publication · July 2026</p>
            <h2 className="mt-6 font-serif text-4xl font-semibold leading-[1.04]" id="flagship-report-title">Sixteen verified sales. One bounded argument.</h2>
            <p className="mt-6 text-sm leading-7 text-white/68">The expanded transaction monitor turns the database into a traceable research conclusion while keeping concentration, missing fields, and sample construction visible.</p>
            <Link className="hero-primary-action mt-8" href={flagshipReportHref}>Read the flagship report <ArrowRight aria-hidden="true" className="size-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-2">
            {[["16", "Verified transaction records"], ["$1.329B", "Recorded consideration"], ["63.2%", "Volume in the five largest sales"], ["16", "Attached source records"]].map(([value, label]) => <div className="border-b border-line p-7 last:border-b-0 sm:border-r sm:p-9" key={label}><p className="font-serif text-4xl font-semibold tracking-[-0.04em] text-navy">{value}</p><p className="mt-4 max-w-40 text-[10px] font-bold uppercase leading-4 tracking-[0.12em] text-slate">{label}</p></div>)}
          </div>
        </div>
        <p className="border-t border-line px-7 py-4 text-[10px] leading-5 text-slate sm:px-10">Figures describe the report&apos;s selective July 31, 2026 database sample and are not a complete measure of regional transaction activity.</p>
      </section>

      <section className="mt-24" aria-labelledby="workflow-title"><p className="eyebrow">Research system</p><h2 className="mt-4 font-serif text-4xl font-semibold text-navy" id="workflow-title">One evidence chain, four public outcomes.</h2><div className="mt-9 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 xl:grid-cols-4">{workflow.map(({ icon: Icon, step, title, copy }) => <article className="min-h-72 bg-white p-7" key={step}><div className="flex items-center justify-between"><span className="font-mono text-xs text-accent">{step}</span><Icon aria-hidden="true" className="size-5 text-navy" strokeWidth={1.6} /></div><h3 className="mt-14 font-serif text-3xl font-semibold text-navy">{title}</h3><p className="mt-5 text-sm leading-7 text-slate">{copy}</p></article>)}</div></section>

      <section className="mt-24 grid gap-10 lg:grid-cols-[0.48fr_1fr]" aria-labelledby="decisions-title"><div><p className="eyebrow">Product decisions</p><h2 className="mt-4 font-serif text-4xl font-semibold text-navy" id="decisions-title">Built around the failure modes of public data.</h2><p className="mt-5 max-w-md text-sm leading-7 text-slate">The most important decisions are not visual effects. They are the rules that prevent a polished interface from overstating the evidence underneath it.</p></div><div className="grid gap-5 sm:grid-cols-2">{decisions.map(([title, copy], index) => <article className="panel p-6" key={title}><span className="font-mono text-[10px] text-accent">0{index + 1}</span><h3 className="mt-6 font-serif text-2xl font-semibold text-navy">{title}</h3><p className="mt-4 text-sm leading-7 text-slate">{copy}</p></article>)}</div></section>

      <section className="relative mt-24 overflow-hidden bg-ink px-7 py-10 text-white sm:px-10 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10 lg:px-14 lg:py-14"><Workflow aria-hidden="true" className="absolute -right-8 -top-12 size-56 text-white/[0.035]" /><div className="relative"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-copper">Inspect the product</p><h2 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-tight">The database, dashboard, reports, and change history are the evidence of execution.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-white/68">Review the methodology alongside the outputs. The project is designed to make its assumptions, limitations, and maintenance history visible.</p></div><div className="relative mt-8 flex flex-wrap gap-3 lg:mt-0"><Link className="hero-primary-action" href={flagshipReportHref}>Read flagship report <ArrowRight aria-hidden="true" className="size-4" /></Link><Link className="hero-secondary-action" href="/properties">Open database</Link><Link className="hero-secondary-action" href="/changelog">View changelog</Link>{repositoryUrl ? <a className="hero-secondary-action" href={repositoryUrl} rel="noreferrer" target="_blank"><CodeXml aria-hidden="true" className="size-4" /> Source code</a> : null}</div></section>

      <section className="mt-16 grid gap-5 sm:grid-cols-3"><Link className="panel group p-6" href="/methodology"><LockKeyhole aria-hidden="true" className="size-5 text-accent" /><h2 className="mt-6 font-serif text-2xl font-semibold text-navy">Methodology</h2><p className="mt-3 text-sm leading-6 text-slate">Definitions, verification criteria, calculations, and limitations.</p><span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-navy">Review standards <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></span></Link><Link className="panel group p-6" href="/dashboard"><LineChart aria-hidden="true" className="size-5 text-accent" /><h2 className="mt-6 font-serif text-2xl font-semibold text-navy">Market dashboard</h2><p className="mt-3 text-sm leading-6 text-slate">Filter stored records and inspect bounded, sample-aware exhibits.</p><span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-navy">Explore data <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></span></Link><Link className="panel group p-6" href="/research"><FileCheck2 aria-hidden="true" className="size-5 text-accent" /><h2 className="mt-6 font-serif text-2xl font-semibold text-navy">Research</h2><p className="mt-3 text-sm leading-6 text-slate">Thesis-led reports with limitations and source records attached.</p><span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-navy">Read reports <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></span></Link></section>
    </Container>
  </>;
}
