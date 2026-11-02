-- Staged editor integration. Existing cms_save is retained until the release cutover migration.
alter table public.content_items add column cms_document_id uuid unique references public.cms_documents(id);
alter table public.content_items add column approved_document_hash text;
alter table public.content_items add column approved_by uuid references auth.users(id);

create function content_ops_private.document_hash(document jsonb) returns text
language sql immutable security invoker set search_path='' as $$
 select md5((document-array['version','updatedAt','status','scheduledAt','editorialOverrideReason','operationsItemId'])::text)
$$;
revoke all on function content_ops_private.document_hash(jsonb) from public,anon,authenticated;

create function content_ops_private.check_publication(item uuid,document jsonb) returns void
language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from public.content_reviews where item_id=item and data->>'result'='pass') then raise exception 'REVIEW_REQUIRED'; end if;
 if exists(select 1 from public.content_reviews where item_id=item and data->>'severity'='critical' and coalesce(data->>'result','fail')<>'pass') then raise exception 'CRITICAL_REVIEW'; end if;
 if exists(select 1 from public.source_claims where item_id=item and (coalesce(data->>'status','pending')<>'verified' or nullif(data->>'expiresAt','')::date<current_date)) then raise exception 'UNVERIFIED_CLAIMS'; end if;
 if nullif(trim(document->>'answer'),'') is null or nullif(document->>'reviewedAt','') is null or coalesce(document->>'category','') !~ '^[A-H]$' then raise exception 'PUBLICATION_INCOMPLETE'; end if;
 if coalesce(jsonb_typeof(document->'sources'),'null')<>'array' then raise exception 'SOURCE_NOT_VERIFIED'; end if;
 if jsonb_array_length(document->'sources')=0 or exists(select 1 from jsonb_array_elements(document->'sources') s where coalesce(s->>'url','') !~ '^https://' or nullif(s->>'checkedAt','') is null or (s->>'checkedAt')::timestamptz>now() or nullif(s->>'expiresAt','')::timestamptz<now()) then raise exception 'SOURCE_NOT_VERIFIED'; end if;
 if document->>'status'='scheduled' and (nullif(document->>'scheduledAt','') is null or (document->>'scheduledAt')::timestamptz<=now()) then raise exception 'SCHEDULE_INVALID'; end if;
end $$;
revoke all on function content_ops_private.check_publication(uuid,jsonb) from public,anon,authenticated;

create function content_ops_private.stamp_approval() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if new.data->>'stage'='ready' and old.data->>'stage' is distinct from 'ready' then
 select content_ops_private.document_hash(document) into new.approved_document_hash from public.cms_documents where id=new.cms_document_id;
 new.approved_by:=auth.uid();
 elsif new.data->>'stage'<>'ready' then new.approved_document_hash:=null;new.approved_by:=null;
 end if;
 return new;
end $$;
revoke all on function content_ops_private.stamp_approval() from public,anon,authenticated;
create trigger ops_stamp_approval before update on public.content_items for each row execute function content_ops_private.stamp_approval();

create or replace function content_ops_private.ops_cms_save(payload jsonb, expected_version integer)
returns jsonb language plpgsql security definer set search_path='' as $$
declare current_version integer; next_version integer; next_doc jsonb; public_doc jsonb; previous_public jsonb; row_id uuid := (payload->>'id')::uuid;
 operation public.content_items; staff_role text:=public.ops_role(); operation_id uuid:=nullif(payload->>'operationsItemId','')::uuid;
begin
 if staff_role is null or staff_role not in ('admin','editor','writer','publisher') then raise exception 'FORBIDDEN'; end if;
 if expected_version is null or expected_version<0 then raise exception 'VERSION_CONFLICT'; end if;
 if operation_id is not null then
 select * into operation from public.content_items where id=operation_id for update;
 if not found then raise exception 'NOT_FOUND'; end if;
 else
 select * into operation from public.content_items where cms_document_id=row_id or data->>'publicPath'='/articles/'||(payload->>'slug') for update;
 end if;
 if operation.id is null then
 if staff_role<>'admin' or nullif(trim(payload->>'editorialOverrideReason'),'') is null then raise exception 'OPERATIONS_REQUIRED'; end if;
 else
 if operation.data->>'kind'<>'article' then raise exception 'UNSUPPORTED_EDITOR_TYPE'; end if;
 if operation.cms_document_id is not null and operation.cms_document_id<>row_id then raise exception 'DOCUMENT_LINK_CONFLICT'; end if;
 if staff_role='writer' and (operation.data->>'ownerId' is distinct from auth.uid()::text or operation.data->>'stage'<>'drafting') then raise exception 'FORBIDDEN'; end if;
 if array_position(array['drafting','editorial','fact_check','visual_seo','final_approval','ready'],operation.data->>'stage') is null then raise exception 'BRIEF_REQUIRED'; end if;
 if not exists(select 1 from public.content_briefs where item_id=operation.id and data->>'status'='approved') then raise exception 'BRIEF_REQUIRED'; end if;
 if not exists(select 1 from public.content_outlines where item_id=operation.id and data->>'status'='approved') then raise exception 'OUTLINE_REQUIRED'; end if;
 end if;
 if staff_role='writer' and coalesce(payload->>'status','draft') not in ('draft','verification') then raise exception 'FORBIDDEN'; end if;
 if payload->>'status' in ('published','scheduled') then
 if operation.id is null or operation.data->>'stage'<>'ready' then raise exception 'OPERATIONS_NOT_READY'; end if;
 if staff_role not in ('admin','editor','publisher') then raise exception 'FORBIDDEN'; end if;
 if operation.approved_document_hash is distinct from content_ops_private.document_hash(payload) then raise exception 'APPROVAL_STALE'; end if;
 perform content_ops_private.check_publication(operation.id,payload);
 end if;
 if payload->>'status'='archived' and staff_role not in ('admin','editor','publisher') then raise exception 'FORBIDDEN'; end if;
 perform pg_advisory_xact_lock(hashtextextended('cms-publish-quota',0));
 perform pg_advisory_xact_lock(hashtextextended(row_id::text,0));
 select version into current_version from public.cms_documents where id=row_id for update;
 if coalesce(current_version,0) <> expected_version then raise exception 'VERSION_CONFLICT'; end if;
 if exists(select 1 from public.cms_publications where id=row_id and slug<>payload->>'slug') then raise exception 'PUBLISHED_SLUG_IMMUTABLE'; end if;
 if staff_role='publisher' and (payload->>'status' not in ('published','scheduled','archived') or not exists(select 1 from public.cms_documents where id=row_id and content_ops_private.document_hash(document)=content_ops_private.document_hash(payload))) then raise exception 'FORBIDDEN'; end if;
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
 if operation.id is not null then
 update public.content_items set cms_document_id=row_id where id=operation.id and cms_document_id is null;
 if payload->>'status' not in ('published','scheduled','archived') and operation.data->>'stage'='ready' and operation.approved_document_hash is distinct from content_ops_private.document_hash(payload) then
 update public.content_items set data=data||jsonb_build_object('stage','editorial','stageEnteredAt',now(),'transitionReason','Draft changed after approval'),version=version+1,updated_at=now() where id=operation.id;
 end if;
 end if;
 insert into public.content_activity_log(item_id,entity,record_id,actor,action,before_data,after_data)
 values(operation.id,'cms_documents',row_id,auth.uid(),case when operation.id is null then 'admin_draft_override' else 'save_'||(payload->>'status') end,null,jsonb_build_object('version',next_version,'reason',payload->>'editorialOverrideReason'));
 return next_doc;
end $$;

revoke all on function content_ops_private.ops_cms_save(jsonb,integer) from public,anon;
grant execute on function content_ops_private.ops_cms_save(jsonb,integer) to authenticated;
create function public.ops_cms_save(payload jsonb,expected_version integer) returns jsonb
language sql security invoker set search_path='' as $$select content_ops_private.ops_cms_save(payload,expected_version)$$;
revoke all on function public.ops_cms_save(jsonb,integer) from public,anon;
grant execute on function public.ops_cms_save(jsonb,integer) to authenticated;

create policy ops_documents_read on public.cms_documents for select to authenticated using (
 exists(select 1 from public.content_items i where i.cms_document_id=cms_documents.id and (select public.ops_role()) is not null and ((select public.ops_role())<>'writer' or i.data->>'ownerId'=(select auth.uid())::text))
);
create policy ops_revisions_read on public.cms_revisions for select to authenticated using (
 exists(select 1 from public.content_items i where i.cms_document_id=cms_revisions.document_id and (select public.ops_role()) is not null and ((select public.ops_role())<>'writer' or i.data->>'ownerId'=(select auth.uid())::text))
);
