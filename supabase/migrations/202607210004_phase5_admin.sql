-- Phase 5 authentication, authorization, audit history, and atomic CSV import.

create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'editor')),
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  table_name text not null,
  record_id text not null,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  snapshot jsonb not null,
  changed_at timestamptz not null default now()
);

create index audit_log_changed_idx on public.audit_log (changed_at desc);
create index audit_log_record_idx on public.audit_log (table_name, record_id);

alter table public.admin_profiles enable row level security;
alter table public.audit_log enable row level security;

create or replace function public.is_admin(requesting_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_profiles
    where user_id = requesting_user and role in ('admin', 'editor')
  );
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to authenticated;

create or replace function public.is_full_admin(requesting_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_profiles
    where user_id = requesting_user and role = 'admin'
  );
$$;

revoke all on function public.is_full_admin(uuid) from public;
grant execute on function public.is_full_admin(uuid) to authenticated;

create policy "Administrators can read their profile" on public.admin_profiles
  for select to authenticated using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy "Administrators can manage profiles" on public.admin_profiles
  for all to authenticated using (public.is_full_admin(auth.uid())) with check (public.is_full_admin(auth.uid()));
create policy "Administrators can read audit history" on public.audit_log
  for select to authenticated using (public.is_admin(auth.uid()));

create policy "Administrators can create properties" on public.properties for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "Administrators can update properties" on public.properties for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Administrators can delete properties" on public.properties for delete to authenticated using (public.is_admin(auth.uid()));

create policy "Administrators can create transactions" on public.transactions for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "Administrators can update transactions" on public.transactions for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Administrators can delete transactions" on public.transactions for delete to authenticated using (public.is_admin(auth.uid()));

create policy "Administrators can read all articles" on public.articles for select to authenticated using (public.is_admin(auth.uid()));
create policy "Administrators can create articles" on public.articles for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "Administrators can update articles" on public.articles for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Administrators can delete articles" on public.articles for delete to authenticated using (public.is_admin(auth.uid()));

create policy "Administrators can create sources" on public.sources for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "Administrators can read all sources" on public.sources for select to authenticated using (public.is_admin(auth.uid()));
create policy "Administrators can update sources" on public.sources for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Administrators can delete sources" on public.sources for delete to authenticated using (public.is_admin(auth.uid()));

create policy "Administrators can read all article links" on public.article_properties for select to authenticated using (public.is_admin(auth.uid()));
create policy "Administrators can create article links" on public.article_properties for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "Administrators can delete article links" on public.article_properties for delete to authenticated using (public.is_admin(auth.uid()));

create policy "Administrators can create markets" on public.markets for insert to authenticated with check (public.is_admin(auth.uid()));
create policy "Administrators can update markets" on public.markets for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Administrators can delete markets" on public.markets for delete to authenticated using (public.is_admin(auth.uid()));

grant select, insert, update, delete on public.admin_profiles to authenticated;
grant select on public.audit_log to authenticated;
grant insert, update, delete on public.properties, public.transactions, public.articles, public.sources, public.article_properties, public.markets to authenticated;

create or replace function public.record_admin_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed_record jsonb;
  changed_id text;
begin
  changed_record := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  changed_id := coalesce(changed_record ->> 'id', changed_record ->> 'slug', 'unknown');
  insert into public.audit_log (user_id, table_name, record_id, action, snapshot)
  values (auth.uid(), tg_table_name, changed_id, tg_op, changed_record);
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create trigger properties_admin_audit after insert or update or delete on public.properties for each row execute function public.record_admin_change();
create trigger transactions_admin_audit after insert or update or delete on public.transactions for each row execute function public.record_admin_change();
create trigger articles_admin_audit after insert or update or delete on public.articles for each row execute function public.record_admin_change();
create trigger sources_admin_audit after insert or update or delete on public.sources for each row execute function public.record_admin_change();

create or replace function public.import_property_transactions(import_rows jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  import_row jsonb;
  new_property_id uuid;
  imported_count integer := 0;
  normalized_state text;
  normalized_status public.verification_status;
  normalized_property_type public.property_type;
  building_size integer;
  sale_amount numeric;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Administrator role required';
  end if;
  if jsonb_typeof(import_rows) <> 'array' then
    raise exception 'Import payload must be an array';
  end if;
  if jsonb_array_length(import_rows) = 0 or jsonb_array_length(import_rows) > 500 then
    raise exception 'Import must contain between 1 and 500 rows';
  end if;

  for import_row in select value from jsonb_array_elements(import_rows)
  loop
    normalized_state := upper(import_row ->> 'state');
    normalized_status := (import_row ->> 'verification_status')::public.verification_status;
    normalized_property_type := (import_row ->> 'property_type')::public.property_type;
    building_size := nullif(import_row ->> 'building_sq_ft', '')::integer;
    sale_amount := (import_row ->> 'sale_price')::numeric;

    if exists (
      select 1 from public.properties
      where lower(street_address) = lower(import_row ->> 'street_address')
        and lower(city) = lower(import_row ->> 'city')
        and state = normalized_state
        and zip_code = import_row ->> 'zip_code'
    ) then
      raise exception 'Likely duplicate property: %', import_row ->> 'street_address';
    end if;

    insert into public.properties (
      slug, property_name, street_address, city, state, zip_code, county, property_type,
      building_sq_ft, major_tenants, description, is_sample
    ) values (
      import_row ->> 'slug', import_row ->> 'property_name', import_row ->> 'street_address',
      import_row ->> 'city', normalized_state, import_row ->> 'zip_code', import_row ->> 'county',
      normalized_property_type, building_size,
      coalesce(array(select jsonb_array_elements_text(import_row -> 'major_tenants')), '{}'),
      coalesce(import_row ->> 'description', ''), coalesce((import_row ->> 'is_sample')::boolean, false)
    ) returning id into new_property_id;

    insert into public.transactions (
      property_id, sale_date, sale_price, buyer, seller, reported_cap_rate, reported_noi,
      price_per_sq_ft, transaction_type, notes, verification_status, date_verified, is_sample
    ) values (
      new_property_id, (import_row ->> 'sale_date')::date, sale_amount,
      nullif(import_row ->> 'buyer', ''), nullif(import_row ->> 'seller', ''),
      case when nullif(import_row ->> 'reported_cap_rate_percent', '') is null then null else (import_row ->> 'reported_cap_rate_percent')::numeric / 100 end,
      nullif(import_row ->> 'reported_noi', '')::numeric,
      case when building_size is null then null else round(sale_amount / building_size, 2) end,
      coalesce(nullif(import_row ->> 'transaction_type', ''), 'Asset Sale'), nullif(import_row ->> 'notes', ''),
      normalized_status, nullif(import_row ->> 'date_verified', '')::date, coalesce((import_row ->> 'is_sample')::boolean, false)
    );
    imported_count := imported_count + 1;
  end loop;

  return jsonb_build_object('imported', imported_count);
end;
$$;

revoke all on function public.import_property_transactions(jsonb) from public;
grant execute on function public.import_property_transactions(jsonb) to authenticated;

comment on table public.admin_profiles is 'Explicit role allowlist for protected administration.';
comment on table public.audit_log is 'Immutable edit history populated by database triggers.';
comment on function public.import_property_transactions is 'Atomic, role-checked import of validated property and transaction rows.';
