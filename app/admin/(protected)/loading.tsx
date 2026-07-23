export default function AdminLoading() {
  return <div aria-busy="true" aria-live="polite" className="panel p-8" role="status"><p className="eyebrow">Administration</p><p className="mt-3 text-lg font-semibold text-navy">Loading protected records…</p><p className="mt-2 text-sm text-slate">The current session and database permissions are being verified.</p></div>;
}
