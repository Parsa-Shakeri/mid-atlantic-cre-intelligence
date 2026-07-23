const fallbackUrl = "http://localhost:3000";

function toOrigin(value?: string) {
  if (!value) return null;
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try { return new URL(candidate).origin; } catch { return null; }
}

export function getSiteUrl(environment: Record<string, string | undefined> = process.env) {
  return toOrigin(environment.NEXT_PUBLIC_SITE_URL)
    ?? toOrigin(environment.VERCEL_PROJECT_PRODUCTION_URL)
    ?? toOrigin(environment.VERCEL_URL)
    ?? fallbackUrl;
}

export function shouldIndexSite(environment: Record<string, string | undefined> = process.env) {
  if (environment.VERCEL_ENV && environment.VERCEL_ENV !== "production") return false;
  return environment.NODE_ENV !== "production" || Boolean(environment.NEXT_PUBLIC_SUPABASE_URL && environment.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
