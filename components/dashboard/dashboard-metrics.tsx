import { CAP_RATE_MINIMUM_SAMPLE, type DashboardMetrics } from "@/lib/types";
import { formatCount } from "@/lib/count-label";
import { formatCompactCurrency, formatCurrency, formatNumber } from "@/lib/sample-data";

export function DashboardMetrics({ metrics }: { metrics: DashboardMetrics }) {
  const cards = [
    { label: "Transactions", value: formatNumber(metrics.transactionCount), context: "Filtered records", sample: formatCount(metrics.transactionCount, "record") },
    { label: "Total sales volume", value: formatCompactCurrency(metrics.totalSalesVolume), context: "Recorded consideration", sample: formatCount(metrics.transactionCount, "record") },
    { label: "Median sale price", value: metrics.medianSalePrice === null ? "Unavailable" : formatCompactCurrency(metrics.medianSalePrice), context: "Middle recorded sale", sample: formatCount(metrics.transactionCount, "record") },
    { label: "Median price / sq. ft.", value: metrics.medianPricePerSqFt === null ? "Unavailable" : formatCurrency(metrics.medianPricePerSqFt), context: "Usable size and price", sample: formatCount(metrics.pricePerSqFtSampleSize, "usable record") },
    { label: "Median reported cap rate", value: metrics.medianReportedCapRate === null ? "Suppressed" : `${(metrics.medianReportedCapRate * 100).toFixed(2)}%`, context: metrics.medianReportedCapRate === null ? `Requires ${formatCount(CAP_RATE_MINIMUM_SAMPLE, "reported record")}` : "Reported observations only", sample: formatCount(metrics.capRateSampleSize, "reported record") },
    { label: "Average building size", value: metrics.averageBuildingSize === null ? "Unavailable" : `${formatNumber(Math.round(metrics.averageBuildingSize))} sf`, context: "Records with stated area", sample: formatCount(metrics.buildingSizeSampleSize, "record") },
  ];

  return (
    <section aria-labelledby="dashboard-metrics-title">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Filtered indicators</p><h2 className="mt-2 font-serif text-3xl font-medium text-navy" id="dashboard-metrics-title">Market measures at a glance</h2></div><p className="max-w-sm text-xs leading-5 text-slate">Every measure displays the number of usable records behind it.</p></div>
      <div className="grid gap-px border border-line bg-line shadow-[0_16px_42px_rgba(11,34,57,0.07)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card, index) => {
          const primary = index === 0;
          return <article className={`relative min-h-40 p-5 ${primary ? "bg-ink text-white" : "bg-white"}`} key={card.label}><span aria-hidden="true" className={`absolute right-4 top-4 font-mono text-[9px] ${primary ? "text-white/28" : "text-line"}`}>0{index + 1}</span><p className={`max-w-32 text-[9px] font-semibold uppercase leading-4 tracking-[0.12em] ${primary ? "text-white/56" : "text-slate"}`}>{card.label}</p><p className={`mt-5 font-serif text-2xl font-medium tracking-[-0.03em] ${primary ? "text-white" : "text-navy"}`}>{card.value}</p><p className={`mt-2 text-[10px] leading-4 ${primary ? "text-white/48" : "text-slate"}`}>{card.context}</p><p className={`mt-3 font-mono text-[9px] uppercase tracking-wide ${primary ? "text-copper" : "text-accent"}`}>{card.sample}</p></article>;
        })}
      </div>
    </section>
  );
}
