import Link from "next/link";

export function AdminPageHeader({ eyebrow, title, description, action }: {
  eyebrow: string; title: string; description: string; action?: { href: string; label: string };
}) {
  return <header className="relative mb-7 flex flex-col gap-5 overflow-hidden border border-navy/15 bg-white p-6 shadow-[0_14px_36px_rgba(11,34,57,0.055)] sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:p-7 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-accent">
    <div><p className="eyebrow">{eyebrow}</p><h1 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.025em] text-navy sm:text-4xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate">{description}</p></div>
    {action ? <Link className="button-secondary shrink-0" href={action.href}>{action.label}</Link> : null}
  </header>;
}
