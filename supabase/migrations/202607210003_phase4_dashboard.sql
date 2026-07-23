-- Phase 4 server-side dashboard aggregation.
-- Returns only aggregate series and bounded tables, never the full transaction database.

create or replace function public.get_market_dashboard(
  filter_date_from date default null,
  filter_date_to date default null,
  filter_state text default null,
  filter_county text default null,
  filter_city text default null,
  filter_property_type text default null
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with all_records as (
    select * from public.property_transaction_records
  ),
  filtered as (
    select *
    from all_records
    where (filter_date_from is null or sale_date >= filter_date_from)
      and (filter_date_to is null or sale_date <= filter_date_to)
      and (filter_state is null or state = filter_state)
      and (filter_county is null or county = filter_county)
      and (filter_city is null or city = filter_city)
      and (filter_property_type is null or property_type::text = filter_property_type)
  ),
  metric_values as (
    select
      count(*)::integer as transaction_count,
      coalesce(sum(sale_price), 0)::numeric as total_sales_volume,
      percentile_cont(0.5) within group (order by sale_price)::numeric as median_sale_price,
      percentile_cont(0.5) within group (order by price_per_sq_ft) filter (where price_per_sq_ft is not null)::numeric as median_price_per_sq_ft,
      case when count(reported_cap_rate) >= 3 then percentile_cont(0.5) within group (order by reported_cap_rate) filter (where reported_cap_rate is not null)::numeric else null end as median_reported_cap_rate,
      avg(building_sq_ft) filter (where building_sq_ft is not null)::numeric as average_building_size,
      count(price_per_sq_ft)::integer as price_per_sq_ft_sample_size,
      count(reported_cap_rate)::integer as cap_rate_sample_size,
      count(building_sq_ft)::integer as building_size_sample_size
    from filtered
  ),
  time_series as (
    select to_char(date_trunc('month', sale_date), 'YYYY-MM') as period,
      to_char(date_trunc('month', sale_date), 'Mon YY') as label,
      count(*)::integer as transaction_count,
      sum(sale_price)::numeric as sales_volume
    from filtered
    group by date_trunc('month', sale_date)
    order by date_trunc('month', sale_date)
  ),
  property_type_series as (
    select property_type::text as property_type, sum(sale_price)::numeric as sales_volume, count(*)::integer as transaction_count
    from filtered group by property_type order by sum(sale_price) desc
  ),
  market_series as (
    select concat(city, ', ', state) as market,
      percentile_cont(0.5) within group (order by price_per_sq_ft)::numeric as median_price_per_sq_ft,
      count(price_per_sq_ft)::integer as sample_size
    from filtered where price_per_sq_ft is not null
    group by city, state order by percentile_cont(0.5) within group (order by price_per_sq_ft) desc
  ),
  market_comparison as (
    select concat(city, ', ', state) as market,
      count(*)::integer as transaction_count,
      sum(sale_price)::numeric as total_sales_volume,
      percentile_cont(0.5) within group (order by sale_price)::numeric as median_sale_price,
      percentile_cont(0.5) within group (order by price_per_sq_ft) filter (where price_per_sq_ft is not null)::numeric as median_price_per_sq_ft,
      count(price_per_sq_ft)::integer as price_per_sq_ft_sample_size,
      case when count(reported_cap_rate) >= 3 then percentile_cont(0.5) within group (order by reported_cap_rate) filter (where reported_cap_rate is not null)::numeric else null end as median_reported_cap_rate,
      count(reported_cap_rate)::integer as cap_rate_sample_size,
      avg(building_sq_ft) filter (where building_sq_ft is not null)::numeric as average_building_size
    from filtered group by city, state order by sum(sale_price) desc
  ),
  largest_transactions as (
    select slug, property_name, concat(city, ', ', state) as market, property_type::text as property_type,
      sale_date::text, sale_price, verification_status::text, is_sample
    from filtered order by sale_price desc limit 10
  ),
  filter_options as (
    select jsonb_build_object(
      'states', coalesce((select jsonb_agg(state order by state) from (select distinct state from all_records where state is not null) s), '[]'::jsonb),
      'counties', coalesce((select jsonb_agg(county order by county) from (select distinct county from all_records where county is not null) c), '[]'::jsonb),
      'cities', coalesce((select jsonb_agg(city order by city) from (select distinct city from all_records where city is not null) c), '[]'::jsonb),
      'property_types', coalesce((select jsonb_agg(property_type order by property_type) from (select distinct property_type::text as property_type from all_records where property_type is not null) p), '[]'::jsonb)
    ) as value
  )
  select jsonb_build_object(
    'contains_only_samples', coalesce((select bool_and(is_sample) from filtered), false),
    'filter_options', (select value from filter_options),
    'metrics', (select to_jsonb(metric_values) from metric_values),
    'transaction_count_over_time', coalesce((select jsonb_agg(to_jsonb(time_series) order by period) from time_series), '[]'::jsonb),
    'sales_volume_by_property_type', coalesce((select jsonb_agg(to_jsonb(property_type_series) order by sales_volume desc) from property_type_series), '[]'::jsonb),
    'median_price_per_sq_ft_by_market', coalesce((select jsonb_agg(to_jsonb(market_series) order by median_price_per_sq_ft desc) from market_series), '[]'::jsonb),
    'cap_rate_distribution', case when (select cap_rate_sample_size from metric_values) < 3 then '[]'::jsonb else jsonb_build_array(
      jsonb_build_object('label', '<5%', 'count', (select count(*) from filtered where reported_cap_rate < 0.05)),
      jsonb_build_object('label', '5–5.99%', 'count', (select count(*) from filtered where reported_cap_rate >= 0.05 and reported_cap_rate < 0.06)),
      jsonb_build_object('label', '6–6.99%', 'count', (select count(*) from filtered where reported_cap_rate >= 0.06 and reported_cap_rate < 0.07)),
      jsonb_build_object('label', '7–7.99%', 'count', (select count(*) from filtered where reported_cap_rate >= 0.07 and reported_cap_rate < 0.08)),
      jsonb_build_object('label', '8%+', 'count', (select count(*) from filtered where reported_cap_rate >= 0.08))
    ) end,
    'largest_transactions', coalesce((select jsonb_agg(to_jsonb(largest_transactions) order by sale_price desc) from largest_transactions), '[]'::jsonb),
    'market_comparison', coalesce((select jsonb_agg(to_jsonb(market_comparison) order by total_sales_volume desc) from market_comparison), '[]'::jsonb)
  );
$$;

grant execute on function public.get_market_dashboard(date, date, text, text, text, text) to anon, authenticated;

comment on function public.get_market_dashboard is 'Filtered market-dashboard aggregates with small-sample suppression for cap rates.';
