"use client";

import { motion, useReducedMotion } from "motion/react";
import { formatCompactCurrency } from "@/lib/sample-data";
import type { SummaryMetrics } from "@/lib/types";

export function MetricGrid({ summary }: { summary: SummaryMetrics }) {
  const reduceMotion = useReducedMotion();
  const metrics = [
    [summary.properties, "Properties tracked"],
    [summary.transactions, "Transactions analyzed"],
    [formatCompactCurrency(summary.totalValue), "Transaction value"],
    [summary.markets, "Markets covered"],
    [summary.reports, "Published reports"],
  ];
  return <motion.div className="metric-shell" initial={reduceMotion ? false : "hidden"} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }} viewport={{ amount: 0.35, once: true }} whileInView={reduceMotion ? undefined : "visible"}>{metrics.map(([value, label], index) => <motion.div className="metric-cell" key={label} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] }, y: 0 } }}><span aria-hidden="true" className="absolute right-5 top-5 font-mono text-[9px] tracking-wider text-line">0{index + 1}</span><p className="mt-5 font-serif text-5xl font-medium tracking-[-0.05em] text-navy">{value}</p><p className="mt-4 max-w-32 text-[10px] font-semibold uppercase leading-4 tracking-[0.13em] text-slate">{label}</p></motion.div>)}</motion.div>;
}
