"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNav = [
  ["/admin", "Overview", "01"],
  ["/admin/properties", "Properties", "02"],
  ["/admin/transactions", "Transactions", "03"],
  ["/admin/articles", "Articles", "04"],
  ["/admin/sources", "Sources", "05"],
  ["/admin/import", "CSV Import", "06"],
] as const;

export function AdminNavigation() {
  const pathname = usePathname();
  return <nav aria-label="Admin navigation" className="admin-sidebar">
    <div className="border-b border-white/10 px-4 py-4">
      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#d98b68]">Workspace</p>
      <p className="mt-1 font-serif text-lg text-white">Research controls</p>
    </div>
    <ul>{adminNav.map(([href, label, number]) => {
      const active = pathname === href;
      return <li key={href}><Link aria-current={active ? "page" : undefined} className={`admin-nav-link ${active ? "admin-nav-link-active" : ""}`} href={href}><span>{label}</span><span className="text-[9px] text-white/35">{number}</span></Link></li>;
    })}</ul>
  </nav>;
}
