"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="panel p-8" role="alert"><p className="eyebrow">Administration error</p><h1 className="mt-3 font-serif text-3xl font-semibold text-navy">The protected workspace could not be loaded.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate">No changes were made. Retry the request; if the problem continues, verify the Supabase connection and applied migrations.</p><button className="button-primary mt-6" onClick={reset} type="button">Try again</button></section>;
}
