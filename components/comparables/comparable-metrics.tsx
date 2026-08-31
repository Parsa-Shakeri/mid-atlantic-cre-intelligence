import { formatCount } from "@/lib/count-label";
import { formatCompactCurrency, formatCurrency, formatNumber } from "@/lib/sample-data";
import type { ComparableMetrics } from "@/lib/types";

export function ComparableMetricsGrid({ metrics }: { metrics: ComparableMetrics }) {
  const cards = [
    { label: "Matched recorded sales", value: formatNumber(metrics.matchedSales), note: "Selected database observations" },
    { label: "Recorded volume", value: formatCompactCurrency(metrics.totalSalesVolume), note: formatCount(metrics.metricRecordCount, "scanned record") },
    { label: "Median sale price", value: metrics.medianSalePrice === null ? "Unavailable" : formatCompactCurrency(metrics.medianSalePrice), note: formatCount(metrics.metricRecordCount, "scanned record") },
    { label: "Median price / sf*", value: metrics.medianPricePerSqFt === null ? "Unavailable" : formatCurrency(metrics.medianPricePerSqFt), note: `Mixed basis · ${formatCount(metrics.pricePerSqFtSampleSize, "usable record")}` },
    { label: "Median building size", value: metrics.medianBuildingSqFt === null ? "Unavailable" : `${formatNumber(metrics.medianBuildingSqFt)} sf`, note: formatCount(metrics.buildingSizeSampleSize, "usable record") },
    { label: "Median reported cap rate", value: metrics.medianReportedCapRate === null ? "Suppressed" : `${(metrics.medianReportedCapRate * 100).toFixed(2)}%`, note: metrics.capRateSampleSize < 3 ? `${formatCount(metrics.capRateSampleSize, "usable record")} · minimum 3` : formatCount(metrics.capRateSampleSize, "usable record") },
  ];
  return <dl className="grid border border-line bg-white shadow-[0_20px_55px_rgba(7,26,44,0.055)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{cards.map((card) => <div className="min-h-40 border-b border-line p-5 last:border-b-0 sm:border-r xl:border-b-0" key={card.label}><dt className="text-[9px] font-bold uppercase leading-4 tracking-[0.12em] text-slate">{card.label}</dt><dd className="mt-6 font-serif text-3xl font-semibold leading-none tracking-[-0.035em] text-navy">{card.value}</dd><dd className="mt-4 font-mono text-[9px] uppercase leading-4 tracking-wide text-slate">{card.note}</dd></div>)}</dl>;
}
