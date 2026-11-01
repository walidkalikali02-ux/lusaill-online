-- Run in the dedicated Lusaill Supabase project's SQL editor, never the store project.
create table if not exists public.cms_admins (
 singleton boolean primary key default true check(singleton),
 user_id uuid not null unique references auth.users(id)
);
alter table public.cms_admins enable row level security;
create policy admin_self on public.cms_admins for select to authenticated using(user_id=auth.uid());
grant select on public.cms_admins to authenticated;

create table public.cms_documents (
 id uuid primary key, slug text unique not null,
 document jsonb not null, version integer not null default 1,
 updated_at timestamptz not null default now()
);
create table public.cms_revisions (
 id bigint generated always as identity primary key,
 document_id uuid not null references public.cms_documents(id),
 document jsonb not null, version integer not null,
 created_at timestamptz not null default now(), actor uuid,
 unique(document_id,version)
);
create table public.cms_publications (
 id uuid primary key references public.cms_documents(id),
 slug text unique not null, document jsonb not null,
 published_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.cms_documents enable row level security;
alter table public.cms_revisions enable row level security;
alter table public.cms_publications enable row level security;
create policy admin_documents on public.cms_documents for all to authenticated
 using(exists(select 1 from public.cms_admins where user_id=auth.uid()))
 with check(exists(select 1 from public.cms_admins where user_id=auth.uid()));
create policy admin_revisions_read on public.cms_revisions for select to authenticated
 using(exists(select 1 from public.cms_admins where user_id=auth.uid()));
create policy admin_revisions_insert on public.cms_revisions for insert to authenticated
 with check(actor=auth.uid() and exists(select 1 from public.cms_admins where user_id=auth.uid()));
create policy public_publications on public.cms_publications for select to anon,authenticated using(true);
create policy admin_publications on public.cms_publications for all to authenticated
 using(exists(select 1 from public.cms_admins where user_id=auth.uid()))
 with check(exists(select 1 from public.cms_admins where user_id=auth.uid()));
grant select,insert,update on public.cms_documents to authenticated;
grant select,insert on public.cms_revisions to authenticated;
grant usage,select on sequence public.cms_revisions_id_seq to authenticated;
grant select on public.cms_publications to anon;
grant select,insert,update,delete on public.cms_publications to authenticated;

create or replace function public.cms_save(payload jsonb, expected_version integer)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare current_version integer; next_version integer; next_doc jsonb; public_doc jsonb; previous_public jsonb; row_id uuid := (payload->>'id')::uuid;
begin
 if not exists(select 1 from public.cms_admins where user_id=auth.uid()) then raise exception 'FORBIDDEN'; end if;
 perform pg_advisory_xact_lock(hashtextextended('cms-publish-quota',0));
 perform pg_advisory_xact_lock(hashtextextended(row_id::text,0));
 select version into current_version from public.cms_documents where id=row_id for update;
 if coalesce(current_version,0) <> expected_version then raise exception 'VERSION_CONFLICT'; end if;
 if exists(select 1 from public.cms_publications where id=row_id and slug<>payload->>'slug') then raise exception 'PUBLISHED_SLUG_IMMUTABLE'; end if;
 next_version := coalesce(current_version,0)+1;
 next_doc := payload || jsonb_build_object('version',next_version,'updatedAt',now());
 insert into public.cms_documents(id,slug,document,version) values(row_id,payload->>'slug',next_doc,next_version)
 on conflict(id) do update set slug=excluded.slug,document=excluded.document,version=excluded.version,updated_at=now();
 insert into public.cms_revisions(document_id,document,version,actor) values(row_id,next_doc,next_version,auth.uid());
 if payload->>'status'='published' then
   if not exists(select 1 from public.cms_publications where id=row_id) and (select count(*) from public.cms_publications where document->>'status'='published' and (published_at at time zone 'Asia/Qatar')::date=(now() at time zone 'Asia/Qatar')::date)>=20 then raise exception 'DAILY_LIMIT'; end if;
   select document into previous_public from public.cms_publications where id=row_id;
   public_doc:=case when previous_public - array['version','updatedAt','status','scheduledAt'] = next_doc - array['version','updatedAt','status','scheduledAt'] then previous_public else next_doc end;
   insert into public.cms_publications(id,slug,document) values(row_id,payload->>'slug',public_doc)
   on conflict(id) do update set slug=excluded.slug,document=excluded.document,updated_at=now();
 elsif payload->>'status'='archived' then
   insert into public.cms_publications(id,slug,document) values(row_id,payload->>'slug',jsonb_build_object('id',row_id,'slug',payload->>'slug','title','مقال مؤرشف','description','','author','','category','','status','archived','answer','','summary','[]'::jsonb,'body','{"type":"doc","content":[]}'::jsonb,'blocks','[]'::jsonb,'sources','[]'::jsonb,'reviewedAt','','scheduledAt','','deadline','','updatedAt',now(),'version',next_version))
   on conflict(id) do update set document=excluded.document,updated_at=now();
 end if;
 return next_doc;
end $$;
revoke all on function public.cms_save(jsonb,integer) from public;
grant execute on function public.cms_save(jsonb,integer) to authenticated;
-- Create your one admin in Authentication first, then run (replace UUID):
-- insert into public.cms_admins(user_id) values ('ADMIN_AUTH_USER_UUID');
-- Disable public signups in Supabase Auth settings. RLS still rejects all non-admin users.

-- Invoker function: only the server-side service role may execute it.
create or replace function public.cms_publish_due() returns integer
language plpgsql security invoker set search_path='' as $$
declare item record; n integer:=0; next_doc jsonb; public_doc jsonb; previous_public jsonb; published_today integer;
begin
 perform pg_advisory_xact_lock(hashtextextended('cms-publish-quota',0));
 select count(*) into published_today from public.cms_publications where document->>'status'='published' and (published_at at time zone 'Asia/Qatar')::date=(now() at time zone 'Asia/Qatar')::date;
 for item in select * from public.cms_documents where document->>'status'='scheduled' and (document->>'scheduledAt')::timestamptz<=now() order by updated_at for update skip locked loop
  exit when published_today>=20;
  if exists(select 1 from jsonb_array_elements(item.document->'sources') s where nullif(s->>'checkedAt','') is null or (nullif(s->>'expiresAt','')::timestamptz < now())) then continue; end if;
  next_doc:=item.document||jsonb_build_object('status','published','updatedAt',now(),'version',item.version+1);
  select document into previous_public from public.cms_publications where id=item.id;
  public_doc:=case when previous_public - array['version','updatedAt','status','scheduledAt'] = next_doc - array['version','updatedAt','status','scheduledAt'] then previous_public else next_doc end;
  insert into public.cms_publications(id,slug,document) values(item.id,item.slug,public_doc) on conflict(id) do update set document=excluded.document,updated_at=now();
  update public.cms_documents set document=next_doc,version=version+1,updated_at=now() where id=item.id;
  insert into public.cms_revisions(document_id,document,version,actor) values(item.id,next_doc,item.version+1,null);
  n:=n+1;published_today:=published_today+1;
 end loop;
 return n;
end $$;
revoke all on function public.cms_publish_due() from public,anon,authenticated;
grant execute on function public.cms_publish_due() to service_role;

grant select,insert,update on public.cms_documents,public.cms_publications to service_role;
grant insert,select on public.cms_revisions to service_role;
grant usage,select on sequence public.cms_revisions_id_seq to service_role;

create table public.cms_reports(id bigint generated always as identity primary key,report jsonb not null,created_at timestamptz not null default now());
alter table public.cms_reports enable row level security;
create policy admin_reports on public.cms_reports for all to authenticated using(exists(select 1 from public.cms_admins where user_id=auth.uid())) with check(exists(select 1 from public.cms_admins where user_id=auth.uid()));
grant select,insert on public.cms_reports to authenticated;
grant usage,select on sequence public.cms_reports_id_seq to authenticated;
