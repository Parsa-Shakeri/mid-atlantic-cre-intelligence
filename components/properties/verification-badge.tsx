import type { VerificationStatus } from "@/lib/types";

const styles: Record<VerificationStatus, string> = {
  Verified: "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Single Source": "border-sky-200 bg-sky-50 text-sky-800",
  Estimated: "border-amber-200 bg-amber-50 text-amber-900",
  Incomplete: "border-line bg-mist text-slate",
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  return <span className={`inline-flex border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${styles[status]}`}>{status}</span>;
}
