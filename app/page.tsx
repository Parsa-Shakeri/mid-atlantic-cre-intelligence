import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { HomeHero } from "@/components/home/home-hero";
import { MarketPreview } from "@/components/home/market-preview";
import { MetricGrid } from "@/components/home/metric-grid";
import { ResearchCard } from "@/components/home/research-card";
import { ScrollStory } from "@/components/home/scroll-story";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TableScroll } from "@/components/ui/table-scroll";
import { PublicDataUnavailable } from "@/components/ui/public-data-unavailable";
import { getRecentTransactions, getSummaryMetrics } from "@/lib/data/properties";
import { getFeaturedResearch } from "@/lib/data/research";
import { formatCurrency, formatDate } from "@/lib/sample-data";

export default async function HomePage() {
  const [summary, recentTransactions, featuredResearch] = await Promise.all([getSummaryMetrics(), getRecentTransactions(5), getFeaturedResearch(3)]);
  const usingSamples = summary.source === "sample";
  const dataUnavailable = summary.source === "unavailable";

  return <>
    <HomeHero dataSource={summary.source} />

    <section aria-labelledby="summary-title" className="relative z-10 bg-paper pb-20 pt-9 lg:pb-28">
      <Container>
        <Reveal className="flex flex-col gap-4 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">{usingSamples ? "Development dataset" : dataUnavailable ? "Data service status" : "Public database"}</p><h2 className="mt-3 font-serif text-3xl font-medium text-navy" id="summary-title">The record, as it stands.</h2></div>
          <p className="max-w-xs text-xs leading-5 text-slate">{dataUnavailable ? "Unavailable figures remain unpublished until the connection is restored." : "Every figure below is derived from stored records—not a marketing counter."}</p>
        </Reveal>
        {dataUnavailable ? <PublicDataUnavailable className="mb-7" /> : null}
        <MetricGrid summary={summary} />
      </Container>
    </section>

    <ScrollStory />

    <section className="border-y border-line bg-[#ebe7df] py-20 lg:py-28">
      <Container>
        <Reveal className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Featured research" title="Analysis with a documented point of view" description={usingSamples ? "Sample editorial content demonstrates the intended institutional research format without making real transaction claims." : "Selected reports connect underlying records with transparent, local analysis."} />
          <Link className="inline-flex items-center gap-2 border-b border-navy pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-navy transition-colors hover:border-accent hover:text-accent" href="/research">View all research <ArrowRight aria-hidden="true" className="size-4" /></Link>
        </Reveal>
        {dataUnavailable ? <PublicDataUnavailable className="mt-12" /> : <div className="mt-12 grid gap-5 md:grid-cols-3">{featuredResearch.map((article, index) => <ResearchCard article={article} index={index} key={article.slug} />)}</div>}
      </Container>
    </section>

    <section className="bg-white py-20 lg:py-28">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <SectionHeading eyebrow="Transaction monitor" title="The underlying records, not just the headline" description={usingSamples ? "Every row is a fictional placeholder created solely to demonstrate the research interface." : "Recent stored transactions with direct paths to verification and source context."} />
          <div className="hidden justify-end lg:flex"><Link className="button-secondary" href="/properties">Open full database <ArrowRight aria-hidden="true" className="ml-2 size-4" /></Link></div>
        </Reveal>
        {dataUnavailable ? <PublicDataUnavailable className="mt-12" /> : <Reveal delay={0.08}>
          <TableScroll className="mt-12 border border-line bg-white shadow-[0_24px_65px_rgba(7,26,44,0.08)]" label="Recent transactions, scroll horizontally if needed">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <caption className="sr-only">Five recent commercial real estate transaction records</caption>
              <thead><tr className="bg-ink text-[9px] font-semibold uppercase tracking-[0.15em] text-white/62"><th className="px-5 py-4" scope="col">Property</th><th className="px-5 py-4" scope="col">Market</th><th className="px-5 py-4" scope="col">Property type</th><th className="px-5 py-4 text-right" scope="col">Sale price</th><th className="px-5 py-4 text-right" scope="col">Sale date</th></tr></thead>
              <tbody>{recentTransactions.map((transaction) => <tr className="group border-b border-line transition-colors last:border-b-0 hover:bg-mist/45" key={transaction.transactionId}><th className="px-5 py-5 text-sm font-semibold text-navy" scope="row"><Link className="underline decoration-transparent underline-offset-4 group-hover:decoration-accent" href={`/properties/${transaction.slug}`}>{transaction.propertyName}</Link>{transaction.isSample ? <span className="mt-1.5 block text-[9px] uppercase tracking-[0.12em] text-accent">Fictional sample</span> : null}</th><td className="px-5 py-5 text-sm text-slate">{transaction.city}, {transaction.state}</td><td className="px-5 py-5 text-sm text-slate">{transaction.propertyType}</td><td className="px-5 py-5 text-right font-serif text-xl font-medium tabular-nums text-navy">{formatCurrency(transaction.salePrice)}</td><td className="px-5 py-5 text-right font-mono text-xs tabular-nums text-slate">{formatDate(transaction.saleDate)}</td></tr>)}</tbody>
            </table>
          </TableScroll>
        </Reveal>}
        <div className="mt-6 lg:hidden"><Link className="button-secondary w-full" href="/properties">Open full database</Link></div>
      </Container>
    </section>

    <section className="market-section py-20 lg:py-28"><Container><Reveal><SectionHeading eyebrow="Market snapshot" title="Patterns become clearer when the sample stays visible" description="A bounded view of the same records shown in the database, with sample size kept alongside each display." tone="dark" /></Reveal>{dataUnavailable ? <PublicDataUnavailable className="mt-12" /> : <Reveal className="mt-12" delay={0.08}><MarketPreview records={recentTransactions} /></Reveal>}</Container></section>

    <section className="border-b border-line bg-paper py-20 lg:py-28">
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal><p className="eyebrow">Research standard</p><h2 className="mt-5 max-w-2xl font-serif text-5xl font-medium leading-[0.98] tracking-[-0.045em] text-navy sm:text-6xl">Credibility starts before the conclusion.</h2><p className="mt-6 max-w-xl text-base leading-7 text-slate">The platform connects transaction records with plain-language analysis while keeping reported, calculated, estimated, and unavailable values visibly distinct.</p><Link className="button-primary mt-8" href="/methodology">Review the methodology <ArrowRight aria-hidden="true" className="ml-2 size-4" /></Link></Reveal>
        <Reveal delay={0.1}><blockquote className="relative overflow-hidden border border-navy/14 bg-white p-8 shadow-[0_28px_72px_rgba(7,26,44,0.09)] sm:p-10"><ShieldCheck aria-hidden="true" className="size-7 text-accent" strokeWidth={1.5} /><p className="relative mt-10 font-serif text-3xl font-medium leading-[1.16] text-navy sm:text-4xl">“Show what is known. Explain what is calculated. Leave unavailable data unavailable.”</p><footer className="mt-8 border-t border-line pt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">Mid-Atlantic CRE Intelligence research principle</footer></blockquote></Reveal>
      </Container>
    </section>
  </>;
}
