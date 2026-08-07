"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ResearchArticleSummary } from "@/lib/types";
import { formatDate } from "@/lib/sample-data";

export function ResearchCard({ article, index }: { article: ResearchArticleSummary; index: number }) {
  const reduceMotion = useReducedMotion();
  return <motion.article className="research-card" initial={reduceMotion ? false : { opacity: 0, y: 26 }} transition={{ delay: index * 0.08, duration: 0.62, ease: [0.22, 1, 0.36, 1] }} viewport={{ amount: 0.25, once: true }} whileHover={reduceMotion ? undefined : { y: -7 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}><span aria-hidden="true" className="absolute right-5 top-6 font-mono text-sm text-navy/18">{String(index + 1).padStart(2, "0")}</span><div className="relative"><span className="tag">{article.isSample ? "Sample report" : "Research report"}</span><p className="mt-12 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">{article.category}</p><h3 className="mt-4 font-serif text-[1.7rem] font-medium leading-[1.08] tracking-[-0.025em] text-navy"><Link className="underline decoration-transparent underline-offset-4 hover:decoration-accent" href={`/research/${article.slug}`}>{article.title}</Link></h3><p className="mt-5 text-sm leading-7 text-slate">{article.summary}</p></div><div className="relative mt-9 flex items-center justify-between border-t border-line pt-4 text-[10px] font-medium uppercase tracking-[0.08em] text-slate"><span>{formatDate(article.publicationDate)} · {article.readingTime} min</span><Link aria-label={`Read ${article.title}`} className="inline-flex items-center gap-1.5 text-accent" href={`/research/${article.slug}`}>Read <ArrowUpRight aria-hidden="true" className="size-3.5" /></Link></div></motion.article>;
}
