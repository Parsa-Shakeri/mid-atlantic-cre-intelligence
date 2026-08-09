export const navItems = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Property Database" },
  { href: "/research", label: "Research" },
  { href: "/dashboard", label: "Market Dashboard" },
  { href: "/project", label: "Project" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
] as const;

export function isNavItemActive(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}
