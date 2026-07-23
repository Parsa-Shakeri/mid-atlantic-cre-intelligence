"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/site/site-header";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);
  return (
    <div className="md:hidden">
      <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>
        <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
        <span aria-hidden="true">{open ? "Close" : "Menu"}</span>
      </button>
      {open ? (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute inset-x-0 top-full border-b border-line bg-paper px-5 py-4 shadow-lg">
          <ul className="mx-auto grid max-w-[1180px] gap-1">
            {navItems.map((item) => <li key={item.href}><Link aria-current={pathname === item.href ? "page" : undefined} className="block rounded-sm px-3 py-3 text-sm font-medium text-navy hover:bg-mist aria-[current=page]:bg-mist aria-[current=page]:font-semibold" href={item.href} onClick={() => setOpen(false)}>{item.label}</Link></li>)}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
