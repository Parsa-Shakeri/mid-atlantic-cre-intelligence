import type { ReactNode } from "react";

export function TableScroll({ children, label, className = "" }: { children: ReactNode; label: string; className?: string }) {
  return <div aria-label={label} className={`overflow-x-auto ${className}`} role="region" tabIndex={0}>{children}</div>;
}
