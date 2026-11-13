create table public.service_orders (
  id uuid primary key,
  service text not null check (service in ('website-design','video-editing','excel','social-design')),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  answers jsonb not null check (jsonb_typeof(answers) = 'array' and jsonb_array_length(answers) between 5 and 20 and octet_length(answers::text) <= 65536),
  status text not null default 'new' check (status in ('new','reviewing','in_progress','completed','closed')),
  created_at timestamptz not null default now(),
  source_hash text not null check (source_hash ~ '^[0-9a-f]{64}$')
);
create index service_orders_created_idx on public.service_orders (created_at desc);
create index service_orders_source_idx on public.service_orders (source_hash, created_at);
alter table public.service_orders enable row level security;
revoke all on public.service_orders from public, anon, authenticated;
grant select (id, service, name, email, answers, status, created_at), update (status) on public.service_orders to authenticated;
create policy service_orders_admin_read on public.service_orders for select to authenticated
using (exists (select 1 from public.cms_admins where user_id = (select auth.uid())));
create policy service_orders_admin_status on public.service_orders for update to authenticated
using (exists (select 1 from public.cms_admins where user_id = (select auth.uid())))
with check (exists (select 1 from public.cms_admins where user_id = (select auth.uid())));

create function public.submit_service_order(
  intake_key text, order_id uuid, service_slug text, customer_name text, customer_email text,
  order_answers jsonb, client_hash text
) returns uuid
language plpgsql security definer set search_path = ''
as $$
begin
  if intake_key is null or length(intake_key) <> 64 or
    encode(sha256(convert_to(intake_key, 'UTF8')), 'hex') <> '02b9340699576e063c9e1b6af07a33ee0a7f4c82effc58a6635d6705b8427f44' then
    raise insufficient_privilege;
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(client_hash, 0));
  if exists (select 1 from public.service_orders where id = order_id and service = service_slug and email = customer_email and answers = order_answers) then
    return order_id;
  end if;
  if (select count(*) from public.service_orders where source_hash = client_hash and created_at >= now() - interval '1 hour') >= 8 then
    raise exception using errcode = 'PT429', message = 'Rate limit exceeded';
  end if;
  insert into public.service_orders (id, service, name, email, answers, source_hash)
    values (order_id, service_slug, customer_name, customer_email, order_answers, client_hash);
  return order_id;
end;
$$;
revoke all on function public.submit_service_order(text,uuid,text,text,text,jsonb,text) from public, anon, authenticated;
grant execute on function public.submit_service_order(text,uuid,text,text,text,jsonb,text) to anon;
