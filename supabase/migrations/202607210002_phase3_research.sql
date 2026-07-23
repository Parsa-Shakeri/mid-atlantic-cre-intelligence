-- Phase 3 research publication fields and controlled categories.

alter table public.articles
  add column executive_summary text[] not null default '{}',
  add column limitations text[] not null default '{}',
  add column exhibit jsonb;

alter table public.articles
  add constraint articles_category_check check (category in (
    'Market Reports', 'Deal Breakdowns', 'Property Sector Analysis',
    'Interest Rates and Financing', 'Local Development',
    'Retail and Tenant Analysis', 'Educational Explainers'
  )) not valid;

alter table public.articles
  add constraint articles_published_fields_check check (
    status <> 'published'
    or (publication_date is not null and char_length(executive_summary::text) > 2 and char_length(body) > 100)
  ) not valid;

create index articles_publication_idx on public.articles (publication_date desc) where status = 'published';
create index articles_category_idx on public.articles (category, publication_date desc) where status = 'published';
create index article_properties_property_idx on public.article_properties (property_id);

comment on column public.articles.body is 'Markdown article body rendered by the public research pages.';
comment on column public.articles.exhibit is 'Optional accessible table exhibit with title, description, columns, rows, and note.';
