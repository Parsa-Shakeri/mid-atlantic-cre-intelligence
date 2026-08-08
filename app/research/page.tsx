import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Database, ShieldCheck } from "lucide-react";
import { ArticleCard } from "@/components/research/article-card";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { getResearchArticles } from "@/lib/data/research";
import { isResearchCategory } from "@/lib/research-data";
import { formatDate } from "@/lib/sample-data";
import { RESEARCH_CATEGORIES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Research",
  description: "Original commercial real estate research, educational explainers, and local market analysis.",
  alternates: { canonical: "/research" },
};

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ResearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requested = Array.isArray(params.category) ? params.category[0] ?? "" : params.category ?? "";
  const activeCategory = isResearchCategory(requested) ? requested : "";
  const { articles, source } = await getResearchArticles();
  const featured = articles.filter((article) => article.featured).slice(0, 3);
  const leadArticle = featured[0];
  const supportingArticles = featured.slice(1);
  const filtered = activeCategory ? articles.filter((article) => article.category === activeCategory) : articles;
  const categoryCounts = new Map(RESEARCH_CATEGORIES.map((category) => [category, articles.filter((article) => article.category === category).length]));

  return <>
    <PageHero eyebrow="Independent analysis" title="Research" description="Original frameworks, deal analysis, and educational reporting built around transparent sources and visible limits." disclosure={source === "sample" ? "Every development article is a fictional sample and makes no real market or transaction claim." : "Published reports are drawn from the public research database and retain their source records."} />

    <section className="border-b border-line bg-white" aria-label="Research standards">
      <Container className="grid sm:grid-cols-3">
        {[{ icon: BookOpen, label: "Editorial format", value: "Thesis-led reporting" }, { icon: Database, label: "Evidence standard", value: "Linked source records" }, { icon: ShieldCheck, label: "Reader safeguard", value: "Limits stated plainly" }].map(({ icon: Icon, label, value }) => <div className="flex min-h-24 items-center gap-4 border-b border-line px-1 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0" key={label}><Icon aria-hidden="true" className="size-4 shrink-0 text-accent" /><div><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate">{label}</p><p className="mt-1 font-serif text-lg font-semibold text-navy">{value}</p></div></div>)}
      </Container>
    </section>

    {leadArticle && !activeCategory ? <section className="border-b border-line bg-[#e9e5dc] py-16 lg:py-20">
      <Container>
        <SectionHeading eyebrow="Featured research" title="From the editorial desk" description="Selected reports demonstrate the platform's approach to careful, locally grounded analysis." />
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.5fr_0.82fr]">
          <article className="group relative isolate flex min-h-[470px] flex-col justify-between overflow-hidden bg-navy p-7 text-white shadow-[0_28px_70px_rgba(7,26,44,0.18)] sm:p-10">
            <div aria-hidden="true" className="data-grid absolute inset-0 opacity-45" />
            <div aria-hidden="true" className="absolute -right-8 -top-12 font-serif text-[15rem] font-semibold leading-none text-white/[0.035]">01</div>
            <div className="relative max-w-3xl"><div className="flex flex-wrap items-center gap-3 text-[9px] font-bold uppercase tracking-[0.14em] text-white/55"><span className="text-[#e89a76]">Lead report</span><span aria-hidden="true">·</span><span>{leadArticle.category}</span>{leadArticle.isSample ? <span className="border border-white/20 px-2 py-1 text-white/65">Sample</span> : null}</div><h2 className="mt-8 max-w-3xl font-serif text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-6xl"><Link className="underline decoration-transparent underline-offset-8 group-hover:decoration-[#e89a76]" href={`/research/${leadArticle.slug}`}>{leadArticle.title}</Link></h2><p className="mt-7 max-w-2xl font-serif text-xl leading-8 text-white/76">{leadArticle.thesis}</p></div>
            <div className="relative mt-12 flex flex-col gap-5 border-t border-white/15 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/48">{formatDate(leadArticle.publicationDate)} · {leadArticle.readingTime} minute read</p><Link className="inline-flex items-center gap-2 text-xs font-semibold text-white" href={`/research/${leadArticle.slug}`}>Open report <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link></div>
          </article>
          <div className="grid gap-5">
            {supportingArticles.map((article, index) => <article className="group relative flex min-h-[220px] flex-col justify-between border border-line bg-white p-6 shadow-[0_16px_44px_rgba(7,26,44,0.055)] sm:p-7" key={article.id}><span aria-hidden="true" className="absolute right-6 top-6 font-mono text-xs text-navy/22">0{index + 2}</span><div className="pr-8"><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-accent">{article.category}</p><h3 className="mt-5 font-serif text-2xl font-semibold leading-[1.1] tracking-[-0.025em] text-navy"><Link className="underline decoration-transparent underline-offset-4 group-hover:decoration-accent" href={`/research/${article.slug}`}>{article.title}</Link></h3></div><div className="mt-8 flex items-center justify-between border-t border-line pt-4 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate"><span>{article.readingTime} min read</span><ArrowUpRight aria-hidden="true" className="size-4 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div></article>)}
          </div>
        </div>
      </Container>
    </section> : null}

    <Container className="py-16 lg:py-20">
      <details className="panel mb-8 lg:hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 text-xs font-semibold text-navy marker:content-none"><span>Browse by category</span><span className="tag">{activeCategory || "All research"}</span></summary>
        <nav aria-label="Research categories" className="border-t border-line px-5 pb-3"><Link className={`category-link ${!activeCategory ? "category-link-active" : ""}`} href="/research"><span>All research</span><span>{articles.length}</span></Link>{RESEARCH_CATEGORIES.map((category) => <Link className={`category-link ${activeCategory === category ? "category-link-active" : ""}`} href={`/research?category=${encodeURIComponent(category)}`} key={category}><span>{category}</span><span>{categoryCounts.get(category)}</span></Link>)}</nav>
      </details>

      <div className="grid gap-12 lg:grid-cols-[0.32fr_1fr]">
        <aside className="hidden lg:block"><div className="panel sticky top-32 p-5"><p className="eyebrow">Browse by category</p><nav aria-label="Research categories" className="mt-5 border-t border-line"><Link className={`category-link ${!activeCategory ? "category-link-active" : ""}`} href="/research"><span>All research</span><span>{articles.length}</span></Link>{RESEARCH_CATEGORIES.map((category) => <Link className={`category-link ${activeCategory === category ? "category-link-active" : ""}`} href={`/research?category=${encodeURIComponent(category)}`} key={category}><span>{category}</span><span>{categoryCounts.get(category)}</span></Link>)}</nav><div className="mt-6 border-t border-line pt-5"><p className="text-xs leading-5 text-slate">Filters change the publication list only. They do not alter or infer the underlying research record.</p></div></div></aside>

        <section aria-labelledby="research-list-title">
          <div className="flex flex-col gap-5 border-b-2 border-navy pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Research library</p><h2 className="mt-3 font-serif text-3xl font-semibold text-navy sm:text-4xl" id="research-list-title">{activeCategory || "All published reports"}</h2></div><div className="flex items-center gap-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate">{filtered.length} {filtered.length === 1 ? "report" : "reports"}</p>{activeCategory ? <Link className="text-[10px] font-bold uppercase tracking-wider text-accent underline decoration-line underline-offset-4" href="/research">Clear filter</Link> : null}</div></div>
          {filtered.length ? <div>{filtered.map((article, index) => <ArticleCard article={article} index={index} key={article.id} />)}</div> : <div className="panel mt-8 p-10 text-center" role="status"><BookOpen aria-hidden="true" className="mx-auto size-6 text-accent" /><p className="mt-5 font-serif text-2xl font-semibold text-navy">No reports in this category yet</p><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate">The empty category remains visible rather than being filled with placeholder claims. Choose another category to continue browsing.</p><Link className="button-secondary mt-6" href="/research">View all research</Link></div>}
        </section>
      </div>
    </Container>
  </>;
}
