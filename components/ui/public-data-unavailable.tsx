import { DatabaseZap } from "lucide-react";

export function PublicDataUnavailable({ className = "" }: { className?: string }) {
  return (
    <div className={`border border-amber-300/80 bg-amber-50 px-6 py-8 text-left ${className}`} role="status">
      <DatabaseZap aria-hidden="true" className="size-6 text-amber-700" strokeWidth={1.6} />
      <p className="mt-5 font-serif text-2xl font-medium text-navy">Public database temporarily unavailable</p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
        The live data service could not be reached, so transaction records, totals, and reports are being withheld. Fictional development records have not been substituted.
      </p>
    </div>
  );
}
