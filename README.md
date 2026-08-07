# Mid-Atlantic CRE Intelligence

An independent student research platform for commercial real estate transactions and market trends across Maryland, Washington, D.C., and Northern Virginia.

## Technology

- Next.js 16 App Router with Turbopack, React 19, and strict TypeScript
- Tailwind CSS
- Motion for scroll-linked and in-view interaction
- Lucide React icons
- Self-hosted Geist, Geist Mono, and Newsreader through `next/font`
- Supabase with PostgreSQL and Row Level Security
- Recharts for accessible client-rendered charts
- Vitest for domain and query tests
- Vercel-compatible deployment

Pages render on the server by default. Client components are limited to interactions that need browser state, including the mobile menu, error retry control, and progressive motion. The site honors `prefers-reduced-motion` with static equivalents.

## Project structure

```text
app/                         Routes, metadata, sitemap, and global styles
app/properties/              Searchable database and property detail routes
app/research/                Research library and article routes
app/dashboard/               Filtered market dashboard
components/home/             Homepage publication and data components
components/motion/           Reduced-motion-aware reveal and scroll utilities
components/properties/       Filters, results, badges, and value display
components/research/         Article cards and accessible exhibits
components/dashboard/        Filters, metrics, charts, and comparison tables
components/admin/            Protected forms, notices, and CSV review UI
components/site/             Shared navigation and footer
components/ui/               Design-system primitives
data/                         Clearly labeled sample CSV
docs/                         Release checklist and design-source references
lib/data/                     Server-side data access layer
lib/supabase/                 Supabase client and generated-style types
supabase/migrations/          Versioned PostgreSQL schema
supabase/seed.sql             Fictional development seed records
tests/                        Calculation, filtering, and sorting tests
```

## Data relationships

- One property can have many transactions.
- Sources can reference properties, transactions, articles, or an appropriate combination.
- Articles and properties have a many-to-many relationship through `article_properties`.
- Markets can represent geographic hierarchy.
- `property_transaction_records` is a read-optimized database view used for public search, sorting, and pagination.
- `public_market_summary` supplies homepage totals without loading the entire database.

## Local installation

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Run `npm run dev` and open `http://localhost:3000`.

If port 3000 is already occupied, run `npm run dev -- --port 3001` and open `http://localhost:3001`.

Without Supabase environment values, the site automatically uses nine fictional properties and ten fictional transactions. The interface labels every sample record.

## Supabase setup

1. Create a Supabase project.
2. Install the Supabase CLI or use the project SQL editor.
3. Apply every SQL file in `supabase/migrations/` in filename order.
4. For local development only, apply `supabase/seed.sql`.
5. Copy the project URL and public anonymous key into `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
```

The anonymous key is safe to expose in browser configuration; it is not a service-role key. Row Level Security keeps anonymous visitors read-only and grants writes only to authenticated users listed in `admin_profiles`. Never add a service-role key to this application or to a `NEXT_PUBLIC_` variable.

## Authentication and admin access

Phase 5 uses Supabase email/password authentication with server-validated sessions. To create the first administrator:

1. In Supabase Dashboard, create a user under Authentication > Users.
2. Copy that user's UUID.
3. Run the following in the SQL editor, replacing the example UUID:

```sql
insert into public.admin_profiles (user_id, role, display_name)
values ('00000000-0000-0000-0000-000000000000', 'admin', 'Research administrator');
```

4. Visit `/admin/login` and sign in with that user's credentials.

Both `admin` and `editor` roles can maintain content in Phase 5. Public users cannot insert, update, or delete records. The `/admin` routes validate the current user on the server, while PostgreSQL policies independently enforce the same boundary. Database triggers record property, transaction, article, and source changes in `audit_log`.

## Database migration and validation

The migration creates controlled property and verification types, field constraints, duplicate protection, query indexes, timestamp triggers, read-optimized views, and public read policies. Validation covers positive prices and areas, date bounds, state codes, cap-rate bounds, URL formats, duplicate addresses, duplicate transactions, and missing verification dates.

Reset local Supabase and apply the migration plus seed data with:

```text
supabase db reset
```

## Sample data policy

All development records use invented names, parties, addresses, tenants, values, and placeholder citations. They are marked with `is_sample = true`. Do not alter that flag or present these rows as actual transactions. The short CSV in `data/sample-properties.csv` is a future import-flow template, not a real dataset.

## Property database

The `/properties` page supports:

- Search by property, address, city, buyer, seller, or tenant
- State, county, city, property type, year, price, size, cap-rate, and verification filters
- Sorting by sale date, price, building size, price per square foot, cap rate, or date added
- Server-side pagination
- Responsive mobile cards and desktop tables

Property pages at `/properties/[slug]` show transaction history, property facts, reported/calculated/missing value labels, verification status, and sources.

## Research publishing

The `/research` page exposes all seven controlled categories, featured reports, category counts, and empty states. Article pages at `/research/[slug]` include a thesis, author and publication metadata, executive summary, Markdown body, accessible data exhibit, limitations, sources, related properties, related reports, canonical metadata, and Article structured data.

Phase 3 adds `executive_summary`, `limitations`, and an optional JSON exhibit through `supabase/migrations/202607210002_phase3_research.sql`. The seed file includes seven clearly labeled fictional reports—one per category—and attaches placeholder sources and fictional property records. Apply migrations in filename order.

## Market dashboard

The `/dashboard` page provides URL-shareable filters for date range, state, county, city, and property type. It displays transaction count, total sales volume, median sale price, median price per square foot, median reported cap rate, and average building size. Visuals cover transaction count over time, sales volume by property type, median price per square foot by market, and reported cap-rate distribution. Largest-transaction and market-comparison tables retain links to underlying records.

`supabase/migrations/202607210003_phase4_dashboard.sql` adds a read-only PostgreSQL aggregation function. The browser receives bounded aggregate series and top-ten tables rather than the complete transaction dataset. Reported cap-rate statistics are suppressed when fewer than three usable observations match the filters, and every metric or chart displays its sample size.

## Administration and CSV import

The protected admin workspace includes an overview, recent edit history, data-quality queues, property and transaction editors, source attachment, article drafting and publishing, protected draft previews, CSV intake, and CSV export. Destructive forms require the administrator to type `DELETE`.

CSV intake follows an explicit review sequence:

1. Upload a `.csv` file or paste CSV text at `/admin/import`.
2. Match source columns to controlled database fields.
3. Review every row-level error and warning. Existing-address and within-file duplicate checks block confirmation.
4. Mark fictional development rows with `is_sample=true`.
5. Confirm the reviewed rows. The server repeats validation and calls one role-checked PostgreSQL function, so the entire batch succeeds or rolls back.
6. Attach sources to imported records from the missing-source queue.

The current import intentionally creates a new property with one initial transaction per row. Add subsequent transactions with the transaction editor. Imports are limited to 500 rows and invalid rows are never skipped. Templates are available at `public/sample-import.csv` and `data/sample-properties.csv`; every included example is explicitly fictional.

The export at `/admin/export` produces a private, non-cached property/transaction CSV, labels sample rows, and protects spreadsheet applications from formula-like cell values.

## Accessibility and responsive behavior

- A skip link, semantic landmarks, visible focus styles, labeled forms, descriptive empty and error states, and keyboard-operable navigation are included throughout.
- Database results become compact cards on small screens. Wide research and dashboard tables remain horizontally scrollable and expose labeled, focusable regions for keyboard users.
- Recharts visuals use their accessibility layer and include expandable data tables containing the same values.
- Motion is minimized when the operating system requests reduced motion.
- Mobile form controls use touch-friendly heights and avoid browser zoom caused by undersized text.

## SEO and indexing safety

Global metadata includes canonical URLs, Open Graph and X cards generated with `next/og`, a generated application icon, a web manifest, organization and website structured data, and restrictive metadata for unavailable records. Published article pages include Article structured data.

The sitemap reads real property and published-article slugs from Supabase and excludes fictional sample records. A production build without both Supabase public environment variables is marked `noindex` and disallowed in `robots.txt`; this prevents an accidentally deployed development dataset from appearing in search results.

## Performance and security

Public database queries are paginated, dashboard responses contain bounded aggregates, and pages remain server-rendered unless browser interaction is required. Recharts is isolated to the dashboard client bundle. The application adds HSTS, clickjacking protection, MIME sniffing protection, a restrictive permissions policy, and a strict referrer policy through Next.js response headers.

## Quality checks

```text
npm run lint
npm run typecheck
npm run test
npm run build
```

`npm run check` runs lint, strict type checking, and the complete test suite in sequence.

Tests cover price-per-square-foot and verified cap-rate calculations, search, combined filters, percentage handling, sorting, query normalization, controlled research categories, Markdown parsing, sample labeling, related-content completeness, dashboard medians, filtered aggregation, cap-rate suppression, CSV parsing, column matching, record validation, duplicate detection, slug generation, and missing-source warnings.

## Troubleshooting

- If `/admin/login` reports that Supabase is not configured, verify both public environment variables and restart the development server.
- If sign-in succeeds but access is denied, add the authenticated user's UUID to `admin_profiles`.
- If an import is rejected, correct every preview error. A duplicate discovered by PostgreSQL rolls back the entire batch.
- If draft articles do not appear publicly, this is expected; only `published` articles are visible on public routes.
- If schema-related errors appear, confirm that all four migrations were applied in filename order.

## Vercel deployment

1. Push the project to GitHub and import it into Vercel as a Next.js project.
2. Select Node.js 22, or another supported version at or above 20.9.
3. Apply all Supabase migrations. Do not apply the fictional seed file to production.
4. Add `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and an optional `NEXT_PUBLIC_CONTACT_EMAIL` in Vercel. The site URL must be the final canonical origin.
5. Set the matching Site URL and permitted redirect origins in Supabase Authentication.
6. Deploy, then verify public pages, administrator redirection, metadata routes, security headers, and one complete authenticated editing flow. Vercel preview deployments remain no-index even when connected to Supabase.

The included GitHub Actions workflow runs linting, strict type checks, tests, and a production build on pull requests and pushes to the main branch. Vercel uses the dedicated `vercel-build` script and the repository's Node 22 runtime declaration.

The full release and rollback procedure is in `docs/deployment-checklist.md`.

## Future improvements

- Add automated browser accessibility checks and visual regression tests in CI.
- Split the sitemap if the database approaches the 5,000-record Phase 6 query limit.
- Add direct object-storage image uploads with rights and attribution fields.
- Add a reviewer role with approval gates separate from editorial drafting.
- Add database backup monitoring and scheduled source-link validation.

## Implementation status

- Phase 1: foundation, design system, homepage, About, Methodology — complete
- Phase 2: schema, seed data, property database, property detail pages — complete
- Phase 3: research index and article pages — complete
- Phase 4: interactive market dashboard — complete
- Phase 5: authentication, administration, safe CSV import, audit history, and export — complete
- Phase 6: accessibility, SEO, testing, responsive behavior, documentation, and Vercel deployment audit — complete
