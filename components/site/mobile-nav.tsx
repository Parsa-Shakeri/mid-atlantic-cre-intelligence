"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { isNavItemActive, navItems } from "@/lib/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);
  return (
    <div className="lg:hidden">
      <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>
        <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
        {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
      </button>
      <AnimatePresence>{open ? (
        <motion.nav animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} initial={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} id="mobile-navigation" aria-label="Mobile navigation" className="absolute inset-x-0 top-full border-b border-line bg-paper px-5 py-4 shadow-[0_24px_60px_rgba(7,26,44,0.15)]">
          <ul className="mx-auto grid max-w-[1180px] gap-1">
            {navItems.map((item) => <li key={item.href}><Link aria-current={isNavItemActive(pathname, item.href) ? "page" : undefined} className="block rounded-sm px-3 py-3 text-sm font-medium text-navy hover:bg-mist aria-[current=page]:bg-mist aria-[current=page]:font-semibold" href={item.href} onClick={() => setOpen(false)}>{item.label}</Link></li>)}
          </ul>
        </motion.nav>
      ) : null}</AnimatePresence>
    </div>
  );
}
