import Link from "next/link";
import type { ResearchArticleSummary } from "@/lib/types";
import { formatDate } from "@/lib/sample-data";

export function ResearchCard({ article, index }: { article: ResearchArticleSummary; index: number }) {
  return <article className="research-card"><span aria-hidden="true" className="absolute right-5 top-6 font-serif text-5xl font-semibold text-mist">{String(index + 1).padStart(2, "0")}</span><div className="relative"><span className="tag">{article.isSample ? "Sample report" : "Research report"}</span><p className="mt-12 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">{article.category}</p><h3 className="mt-4 font-serif text-2xl font-semibold leading-[1.18] tracking-[-0.02em] text-navy"><Link className="underline decoration-transparent underline-offset-4 hover:decoration-accent" href={`/research/${article.slug}`}>{article.title}</Link></h3><p className="mt-5 text-sm leading-7 text-slate">{article.summary}</p></div><div className="relative mt-9 flex items-center justify-between border-t border-line pt-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate"><span>{formatDate(article.publicationDate)} · {article.readingTime} min</span><Link aria-label={`Read ${article.title}`} className="text-accent" href={`/research/${article.slug}`}>Read →</Link></div></article>;
}
