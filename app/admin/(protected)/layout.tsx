import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { logoutAction } from "@/app/admin/login/actions";
import { AdminNavigation } from "@/components/admin/admin-navigation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: { default: "Administration", template: "%s | Capital Parcel Admin" }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireAdmin();
  return <div className="admin-shell"><header className="bg-[#071a2d] text-white"><div className="mx-auto flex max-w-[1380px] flex-col gap-5 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-4"><span aria-hidden="true" className="grid h-10 w-10 place-items-center border border-white/20 font-serif text-base font-semibold tracking-[-0.06em] text-white">CP</span><div><Link className="text-xs font-bold uppercase tracking-[0.13em]" href="/admin">Capital Parcel Administration</Link><p className="mt-1 text-[11px] text-white/55">{profile.displayName ?? user.email} <span aria-hidden="true">·</span> <span className="uppercase tracking-wider">{profile.role}</span></p></div></div><div className="flex flex-wrap items-center gap-4"><Link className="text-xs font-semibold text-white/65 hover:text-white" href="/">View public site</Link><form action={logoutAction}><button className="border border-white/25 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/10" type="submit">Sign out</button></form></div></div></header><div className="mx-auto grid max-w-[1380px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[225px_1fr] lg:py-10"><aside><div className="lg:sticky lg:top-28"><AdminNavigation /><p className="mt-4 px-1 text-[10px] leading-5 text-slate">Public records remain read-only. Every material edit is recorded in the audit log.</p></div></aside><main className="min-w-0">{children}</main></div></div>;
}
