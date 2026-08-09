"use client";

import { motion, useReducedMotion } from "motion/react";
import { formatCount } from "@/lib/count-label";
import type { PropertyListItem } from "@/lib/types";

export function MarketPreview({ records }: { records: PropertyListItem[] }) {
  const reduceMotion = useReducedMotion();
  const labels = [...new Set(records.map((record) => record.propertyType))].slice(0, 5);
  const counts = labels.map((label) => records.filter((record) => record.propertyType === label).length);
  const max = Math.max(...counts, 1);
  const metrics = [
    [String(records.length), "Recent transaction records"],
    [String(new Set(records.map((record) => `${record.city}, ${record.state}`)).size), "Markets represented"],
    [String(records.filter((record) => record.verificationStatus === "Verified").length), "Records marked verified"],
  ];
  return <div className="grid gap-5 lg:grid-cols-[1.45fr_0.75fr]">
    <div className="panel p-6 sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Transaction mix</p><h3 className="mt-3 font-serif text-3xl font-medium text-navy">Activity by property type</h3></div><span className="tag">{formatCount(records.length, "record")}</span></div><div aria-label={`Bar chart of ${records.length} recent transactions by property type`} className="mt-9 grid gap-5" role="img">{labels.map((label, index) => <div className="grid grid-cols-[110px_1fr_28px] items-center gap-3" key={label}><span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate">{label}</span><div className="h-2 overflow-hidden bg-mist"><motion.div className="h-full origin-left bg-navy" initial={reduceMotion ? false : { scaleX: 0 }} style={{ width: `${Math.max((counts[index] / max) * 100, 8)}%` }} transition={{ delay: index * 0.08, duration: 0.72, ease: [0.22, 1, 0.36, 1] }} viewport={{ amount: 0.4, once: true }} whileInView={reduceMotion ? undefined : { scaleX: 1 }} /></div><span className="text-right font-mono text-sm text-navy">{counts[index]}</span></div>)}</div><p className="mt-8 border-t border-line pt-4 text-xs leading-5 text-slate">Counts reflect the same bounded set of recent records displayed above.</p></div>
    <div className="overflow-hidden border border-white/15 bg-[#102d48] text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)]"><div className="border-b border-white/15 px-6 py-5"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d98b68]">Coverage quality</p><h3 className="mt-3 font-serif text-2xl font-semibold">Context before conclusions</h3></div><dl>{metrics.map(([value, label]) => <div className="flex items-end justify-between border-b border-white/10 px-6 py-5 last:border-b-0" key={label}><dt className="max-w-36 text-xs leading-5 text-[#b9c5ce]">{label}</dt><dd className="font-serif text-3xl font-semibold">{value}</dd></div>)}</dl></div>
  </div>;
}
