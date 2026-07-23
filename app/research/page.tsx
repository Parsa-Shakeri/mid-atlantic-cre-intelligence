import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { ResearchCard } from "@/components/home/research-card";
import { ArticleCard } from "@/components/research/article-card";
import { getResearchArticles } from "@/lib/data/research";
import { isResearchCategory } from "@/lib/research-data";
import { RESEARCH_CATEGORIES } from "@/lib/types";

export const metadata: Metadata = { title: "Research", description: "Original commercial real estate research, educational explainers, and local market analysis.", alternates: { canonical: "/research" } };
type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ResearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requested = Array.isArray(params.category) ? params.category[0] ?? "" : params.category ?? "";
  const activeCategory = isResearchCategory(requested) ? requested : "";
  const { articles, source } = await getResearchArticles();
  const featured = articles.filter((article) => article.featured).slice(0, 3);
  const filtered = activeCategory ? articles.filter((article) => article.category === activeCategory) : articles;
  return <><PageHero eyebrow="Independent analysis" title="Research" description="Original frameworks, deal analysis, and educational reporting built around transparent sources and visible limits." disclosure={source === "sample" ? "Every development article is a fictional sample and makes no real market or transaction claim." : "Published reports are drawn from the public research database and retain their source records."} />
    {featured.length && !activeCategory ? <section className="border-b border-line bg-[#eeece6] py-16 lg:py-20"><Container><SectionHeading eyebrow="Featured research" title="From the editorial desk" description="Selected reports demonstrate the platform's approach to careful, locally grounded analysis." /><div className="mt-10 grid gap-6 md:grid-cols-3">{featured.map((article, index) => <ResearchCard article={article} index={index} key={article.id} />)}</div></Container></section> : null}
    <Container className="grid gap-12 py-16 lg:grid-cols-[0.34fr_1fr] lg:py-20"><aside><div className="panel p-5 lg:sticky lg:top-32"><p className="eyebrow">Browse by category</p><nav aria-label="Research categories" className="mt-5 border-t border-line"><Link className={`category-link ${!activeCategory ? "category-link-active" : ""}`} href="/research"><span>All research</span><span>{articles.length}</span></Link>{RESEARCH_CATEGORIES.map((category) => { const count = articles.filter((article) => article.category === category).length; return <Link className={`category-link ${activeCategory === category ? "category-link-active" : ""}`} href={`/research?category=${encodeURIComponent(category)}`} key={category}><span>{category}</span><span>{count}</span></Link>; })}</nav></div></aside>
      <section aria-labelledby="research-list-title"><div className="flex items-end justify-between gap-4 border-b-2 border-navy pb-5"><div><p className="eyebrow">Research library</p><h2 className="mt-3 font-serif text-3xl font-semibold text-navy" id="research-list-title">{activeCategory || "All published reports"}</h2></div><p className="text-[10px] font-bold uppercase tracking-wider text-slate">{filtered.length} {filtered.length === 1 ? "report" : "reports"}</p></div>{filtered.length ? <div>{filtered.map((article) => <ArticleCard article={article} key={article.id} />)}</div> : <div className="panel mt-8 p-10 text-center"><p className="font-serif text-2xl font-semibold text-navy">No reports in this category yet</p><p className="mt-2 text-sm text-slate">The empty category remains visible rather than being filled with placeholder claims.</p></div>}</section>
    </Container>
  </>;
}
