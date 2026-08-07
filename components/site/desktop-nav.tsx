"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavItemActive, navItems } from "@/lib/navigation";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="hidden lg:block">
      <ul className="flex items-center gap-5 xl:gap-7">
        {navItems.map((item) => {
          const isActive = isNavItemActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link aria-current={isActive ? "page" : undefined} className="nav-link" href={item.href}>{item.label}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
