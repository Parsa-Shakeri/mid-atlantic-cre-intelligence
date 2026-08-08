"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { formatDate } from "@/lib/sample-data";
import type { ResearchArticleSummary } from "@/lib/types";

export function ArticleCard({ article, compact = false, index = 0 }: { article: ResearchArticleSummary; compact?: boolean; index?: number }) {
  const reduceMotion = useReducedMotion();

  return <motion.article className={`group border-b border-line transition-colors hover:bg-white ${compact ? "px-1 py-6" : "grid gap-5 px-4 py-8 sm:grid-cols-[56px_1fr] sm:px-6 sm:py-10"}`} initial={reduceMotion ? false : { opacity: 0, y: 18 }} transition={{ delay: Math.min(index * 0.055, 0.28), duration: 0.5, ease: [0.22, 1, 0.36, 1] }} viewport={{ amount: 0.16, once: true }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}>
    {compact ? null : <span aria-hidden="true" className="font-mono text-xs text-navy/35">{String(index + 1).padStart(2, "0")}</span>}
    <div>
      <div className="flex flex-wrap items-center gap-3 text-[9px] font-bold uppercase tracking-[0.12em] text-slate"><span className="text-accent">{article.category}</span><span aria-hidden="true">·</span><span>{formatDate(article.publicationDate)}</span><span aria-hidden="true">·</span><span>{article.readingTime} min read</span>{article.isSample ? <span className="tag">Sample</span> : null}</div>
      <h3 className={`${compact ? "mt-3 text-xl" : "mt-5 text-3xl sm:text-[2rem]"} max-w-3xl font-serif font-semibold leading-[1.12] tracking-[-0.025em] text-navy`}><Link className="underline decoration-transparent underline-offset-4 group-hover:decoration-accent" href={`/research/${article.slug}`}>{article.title}</Link></h3>
      {compact ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate">{article.summary}</p> : <><p className="mt-4 max-w-3xl font-serif text-lg leading-7 text-navy">{article.thesis}</p><p className="mt-4 max-w-3xl text-sm leading-7 text-slate">{article.summary}</p><Link aria-label={`Read ${article.title}`} className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-accent" href={`/research/${article.slug}`}>Read report <ArrowUpRight aria-hidden="true" className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link></>}
    </div>
  </motion.article>;
}
