import { CAP_RATE_MINIMUM_SAMPLE, type DashboardData } from "./types";

const fields = [
  "section", "label", "market", "property_name", "property_type", "sale_date", "transaction_count", "sale_price",
  "total_sales_volume", "median_sale_price", "median_price_per_sq_ft", "price_per_sq_ft_sample_size",
  "median_reported_cap_rate", "cap_rate_sample_size", "average_building_size", "verification_status",
] as const;

function safeCell(value: unknown) {
  const raw = value == null ? "" : String(value);
  const formulaSafe = /^[=+@-]/.test(raw) ? `'${raw}` : raw;
  return `"${formulaSafe.replaceAll('"', '""')}"`;
}

function row(values: Partial<Record<(typeof fields)[number], unknown>>) {
  return fields.map((field) => safeCell(values[field])).join(",");
}

export function dashboardDataToCsv(data: DashboardData) {
  const rows = [fields.join(",")];
  const filters = Object.entries(data.filters).filter(([, value]) => value);
  for (const [label, value] of filters) rows.push(row({ section: "filter", label, market: value }));

  rows.push(row({ section: "metric", label: "Transactions", transaction_count: data.metrics.transactionCount }));
  rows.push(row({ section: "metric", label: "Total sales volume", total_sales_volume: data.metrics.totalSalesVolume, transaction_count: data.metrics.transactionCount }));
  rows.push(row({ section: "metric", label: "Median sale price", median_sale_price: data.metrics.medianSalePrice, transaction_count: data.metrics.transactionCount }));
  rows.push(row({ section: "metric", label: "Median price per square foot", median_price_per_sq_ft: data.metrics.medianPricePerSqFt, price_per_sq_ft_sample_size: data.metrics.pricePerSqFtSampleSize }));
  rows.push(row({ section: "metric", label: "Median reported cap rate", median_reported_cap_rate: data.metrics.medianReportedCapRate, cap_rate_sample_size: data.metrics.capRateSampleSize, verification_status: data.metrics.capRateSampleSize < CAP_RATE_MINIMUM_SAMPLE ? "Suppressed" : "Reported sample" }));
  rows.push(row({ section: "metric", label: "Average building size", average_building_size: data.metrics.averageBuildingSize }));

  for (const market of data.marketComparison) rows.push(row({ section: "market", label: "Market comparison", market: market.market, transaction_count: market.transactionCount, total_sales_volume: market.totalSalesVolume, median_sale_price: market.medianSalePrice, median_price_per_sq_ft: market.medianPricePerSqFt, price_per_sq_ft_sample_size: market.pricePerSqFtSampleSize, median_reported_cap_rate: market.medianReportedCapRate, cap_rate_sample_size: market.capRateSampleSize, average_building_size: market.averageBuildingSize }));
  for (const transaction of data.largestTransactions) rows.push(row({ section: "largest_transaction", label: "Recorded sale", market: transaction.market, property_name: transaction.propertyName, property_type: transaction.propertyType, sale_date: transaction.saleDate, sale_price: transaction.salePrice, verification_status: transaction.verificationStatus }));

  return `${rows.join("\r\n")}\r\n`;
}
