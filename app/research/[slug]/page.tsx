import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/research/article-card";
import { ArticleExhibit } from "@/components/research/article-exhibit";
import { Container } from "@/components/ui/container";
import { getResearchArticleBySlug } from "@/lib/data/research";
import { parseMarkdownSections } from "@/lib/markdown";
import { sampleResearchArticles } from "@/lib/research-data";
import { formatDate } from "@/lib/sample-data";
import { getSiteUrl } from "@/lib/site-url";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return sampleResearchArticles.map((article) => ({ slug: article.slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getResearchArticleBySlug(slug);
  if (!article) return { title: "Research article not found", robots: { index: false, follow: false } };
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/research/${article.slug}` },
    robots: article.isSample ? { index: false, follow: false } : undefined,
    openGraph: { type: "article", title: article.title, description: article.summary, url: `/research/${article.slug}`, publishedTime: article.publicationDate, authors: [article.author], section: article.category, images: [{ url: "/og.png", width: 1732, height: 996, alt: "Mid-Atlantic CRE Intelligence" }] },
  };
}

export default async function ResearchArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getResearchArticleBySlug(slug);
  if (!article) notFound();
  const sections = parseMarkdownSections(article.body);
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.publicationDate,
    dateModified: article.updatedAt,
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Organization", name: "Mid-Atlantic CRE Intelligence", url: siteUrl },
    mainEntityOfPage: `${siteUrl}/research/${article.slug}`,
    articleSection: article.category,
    isAccessibleForFree: true,
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <article>
      <header className="detail-hero"><Container className="relative z-10 py-12 sm:py-18"><Link className="back-link-dark" href="/research"><span aria-hidden="true">←</span> Back to research</Link><div className="mt-9 max-w-5xl">{article.isSample ? <span className="tag border-white/20 bg-white/10 text-[#efb091]">Fictional sample report</span> : <span className="tag border-white/20 bg-white/10 text-white/75">Published research</span>}<p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d98b68]">{article.category}</p><h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-white sm:text-6xl">{article.title}</h1><p className="mt-7 max-w-4xl font-serif text-xl leading-8 text-white/78 sm:text-2xl sm:leading-9">{article.thesis}</p><div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/15 pt-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50"><span>By {article.author}</span><span>{formatDate(article.publicationDate)}</span><span>{article.readingTime} minute read</span></div></div></Container></header>

      <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_0.34fr]">
        <div className="min-w-0">
          <section className="border-y border-line bg-white p-6 shadow-[0_12px_34px_rgba(11,34,57,0.045)] sm:p-8" aria-labelledby="executive-summary"><p className="section-rule">Executive summary</p><h2 id="executive-summary" className="sr-only">Executive summary</h2><ul className="mt-6 grid gap-4">{article.executiveSummary.map((point, index) => <li className="grid grid-cols-[30px_1fr] gap-3 font-serif text-lg leading-8 text-navy sm:text-xl" key={point}><span aria-hidden="true" className="text-accent">0{index + 1}</span><span>{point}</span></li>)}</ul></section>

          <div className="mt-14 grid gap-12">{sections.map((section, sectionIndex) => <section className="article-copy" id={`section-${sectionIndex + 1}`} key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div>

          {article.exhibit ? <div className="mt-14"><ArticleExhibit exhibit={article.exhibit} /></div> : null}

          <section className="mt-14 border-t border-line pt-8" id="limitations"><p className="eyebrow">Limitations</p><h2 className="mt-3 text-3xl font-semibold text-navy">What this analysis does not establish</h2><ul className="mt-6 grid gap-3">{article.limitations.map((limitation) => <li className="border-l-2 border-line pl-4 text-sm leading-6 text-slate" key={limitation}>{limitation}</li>)}</ul></section>

          <section className="mt-14 border-t border-line pt-8" id="sources"><div className="flex items-end justify-between"><div><p className="eyebrow">Sources</p><h2 className="mt-3 text-3xl font-semibold text-navy">Research record</h2></div><span className="tag">{article.sources.length} {article.sources.length === 1 ? "source" : "sources"}</span></div>{article.sources.length ? <div className="mt-6 grid gap-4">{article.sources.map((source) => <div className="panel p-5" key={source.id}><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="font-semibold text-navy">{source.sourceName}</h3><p className="mt-1 text-xs text-slate">{source.sourceType}{source.publicationDate ? ` · Published ${formatDate(source.publicationDate)}` : ""} · Accessed {formatDate(source.accessedDate)}</p></div>{source.isSample ? <span className="tag text-accent">Placeholder citation</span> : <a className="text-sm font-semibold text-navy underline decoration-line underline-offset-4" href={source.sourceUrl} rel="noreferrer" target="_blank">Open source</a>}</div>{source.notes ? <p className="mt-4 text-sm leading-6 text-slate">{source.notes}</p> : null}</div>)}</div> : <p className="mt-5 text-sm text-slate">No sources are attached. The report should be treated as incomplete.</p>}</section>

          {article.relatedProperties.length ? <section className="mt-14 border-t border-line pt-8"><p className="eyebrow">Related properties</p><h2 className="mt-3 text-3xl font-semibold text-navy">Records referenced by this framework</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{article.relatedProperties.map((property) => <Link className="panel block p-5 transition-colors hover:bg-mist/50" href={`/properties/${property.slug}`} key={property.id}><div className="flex items-start justify-between gap-3"><span className="text-base font-semibold text-navy">{property.propertyName}</span>{property.isSample ? <span className="tag">Sample</span> : null}</div><p className="mt-3 text-xs text-slate">{property.city}, {property.state} · {property.propertyType}</p></Link>)}</div></section> : null}

          {article.relatedArticles.length ? <section className="mt-14 border-t border-line pt-8"><p className="eyebrow">Continue reading</p><h2 className="mt-3 text-3xl font-semibold text-navy">Related research</h2><div className="mt-6 grid gap-6 sm:grid-cols-2">{article.relatedArticles.map((related) => <ArticleCard article={related} compact key={related.id} />)}</div></section> : null}
        </div>

        <aside><div className="sticky top-28 border-l border-line pl-6"><p className="eyebrow">In this report</p><nav className="mt-5 grid gap-3 text-sm" aria-label="Article sections">{sections.map((section, index) => <a className="text-slate hover:text-navy" href={`#section-${index + 1}`} key={section.heading}>{section.heading}</a>)}<a className="text-slate hover:text-navy" href="#limitations">Limitations</a><a className="text-slate hover:text-navy" href="#sources">Sources</a></nav><div className="mt-8 border-t border-line pt-5"><p className="text-xs leading-5 text-slate">{article.isSample ? "This complete article is fictional demonstration content. Its exhibit contains only hypothetical values." : "Read alongside the source record and stated limitations."}</p><Link className="mt-5 inline-block text-xs font-semibold text-navy underline decoration-line underline-offset-4" href="/methodology">Review methodology</Link></div></div></aside>
      </Container>
    </article>
  </>;
}
