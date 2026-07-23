import { formatCompactCurrency } from "@/lib/sample-data";
import type { SummaryMetrics } from "@/lib/types";

export function MetricGrid({ summary }: { summary: SummaryMetrics }) {
  const metrics = [
    [summary.properties, "Properties tracked"],
    [summary.transactions, "Transactions analyzed"],
    [formatCompactCurrency(summary.totalValue), "Transaction value"],
    [summary.markets, "Markets covered"],
    [summary.reports, "Published reports"],
  ];
  return <div className="grid border border-line bg-white shadow-[0_22px_60px_rgba(11,34,57,0.1)] sm:grid-cols-2 lg:grid-cols-5">{metrics.map(([value, label], index) => <div className="relative min-h-36 border-b border-line px-5 py-6 last:border-b-0 sm:border-r lg:border-b-0 lg:last:border-r-0" key={label}><span className="absolute right-4 top-4 text-[9px] font-bold tabular-nums tracking-wider text-line">0{index + 1}</span><p className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em] text-navy">{value}</p><p className="mt-3 max-w-32 text-[10px] font-bold uppercase leading-4 tracking-[0.12em] text-slate">{label}</p></div>)}</div>;
}
