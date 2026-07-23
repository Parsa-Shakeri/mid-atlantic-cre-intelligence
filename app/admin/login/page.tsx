import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { createAuthenticatedSupabaseClient } from "@/lib/supabase/auth-server";
import { loginAction, logoutAction } from "@/app/admin/login/actions";

export const metadata: Metadata = { title: "Admin Sign In", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const messages: Record<string, string> = {
  "not-configured": "Supabase authentication is not configured. Add the public project URL and anonymous key before signing in.",
  "sign-in-required": "Sign in with an authorized administrator account to continue.",
  "not-authorized": "This account is authenticated but does not have an administrator role.",
  "missing-credentials": "Enter both an email address and password.",
};

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");
  const client = await createAuthenticatedSupabaseClient();
  const { data: { user } } = client ? await client.auth.getUser() : { data: { user: null } };
  const params = await searchParams;
  const rawError = Array.isArray(params.error) ? params.error[0] : params.error;
  const errorMessage = rawError ? messages[rawError] ?? rawError : null;
  return <section className="border-b border-line bg-mist/50"><Container className="grid min-h-[74vh] place-items-center py-12 sm:py-20"><div className="grid w-full max-w-4xl overflow-hidden border border-navy/15 bg-white shadow-[0_28px_80px_rgba(11,34,57,0.14)] md:grid-cols-[0.8fr_1.2fr]"><aside className="relative overflow-hidden bg-navy p-8 text-white sm:p-10"><div className="relative z-10"><span aria-hidden="true" className="grid h-14 w-14 place-items-center border border-white/25 font-serif text-2xl">M</span><p className="mt-10 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d98b68]">Protected workspace</p><h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-[-0.03em]">Editorial administration</h1><p className="mt-5 text-sm leading-7 text-white/65">Maintain research records, source verification, publication status, and market data in one controlled workspace.</p></div><p aria-hidden="true" className="absolute -bottom-5 -right-3 font-serif text-8xl font-bold text-white/[0.035]">ADMIN</p></aside><div className="p-7 sm:p-10"><p className="eyebrow">Authorized access only</p><h2 className="mt-3 font-serif text-3xl font-semibold text-navy">Sign in</h2><p className="mt-4 text-sm leading-6 text-slate">Use the Supabase account explicitly listed in the project’s administrator profiles.</p>{errorMessage ? <p className="mt-5 border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="alert">{errorMessage}</p> : null}{params.status === "signed-out" ? <p className="mt-5 border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900" role="status">You have signed out.</p> : null}{user ? <div className="mt-6"><p className="text-sm text-slate">Signed in as <span className="font-semibold text-navy">{user.email}</span>, but this account is not authorized.</p><form action={logoutAction}><button className="button-secondary mt-5 w-full" type="submit">Sign out</button></form></div> : <form action={loginAction} className="mt-7 grid gap-5"><label className="filter-label">Email<input className="filter-input" type="email" name="email" autoComplete="email" required /></label><label className="filter-label">Password<input className="filter-input" type="password" name="password" autoComplete="current-password" required minLength={8} /></label><button className="button-primary" type="submit">Sign in securely</button></form>}<Link className="mt-6 inline-block text-xs font-semibold text-slate underline decoration-line underline-offset-4 hover:text-navy" href="/">← Return to public site</Link></div></div></Container></section>;
}
