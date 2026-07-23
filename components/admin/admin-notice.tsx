export function AdminNotice({ status, error }: { status?: string; error?: string }) {
  if (!status && !error) return null;
  return <div aria-live="polite" className={`mb-6 border px-4 py-3 text-sm ${error ? "border-red-300 bg-red-50 text-red-900" : "border-emerald-300 bg-emerald-50 text-emerald-900"}`} role={error ? "alert" : "status"}>
    {error ?? status}
  </div>;
}
