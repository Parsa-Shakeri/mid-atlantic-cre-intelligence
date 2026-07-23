import { CAP_RATE_MINIMUM_SAMPLE, type DashboardMetrics } from "@/lib/types";
import { formatCompactCurrency, formatCurrency, formatNumber } from "@/lib/sample-data";

export function DashboardMetrics({ metrics }: { metrics: DashboardMetrics }) {
  const cards = [
    { label: "Transactions", value: formatNumber(metrics.transactionCount), sample: `n = ${metrics.transactionCount}` },
    { label: "Total sales volume", value: formatCompactCurrency(metrics.totalSalesVolume), sample: `n = ${metrics.transactionCount}` },
    { label: "Median sale price", value: metrics.medianSalePrice === null ? "Unavailable" : formatCompactCurrency(metrics.medianSalePrice), sample: `n = ${metrics.transactionCount}` },
    { label: "Median price / sq. ft.", value: metrics.medianPricePerSqFt === null ? "Unavailable" : formatCurrency(metrics.medianPricePerSqFt), sample: `n = ${metrics.pricePerSqFtSampleSize}` },
    { label: "Median reported cap rate", value: metrics.medianReportedCapRate === null ? "Suppressed" : `${(metrics.medianReportedCapRate * 100).toFixed(2)}%`, sample: `n = ${metrics.capRateSampleSize}; minimum ${CAP_RATE_MINIMUM_SAMPLE}` },
    { label: "Average building size", value: metrics.averageBuildingSize === null ? "Unavailable" : `${formatNumber(Math.round(metrics.averageBuildingSize))} sf`, sample: `n = ${metrics.buildingSizeSampleSize}` },
  ];
  return <div className="grid border border-line bg-white shadow-[0_16px_42px_rgba(11,34,57,0.07)] sm:grid-cols-2 xl:grid-cols-6">{cards.map((card, index) => <div className="relative min-h-36 border-b border-r border-line p-5 last:border-r-0 xl:border-b-0" key={card.label}><span className="absolute right-4 top-4 text-[9px] font-bold text-line">0{index + 1}</span><p className="max-w-28 text-[9px] font-bold uppercase leading-4 tracking-[0.12em] text-slate">{card.label}</p><p className="mt-5 font-serif text-2xl font-semibold tracking-[-0.03em] text-navy">{card.value}</p><p className="mt-2 text-[9px] font-semibold uppercase tracking-wide text-slate">{card.sample}</p></div>)}</div>;
}
