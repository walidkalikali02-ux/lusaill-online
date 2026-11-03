create schema heatmap_private;
revoke all on schema heatmap_private from public;
grant usage on schema heatmap_private to anon,authenticated;
create table heatmap_private.settings(
 id boolean primary key default true check(id),enabled boolean not null default false,
 daily_cap integer not null default 5000 check(daily_cap between 100 and 20000),
 key_hashes text[] not null default '{}',last_cleanup timestamptz not null default now()
);
insert into heatmap_private.settings(id) values(true);
create table heatmap_private.views(
 id uuid primary key,path text not null check(length(path)<=250),version text not null check(length(version)<=40),
 width integer not null check(width between 280 and 3000),device text not null check(device in('mobile','tablet','desktop')),is_test boolean not null,
 height integer not null,viewport_height integer not null,scroll integer not null,seconds integer not null,
 clicks jsonb not null,attention jsonb not null,sequence integer not null,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index heatmap_views_filter on heatmap_private.views(is_test,created_at,path,device,version,width);
create table heatmap_private.budgets(day date primary key,views integer not null default 0,updates integer not null default 0);
create table heatmap_private.activity(id bigint generated always as identity primary key,actor uuid not null,enabled boolean not null,daily_cap integer not null,created_at timestamptz not null default now());
alter table heatmap_private.settings enable row level security;
alter table heatmap_private.views enable row level security;
alter table heatmap_private.budgets enable row level security;
alter table heatmap_private.activity enable row level security;
revoke all on all tables in schema heatmap_private from public,anon,authenticated;

create function heatmap_private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from public.cms_admins where user_id=auth.uid())
$$;
revoke all on function heatmap_private.is_admin() from public,anon,authenticated;

create function heatmap_private.config() returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('enabled',enabled,'retentionDays',14) from heatmap_private.settings where id
$$;
revoke all on function heatmap_private.config() from public;grant execute on function heatmap_private.config() to anon,authenticated;
create function public.heatmap_config() returns jsonb language sql security invoker set search_path='' as $$select heatmap_private.config()$$;
revoke all on function public.heatmap_config() from public;grant execute on function public.heatmap_config() to anon,authenticated;

create function heatmap_private.purge(app_key text) returns bigint language plpgsql security definer set search_path='' as $$
declare n bigint;
begin
 if not exists(select 1 from heatmap_private.settings where encode(sha256(convert_to(app_key,'UTF8')),'hex')=any(key_hashes)) then raise exception 'FORBIDDEN';end if;
 delete from heatmap_private.views where created_at<now()-interval '14 days';get diagnostics n=row_count;
 delete from heatmap_private.budgets where day<current_date-14;
 update heatmap_private.settings set last_cleanup=now() where id;
 return n;
end$$;
revoke all on function heatmap_private.purge(text) from public;grant execute on function heatmap_private.purge(text) to anon,authenticated;
create function public.heatmap_purge(app_key text) returns bigint language sql security invoker set search_path='' as $$select heatmap_private.purge(app_key)$$;
revoke all on function public.heatmap_purge(text) from public;grant execute on function public.heatmap_purge(text) to anon,authenticated;

create function heatmap_private.accept(app_key text,payload jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare cfg heatmap_private.settings;prior heatmap_private.views;v_id uuid;seq integer;test boolean;w integer;cell jsonb;a jsonb;total integer:=0;att numeric:=0;n integer;
begin
 select * into cfg from heatmap_private.settings where id;
 if not encode(sha256(convert_to(coalesce(app_key,''),'UTF8')),'hex')=any(cfg.key_hashes) then raise exception 'FORBIDDEN';end if;
 if octet_length(payload::text)>16000 then raise exception 'INVALID_DATA';end if;
 v_id=(payload->>'id')::uuid;seq=(payload->>'sequence')::int;test=(payload->>'test')::boolean;w=(payload->>'width')::int;
 if v_id is null or seq not between 1 and 256 or test is null or w not between 280 and 3000 or coalesce(payload->>'path','') !~ '^/((articles|categories|guides|entities|courses)(/[[:alnum:]_-]+){0,4})?$' or length(payload->>'path')>250 or coalesce(payload->>'version','') !~ '^[-a-zA-Z0-9]{1,40}$' then raise exception 'INVALID_DATA';end if;
 if not cfg.enabled and not test then return jsonb_build_object('accepted',false,'reason','paused');end if;
 if jsonb_typeof(payload->'clicks')<>'array' or jsonb_array_length(payload->'clicks')>100 or jsonb_typeof(payload->'attention')<>'array' or jsonb_array_length(payload->'attention')<>20 or (payload->>'height')::int not between 200 and 150000 or (payload->>'viewportHeight')::int not between 200 and 3000 or (payload->>'scroll')::int not between 0 and 100 or (payload->>'seconds')::int not between 0 and 1800 then raise exception 'INVALID_DATA';end if;
 for cell in select value from jsonb_array_elements(payload->'clicks') loop
  if (cell->>'x')::int not between 0 and 63 or (cell->>'y')::int not between 0 and 99 or (cell->>'n')::int not between 1 and 200 then raise exception 'INVALID_DATA';end if;total=total+(cell->>'n')::int;
 end loop;
 if total>200 or (select count(distinct ((c->>'x')||':'||(c->>'y'))) from jsonb_array_elements(payload->'clicks')c)<>jsonb_array_length(payload->'clicks') then raise exception 'INVALID_DATA';end if;
 for a in select value from jsonb_array_elements(payload->'attention') loop if a::numeric<0 or a::numeric>1800 then raise exception 'INVALID_DATA';end if;att=att+a::numeric;end loop;
 if att>(payload->>'seconds')::int+1 then raise exception 'INVALID_DATA';end if;
 -- A lock per ephemeral page-view keeps sequence replay and cumulative updates atomic.
 perform pg_advisory_xact_lock(hashtextextended(v_id::text,0));
 select * into prior from heatmap_private.views where id=v_id;
 if found then
  if prior.path<>payload->>'path' or prior.width<>w or prior.version<>payload->>'version' or prior.is_test<>test then raise exception 'INVALID_DATA';end if;
  if seq<=prior.sequence then return jsonb_build_object('accepted',true,'replayed',true);end if;
  if prior.created_at<now()-interval '31 minutes' or (payload->>'scroll')::int<prior.scroll or (payload->>'seconds')::int<prior.seconds then raise exception 'INVALID_DATA';end if;
  for cell in select value from jsonb_array_elements(prior.clicks) loop
   if not exists(select 1 from jsonb_array_elements(payload->'clicks')c where c->>'x'=cell->>'x' and c->>'y'=cell->>'y' and (c->>'n')::int>=(cell->>'n')::int) then raise exception 'INVALID_DATA';end if;
  end loop;
  for n in 0..19 loop if (payload->'attention'->>n)::numeric<(prior.attention->>n)::numeric then raise exception 'INVALID_DATA';end if;end loop;
 end if;
 insert into heatmap_private.budgets(day) values(current_date) on conflict do nothing;
 update heatmap_private.budgets set updates=updates+1,views=views+case when prior.id is null and not test then 1 else 0 end
 where day=current_date and updates<200000 and (test or prior.id is not null or views<cfg.daily_cap);
 if not found then return jsonb_build_object('accepted',false,'reason','daily_cap');end if;
 insert into heatmap_private.views(id,path,version,width,device,is_test,height,viewport_height,scroll,seconds,clicks,attention,sequence)
 values(v_id,payload->>'path',payload->>'version',w,case when w<768 then 'mobile' when w<1024 then 'tablet' else 'desktop' end,test,(payload->>'height')::int,(payload->>'viewportHeight')::int,(payload->>'scroll')::int,(payload->>'seconds')::int,payload->'clicks',payload->'attention',seq)
 on conflict(id) do update set height=excluded.height,viewport_height=excluded.viewport_height,scroll=excluded.scroll,seconds=excluded.seconds,clicks=excluded.clicks,attention=excluded.attention,sequence=excluded.sequence,updated_at=now();
 if cfg.last_cleanup<now()-interval '1 day' then perform heatmap_private.purge(app_key);end if;
 return jsonb_build_object('accepted',true);
end$$;
revoke all on function heatmap_private.accept(text,jsonb) from public;grant execute on function heatmap_private.accept(text,jsonb) to anon,authenticated;
create function public.heatmap_accept(app_key text,payload jsonb) returns jsonb language sql security invoker set search_path='' as $$select heatmap_private.accept(app_key,payload)$$;
revoke all on function public.heatmap_accept(text,jsonb) from public;grant execute on function public.heatmap_accept(text,jsonb) to anon,authenticated;

create function heatmap_private.configure(value jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if not heatmap_private.is_admin() then raise exception 'FORBIDDEN';end if;
 if (value->>'dailyCap')::int not between 100 and 20000 or jsonb_typeof(value->'enabled')<>'boolean' then raise exception 'INVALID_DATA';end if;
 update heatmap_private.settings set enabled=(value->>'enabled')::boolean,daily_cap=(value->>'dailyCap')::int where id;
 insert into heatmap_private.activity(actor,enabled,daily_cap) values(auth.uid(),(value->>'enabled')::boolean,(value->>'dailyCap')::int);
 return heatmap_private.config();
end$$;
revoke all on function heatmap_private.configure(jsonb) from public,anon;grant execute on function heatmap_private.configure(jsonb) to authenticated;
create function public.heatmap_configure(value jsonb) returns jsonb language sql security invoker set search_path='' as $$select heatmap_private.configure(value)$$;
revoke all on function public.heatmap_configure(jsonb) from public,anon;grant execute on function public.heatmap_configure(jsonb) to authenticated;

create function heatmap_private.report(filters jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;f date:=(filters->>'from')::date;t date:=(filters->>'to')::date;test boolean:=coalesce((filters->>'test')::boolean,false);d text:=coalesce(filters->>'device','all');p text:=coalesce(filters->>'path','/');v text;w integer;
begin
 if not heatmap_private.is_admin() then raise exception 'FORBIDDEN';end if;
 if f is null or t is null or f>t or t-f>14 or f<current_date-14 or t>current_date or d not in('all','mobile','tablet','desktop') then raise exception 'INVALID_DATA';end if;
 delete from heatmap_private.views where created_at<now()-interval '14 days';
 select coalesce(nullif(filters->>'version',''),(select version from heatmap_private.views where path=p and is_test=test and created_at>=f and created_at<t+1 and (d='all' or device=d) order by created_at desc limit 1)) into v;
 select coalesce(nullif(filters->>'width','')::int,(select width from heatmap_private.views where path=p and version=v and is_test=test and created_at>=f and created_at<t+1 and (d='all' or device=d) group by width order by count(*) desc,width limit 1),case d when 'desktop' then 1280 when 'tablet' then 820 else 390 end) into w;
 with all_views as materialized(select * from heatmap_private.views where created_at>=f and created_at<t+1 and is_test=test and (d='all' or device=d)),selected as materialized(select * from all_views where path=p and version=v and width=w)
 select jsonb_build_object(
  'settings',(select jsonb_build_object('enabled',enabled,'dailyCap',daily_cap,'retentionDays',14,'lastCleanup',last_cleanup) from heatmap_private.settings where id),
  'usage',(select jsonb_build_object('views',coalesce(max(views),0),'updates',coalesce(max(updates),0)) from heatmap_private.budgets where day=current_date),
  'totals',(select jsonb_build_object('views',count(*),'clicks',coalesce(sum((select sum((c->>'n')::int) from jsonb_array_elements(clicks)c)),0),'seconds',coalesce(sum(seconds),0),'averageScroll',coalesce(avg(scroll),0)) from all_views),
  'pages',(select coalesce(jsonb_agg(row),'[]') from(select path,count(*) views,coalesce(sum((select sum((c->>'n')::int) from jsonb_array_elements(clicks)c)),0) clicks,round(avg(scroll),1) scroll from all_views group by path order by count(*) desc,path limit 200)row),
  'versions',(select coalesce(jsonb_agg(row),'[]') from(select version,count(*) views from all_views where path=p group by version order by max(created_at) desc)row),
  'widths',(select coalesce(jsonb_agg(row),'[]') from(select width,count(*) views from all_views where path=p and version=v group by width order by count(*) desc,width)row),
  'selected',jsonb_build_object('path',p,'version',v,'width',w,'views',(select count(*) from selected),'height',(select coalesce(round(avg(height)),2000) from selected),'averageViewportHeight',(select coalesce(round(avg(viewport_height)),800) from selected),'averageScroll',(select coalesce(round(avg(scroll),1),0) from selected),'seconds',(select coalesce(sum(seconds),0) from selected),
   'clicks',(select coalesce(jsonb_agg(row),'[]') from(select (c->>'x')::int x,(c->>'y')::int y,sum((c->>'n')::int) n from selected,jsonb_array_elements(clicks)c group by c->>'x',c->>'y')row),
   'reaches',(select jsonb_agg(n order by band) from(select band,(select count(*) from selected where scroll>=band*5)n from generate_series(0,19)band)q),
   'attention',(select jsonb_agg(n order by band) from(select band,(select coalesce(sum((attention->>band)::numeric),0) from selected)n from generate_series(0,19)band)q)
  )) into result;
 return result;
end$$;
revoke all on function heatmap_private.report(jsonb) from public,anon;grant execute on function heatmap_private.report(jsonb) to authenticated;
create function public.heatmap_report(filters jsonb) returns jsonb language sql security invoker set search_path='' as $$select heatmap_private.report(filters)$$;
revoke all on function public.heatmap_report(jsonb) from public,anon;grant execute on function public.heatmap_report(jsonb) to authenticated;
