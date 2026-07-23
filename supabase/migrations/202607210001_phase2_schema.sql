-- Phase 2 schema for Mid-Atlantic CRE Intelligence.
-- Public visitors receive read-only access. Admin write policies arrive in Phase 5.

create extension if not exists pgcrypto;

create type public.property_type as enum (
  'Office', 'Retail', 'Industrial', 'Multifamily', 'Hotel', 'Medical Office',
  'Self-Storage', 'Mixed-Use', 'Land', 'Special Purpose'
);

create type public.verification_status as enum ('Verified', 'Single Source', 'Estimated', 'Incomplete');

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  property_name text not null check (char_length(property_name) between 2 and 200),
  street_address text not null,
  city text not null,
  state text not null check (state in ('MD', 'DC', 'VA')),
  zip_code text not null check (zip_code ~ '^\d{5}(?:-\d{4})?$'),
  county text not null,
  latitude numeric(9,6) check (latitude between -90 and 90),
  longitude numeric(9,6) check (longitude between -180 and 180),
  property_type public.property_type not null,
  building_sq_ft integer check (building_sq_ft > 0),
  lot_acres numeric(12,3) check (lot_acres > 0),
  year_built smallint check (year_built between 1700 and extract(year from current_date)::integer),
  year_renovated smallint check (year_renovated between year_built and extract(year from current_date)::integer),
  number_of_floors smallint check (number_of_floors > 0),
  parking_spaces integer check (parking_spaces >= 0),
  major_tenants text[] not null default '{}',
  description text not null default '',
  lease_structure text,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (street_address, city, state, zip_code)
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  thesis text not null,
  summary text not null,
  body text not null,
  category text not null,
  featured_image text check (featured_image is null or featured_image ~ '^https?://'),
  publication_date date,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  reading_time integer not null default 1 check (reading_time > 0),
  author text not null,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  sale_date date not null check (sale_date <= current_date),
  sale_price numeric(16,2) not null check (sale_price > 0),
  buyer text,
  seller text,
  reported_cap_rate numeric(7,6) check (reported_cap_rate > 0 and reported_cap_rate <= 0.30),
  reported_noi numeric(16,2) check (reported_noi > 0),
  price_per_sq_ft numeric(12,2) check (price_per_sq_ft > 0),
  transaction_type text not null,
  notes text,
  verification_status public.verification_status not null default 'Incomplete',
  date_verified date,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, sale_date, sale_price),
  check (verification_status not in ('Verified', 'Single Source') or date_verified is not null)
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references public.transactions(id) on delete cascade,
  property_id uuid references public.properties(id) on delete cascade,
  article_id uuid references public.articles(id) on delete cascade,
  source_name text not null,
  source_url text not null check (source_url ~ '^https?://'),
  publication_date date,
  accessed_date date not null check (accessed_date <= current_date),
  source_type text not null,
  notes text,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  check (num_nonnulls(transaction_id, property_id, article_id) >= 1)
);

create table public.article_properties (
  article_id uuid not null references public.articles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  primary key (article_id, property_id)
);

create table public.markets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  state text not null check (state in ('MD', 'DC', 'VA')),
  county text,
  city text,
  parent_market_id uuid references public.markets(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (name, state)
);

create index properties_location_idx on public.properties (state, county, city);
create index properties_type_idx on public.properties (property_type);
create index properties_created_idx on public.properties (created_at desc);
create index transactions_property_date_idx on public.transactions (property_id, sale_date desc);
create index transactions_price_idx on public.transactions (sale_price desc);
create index transactions_cap_rate_idx on public.transactions (reported_cap_rate) where reported_cap_rate is not null;
create index transactions_verification_idx on public.transactions (verification_status);
create index sources_property_idx on public.sources (property_id) where property_id is not null;
create index sources_transaction_idx on public.sources (transaction_id) where transaction_id is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger properties_set_updated_at before update on public.properties for each row execute function public.set_updated_at();
create trigger transactions_set_updated_at before update on public.transactions for each row execute function public.set_updated_at();
create trigger articles_set_updated_at before update on public.articles for each row execute function public.set_updated_at();

create view public.property_transaction_records
with (security_invoker = true)
as
select
  p.id as property_id,
  t.id as transaction_id,
  p.slug,
  p.property_name,
  p.street_address,
  p.city,
  p.state,
  p.zip_code,
  p.county,
  p.property_type,
  p.building_sq_ft,
  p.major_tenants,
  t.sale_date,
  t.sale_price,
  t.buyer,
  t.seller,
  t.reported_cap_rate,
  t.reported_noi,
  coalesce(t.price_per_sq_ft, round(t.sale_price / nullif(p.building_sq_ft, 0), 2)) as price_per_sq_ft,
  t.transaction_type,
  t.verification_status,
  t.date_verified,
  t.created_at as date_added,
  (p.is_sample or t.is_sample) as is_sample,
  concat_ws(' ', p.property_name, p.street_address, p.city, t.buyer, t.seller, array_to_string(p.major_tenants, ' ')) as search_document
from public.properties p
join public.transactions t on t.property_id = p.id;

create view public.public_market_summary
with (security_invoker = true)
as
select
  (select count(*) from public.properties)::bigint as properties,
  (select count(*) from public.transactions)::bigint as transactions,
  (select coalesce(sum(sale_price), 0) from public.transactions)::numeric as total_value,
  (select count(distinct (city, state)) from public.properties)::bigint as markets,
  (select count(*) from public.articles where status = 'published')::bigint as reports;

alter table public.properties enable row level security;
alter table public.transactions enable row level security;
alter table public.sources enable row level security;
alter table public.articles enable row level security;
alter table public.article_properties enable row level security;
alter table public.markets enable row level security;

create policy "Public properties are readable" on public.properties for select to anon, authenticated using (true);
create policy "Public transactions are readable" on public.transactions for select to anon, authenticated using (true);
create policy "Public sources are readable" on public.sources for select to anon, authenticated
  using (
    property_id is not null
    or transaction_id is not null
    or exists (select 1 from public.articles where articles.id = sources.article_id and articles.status = 'published')
  );
create policy "Published articles are readable" on public.articles for select to anon, authenticated using (status = 'published');
create policy "Published article links are readable" on public.article_properties for select to anon, authenticated
  using (exists (select 1 from public.articles where articles.id = article_properties.article_id and articles.status = 'published'));
create policy "Markets are readable" on public.markets for select to anon, authenticated using (true);

grant select on public.properties, public.transactions, public.sources, public.markets to anon, authenticated;
grant select on public.articles, public.article_properties to anon, authenticated;
grant select on public.property_transaction_records, public.public_market_summary to anon, authenticated;

comment on table public.properties is 'Commercial property records. is_sample must remain true for fictional development data.';
comment on table public.transactions is 'Property transactions; a property may have multiple transaction records.';
comment on view public.property_transaction_records is 'Read-optimized transaction view used by public filtering, sorting, and pagination.';
