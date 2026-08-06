import type { ReactNode } from "react";
import type { ValueKind } from "@/lib/types";

export function ValueRow({ label, value, kind = "Reported" }: { label: string; value: ReactNode; kind?: ValueKind }) {
  const unavailable = value === null || value === undefined || value === "";
  return <div className="grid gap-1 border-b border-line py-4 last:border-b-0 sm:grid-cols-[1fr_1.1fr_auto] sm:items-center"><dt className="text-sm text-slate">{label}</dt><dd className={`text-sm font-semibold ${unavailable ? "text-slate/60" : "text-navy"}`}>{unavailable ? "Not publicly available" : value}</dd><dd className="text-[9px] font-semibold uppercase tracking-[0.09em] text-slate">{unavailable ? "Not reported" : kind}</dd></div>;
}
