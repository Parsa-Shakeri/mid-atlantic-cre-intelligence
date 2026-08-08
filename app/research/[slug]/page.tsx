import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2, ExternalLink, FileText, ShieldAlert } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/research/article-card";
import { ArticleExhibit } from "@/components/research/article-exhibit";
import { ArticleMobileContents, PrintArticleButton, type ArticleSectionLink } from "@/components/research/article-tools";
import { Container } from "@/components/ui/container";
import { getResearchArticleBySlug } from "@/lib/data/research";
import { getMarkdownSectionId, parseMarkdownSections } from "@/lib/markdown";
import { sampleResearchArticles } from "@/lib/research-data";
import { formatDate } from "@/lib/sample-data";
import { getSiteUrl } from "@/lib/site-url";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return sampleResearchArticles.map((article) => ({ slug: article.slug }));
}

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

  const sections = parseMarkdownSections(article.body).map((section, index) => ({ ...section, id: getMarkdownSectionId(section.heading, index) }));
  const sectionLinks: ArticleSectionLink[] = [
    { id: "executive-summary", label: "Executive summary" },
    ...sections.map((section) => ({ id: section.id, label: section.heading })),
    ...(article.exhibit ? [{ id: "research-exhibit", label: "Research exhibit" }] : []),
    { id: "limitations", label: "Limitations" },
    { id: "sources", label: "Sources" },
  ];
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

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <article className="research-report">
      <header className="detail-hero">
        <Container className="relative z-10 py-12 sm:py-16 lg:py-20">
          <Link className="back-link-dark print-hidden" href="/research"><span aria-hidden="true">←</span> Back to research</Link>
          <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_270px] lg:items-end">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">{article.isSample ? <span className="tag border-white/20 bg-white/10 text-[#efb091]">Fictional sample report</span> : <span className="tag border-white/20 bg-white/10 text-white/75">Published research</span>}<span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d98b68]">{article.category}</span></div>
              <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-[4.35rem]">{article.title}</h1>
              <p className="mt-7 max-w-3xl font-serif text-xl leading-8 text-white/78 sm:text-2xl sm:leading-9">{article.thesis}</p>
            </div>
            <dl className="detail-hero-card grid grid-cols-2 gap-x-5 gap-y-6 text-sm lg:grid-cols-1">
              <div><dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/68">Research desk</dt><dd className="mt-1.5 font-semibold text-white">{article.author}</dd></div>
              <div><dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/68">Published</dt><dd className="mt-1.5 font-semibold text-white">{formatDate(article.publicationDate)}</dd></div>
              <div><dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/68">Reading time</dt><dd className="mt-1.5 font-semibold text-white">{article.readingTime} minutes</dd></div>
              <div><dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/68">Source record</dt><dd className="mt-1.5 font-semibold text-white">{article.sources.length} {article.sources.length === 1 ? "citation" : "citations"}</dd></div>
            </dl>
          </div>
        </Container>
      </header>

      <ArticleMobileContents sections={sectionLinks} />

      <Container className="grid items-start gap-14 py-14 lg:grid-cols-[minmax(0,780px)_270px] lg:justify-between lg:py-20">
        <div className="min-w-0">
          <section className="scroll-mt-44 border-y border-line bg-white p-6 shadow-[0_12px_34px_rgba(11,34,57,0.045)] sm:p-9" aria-labelledby="executive-summary" id="executive-summary">
            <div className="flex items-center justify-between gap-4"><p className="section-rule">Executive summary</p><FileText aria-hidden="true" className="size-5 text-accent" /></div>
            <h2 className="sr-only">Executive summary</h2>
            <ol className="mt-7 grid gap-5">{article.executiveSummary.map((point, index) => <li className="grid grid-cols-[34px_1fr] gap-4 font-serif text-lg leading-8 text-navy sm:text-xl" key={point}><span aria-hidden="true" className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span><span>{point}</span></li>)}</ol>
          </section>

          <div className="mt-16 grid gap-16">{sections.map((section, sectionIndex) => <section className="article-copy" id={section.id} key={section.id}><p aria-hidden="true" className="article-section-number">Analysis {String(sectionIndex + 1).padStart(2, "0")}</p><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div>

          {article.exhibit ? <section className="mt-16 scroll-mt-44" id="research-exhibit"><ArticleExhibit exhibit={article.exhibit} /></section> : null}

          <section className="mt-16 scroll-mt-44 border border-line bg-[#eee9e1] p-6 sm:p-8" id="limitations">
            <div className="flex items-start gap-4"><ShieldAlert aria-hidden="true" className="mt-1 size-5 shrink-0 text-accent" /><div><p className="eyebrow">Limitations</p><h2 className="mt-3 font-serif text-3xl font-semibold text-navy">What this analysis does not establish</h2></div></div>
            <ul className="mt-7 grid gap-4 sm:pl-9">{article.limitations.map((limitation) => <li className="grid grid-cols-[8px_1fr] gap-3 text-sm leading-6 text-slate" key={limitation}><span aria-hidden="true" className="mt-2 size-1.5 bg-accent" /><span>{limitation}</span></li>)}</ul>
          </section>

          <section className="mt-16 scroll-mt-44 border-t-2 border-navy pt-8" id="sources">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Sources</p><h2 className="mt-3 font-serif text-3xl font-semibold text-navy">Research record</h2></div><span className="tag self-start sm:self-auto">{article.sources.length} {article.sources.length === 1 ? "source" : "sources"}</span></div>
            {article.sources.length ? <ol className="mt-7 grid gap-4">{article.sources.map((source, index) => <li className="panel grid gap-4 p-5 sm:grid-cols-[36px_1fr_auto] sm:items-start" key={source.id}><span aria-hidden="true" className="font-mono text-xs text-accent">[{String(index + 1).padStart(2, "0")}]</span><div><h3 className="font-semibold text-navy">{source.sourceName}</h3><p className="mt-1.5 text-xs leading-5 text-slate">{source.sourceType}{source.publicationDate ? ` · Published ${formatDate(source.publicationDate)}` : ""} · Accessed {formatDate(source.accessedDate)}</p>{source.notes ? <p className="mt-3 text-sm leading-6 text-slate">{source.notes}</p> : null}</div>{source.isSample ? <span className="tag text-accent">Placeholder citation</span> : <a aria-label={`Open source: ${source.sourceName} (opens in a new tab)`} className="print-hidden inline-flex items-center gap-1.5 text-xs font-semibold text-navy underline decoration-line underline-offset-4" href={source.sourceUrl} rel="noreferrer" target="_blank">Open source <ExternalLink aria-hidden="true" className="size-3.5" /></a>}</li>)}</ol> : <div className="mt-7 border border-accent/30 bg-accent-soft/35 p-5" role="status"><p className="text-sm font-semibold text-navy">No sources are attached.</p><p className="mt-1 text-sm leading-6 text-slate">This report should be treated as incomplete until a source record is added.</p></div>}
          </section>

          {article.relatedProperties.length ? <section className="mt-16 border-t border-line pt-8"><p className="eyebrow">Related properties</p><h2 className="mt-3 font-serif text-3xl font-semibold text-navy">Records referenced by this report</h2><div className="mt-7 grid gap-4 sm:grid-cols-2">{article.relatedProperties.map((property) => <Link className="group panel block p-5 transition-[transform,border-color] hover:-translate-y-1 hover:border-navy/30" href={`/properties/${property.slug}`} key={property.id}><div className="flex items-start justify-between gap-3"><Building2 aria-hidden="true" className="size-5 shrink-0 text-accent" />{property.isSample ? <span className="tag">Sample</span> : null}</div><h3 className="mt-5 font-serif text-xl font-semibold leading-tight text-navy">{property.propertyName}</h3><div className="mt-5 flex items-center justify-between border-t border-line pt-4"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate">{property.city}, {property.state} · {property.propertyType}</p><ArrowUpRight aria-hidden="true" className="size-4 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div></Link>)}</div></section> : null}

          {article.relatedArticles.length ? <section className="mt-16 border-t border-line pt-8"><p className="eyebrow">Continue reading</p><h2 className="mt-3 font-serif text-3xl font-semibold text-navy">Related research</h2><div className="mt-6 grid gap-x-7 sm:grid-cols-2">{article.relatedArticles.map((related, index) => <ArticleCard article={related} compact index={index} key={related.id} />)}</div></section> : null}
        </div>

        <aside className="article-sidebar print-hidden hidden lg:block"><div className="sticky top-32 border-l border-line pl-6"><p className="eyebrow">In this report</p><nav className="mt-5 grid text-sm" aria-label="Article sections">{sectionLinks.map((section, index) => <a className="group flex items-baseline gap-3 border-b border-line py-3 text-slate transition-colors hover:text-navy" href={`#${section.id}`} key={section.id}><span aria-hidden="true" className="font-mono text-[9px] text-accent">{String(index + 1).padStart(2, "0")}</span><span>{section.label}</span></a>)}</nav><div className="mt-7 grid gap-3"><PrintArticleButton className="w-full" /><Link className="inline-flex min-h-11 items-center justify-center gap-2 border border-line px-4 text-xs font-semibold text-navy transition-colors hover:border-navy" href="/methodology">Review methodology <ArrowUpRight aria-hidden="true" className="size-3.5" /></Link></div><div className="mt-7 border-t border-line pt-5"><p className="text-xs leading-5 text-slate">{article.isSample ? "This report is fictional demonstration content. Any exhibit values are explicitly hypothetical." : "Read this report alongside its source record and stated limitations."}</p></div></div></aside>
      </Container>
    </article>
  </>;
}
