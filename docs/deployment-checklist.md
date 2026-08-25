# Production deployment checklist

## Before connecting Vercel

- Apply all Supabase migrations in filename order.
- Do not apply `supabase/seed.sql` to production.
- Create the first Supabase Authentication user and add its UUID to `admin_profiles`.
- Confirm anonymous users can read published records but cannot write to any table.
- Set `NEXT_PUBLIC_CONTACT_EMAIL` to a professional public address, or leave it blank to retain the privacy-safe unavailable state.
- Confirm every non-sample transaction has an attached source and appropriate verification status.

## Vercel project settings

- Import the GitHub repository as a Next.js project.
- Use Node.js 22 or any supported version at or above 20.9.
- Keep the build command as `npm run build` and the output settings on Vercel defaults.
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Production, Preview, and Development as appropriate.
- Add `NEXT_PUBLIC_CONTACT_EMAIL` wherever the public contact should be displayed.
- Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin, with no trailing path.
- Never add a Supabase service-role key to a `NEXT_PUBLIC_` variable or to this web application.

## Supabase authentication settings

- Set the Supabase Site URL to the canonical production origin.
- Add the Vercel preview URL pattern only if administrators must sign in on preview deployments.
- Keep email confirmation and password policy settings appropriate for the administrator group.
- Verify that unlisted authenticated users are rejected from `/admin`.

## Release verification

- Run `npm run check` and `npm run build` before merging.
- Confirm `/`, `/properties`, `/research`, `/dashboard`, `/coverage`, `/methodology`, and `/about` return successfully.
- Confirm `/admin` redirects signed-out visitors to `/admin/login`.
- Confirm `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `icon`, and `og.png` return successfully.
- Inspect a real property and a published research article for canonical metadata and sample labeling.
- Test navigation and filters with keyboard only and at a narrow mobile viewport.
- Verify security headers on the production response.
- Confirm preview deployments return a no-index robots policy; only the production Vercel environment with configured Supabase data may be indexed.
- Import one reviewed test row in a non-production Supabase project, then remove it through the admin workflow.

## Rollback

- Use Vercel's prior deployment promotion for an application rollback.
- Treat database migrations as forward-only. Prepare a separate corrective migration instead of editing an already-applied file.
- Export records before any material data migration.
