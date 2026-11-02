-- Additive editorial operations. No public article or Auth credential is changed.
create table public.ops_members (
 user_id uuid primary key references auth.users(id),
 role text not null check(role in ('strategist','writer','editor','fact_checker','publisher')),
 display_name text not null, active boolean not null default true
);
alter table public.ops_members enable row level security;

create function public.ops_role() returns text language sql stable security definer set search_path='' as $$
 select case when exists(select 1 from public.cms_admins where user_id=(select auth.uid())) then 'admin'
 else (select role from public.ops_members where user_id=(select auth.uid()) and active) end
$$;
revoke all on function public.ops_role() from public,anon;
grant execute on function public.ops_role() to authenticated;
create policy ops_members_read on public.ops_members for select to authenticated using ((select public.ops_role()) is not null);
revoke all on public.ops_members from anon,authenticated;
grant select on public.ops_members to authenticated;

create table public.content_items (
 id uuid primary key default gen_random_uuid(),
 data jsonb not null check(jsonb_typeof(data)='object'),
 version integer not null default 1, created_by uuid references auth.users(id),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index content_items_path on public.content_items((data->>'publicPath')) where nullif(data->>'publicPath','') is not null;

-- Separate records retain versions and real relationships; JSON holds evolving editorial fields.
do $$ declare t text; begin
 foreach t in array array['content_ideas','idea_evidence','topic_clusters','cluster_members','content_briefs','content_outlines','workflow_stages','workflow_tasks','content_reviews','source_claims','editorial_guidelines','content_assets','publishing_jobs','content_metrics_daily'] loop
 execute format('create table public.%I (id uuid primary key default gen_random_uuid(), item_id uuid references public.content_items(id), data jsonb not null check(jsonb_typeof(data)=''object''), version integer not null default 1, created_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now())',t);
 execute format('create index on public.%I(item_id,updated_at desc)',t);
 end loop;
end $$;
alter table public.idea_evidence add column idea_id uuid references public.content_ideas(id);
alter table public.cluster_members add column cluster_id uuid references public.topic_clusters(id);
create unique index cluster_members_unique on public.cluster_members(cluster_id,item_id);
create unique index publishing_job_key on public.publishing_jobs((data->>'idempotencyKey')) where nullif(data->>'idempotencyKey','') is not null;

create table public.content_activity_log (
 id bigint generated always as identity primary key,
 item_id uuid references public.content_items(id), entity text not null, record_id uuid not null,
 actor uuid references auth.users(id), action text not null,
 before_data jsonb, after_data jsonb, created_at timestamptz not null default now()
);
create index content_activity_item on public.content_activity_log(item_id,created_at desc);

do $$ declare t text; begin
 foreach t in array array['content_items','content_ideas','idea_evidence','topic_clusters','cluster_members','content_briefs','content_outlines','workflow_stages','workflow_tasks','content_reviews','source_claims','editorial_guidelines','content_assets','publishing_jobs','content_metrics_daily','content_activity_log'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from anon,authenticated',t);
 execute format('grant select on public.%I to authenticated',t);
 execute format('create policy ops_staff_read on public.%I for select to authenticated using ((select public.ops_role()) is not null)',t);
 end loop;
end $$;

create function public.ops_audit() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.content_activity_log(item_id,entity,record_id,actor,action,before_data,after_data)
 values(case when tg_table_name='content_items' then new.id else (to_jsonb(new)->>'item_id')::uuid end,
 tg_table_name,new.id,auth.uid(),lower(tg_op),case when tg_op='UPDATE' then to_jsonb(old) else null end,to_jsonb(new));
 return new;
end $$;
revoke all on function public.ops_audit() from public,anon,authenticated;
do $$ declare t text; begin
 foreach t in array array['content_items','content_ideas','idea_evidence','topic_clusters','cluster_members','content_briefs','content_outlines','workflow_stages','workflow_tasks','content_reviews','source_claims','editorial_guidelines','content_assets','publishing_jobs','content_metrics_daily'] loop
 execute format('create trigger ops_audit after insert or update on public.%I for each row execute function public.ops_audit()',t);
 end loop;
end $$;

create function public.ops_save(entity text,payload jsonb,expected_version integer) returns jsonb
language plpgsql security definer set search_path='' as $$
declare r text:=public.ops_role(); row_id uuid:=coalesce(nullif(payload->>'id','')::uuid,gen_random_uuid());
 oldrow jsonb; result jsonb; body jsonb:=payload->'data'; item uuid:=nullif(payload->>'item_id','')::uuid;
 permitted boolean;
begin
 if r is null then raise exception 'FORBIDDEN'; end if;
 if expected_version is null or expected_version<0 then raise exception 'VERSION_CONFLICT'; end if;
 if entity not in ('content_items','content_ideas','idea_evidence','topic_clusters','cluster_members','content_briefs','content_outlines','workflow_tasks','content_reviews','source_claims','editorial_guidelines','content_assets') then raise exception 'INVALID_ENTITY'; end if;
 if body is null or jsonb_typeof(body)<>'object' or length(body::text)>100000 then raise exception 'INVALID_DATA'; end if;
 permitted:=r='admin' or case
 when entity in ('content_reviews','source_claims') then r in ('fact_checker','editor')
 when entity in ('content_ideas','idea_evidence','content_briefs','content_outlines','content_assets') then r in ('writer','strategist','editor')
 else r in ('strategist','editor') end;
 if not permitted then raise exception 'FORBIDDEN'; end if;
 if coalesce(body->>'status','draft') in ('approved','rejected','merged') and r not in ('admin','editor','strategist') then raise exception 'APPROVAL_FORBIDDEN'; end if;
 if entity='content_items' and coalesce(body->>'kind','') not in ('article','guide','course','lesson','tool') then raise exception 'INVALID_CONTENT_TYPE'; end if;
 if entity='content_ideas' and (nullif(body->>'problem','') is null or nullif(body->>'audience','') is null or nullif(body->>'country','') is null) then raise exception 'IDEA_REQUIRED_FIELDS'; end if;
 if entity='content_ideas' and body->>'status' in ('approved','rejected','merged') and nullif(trim(body->>'decisionReason'),'') is null then raise exception 'REASON_REQUIRED'; end if;
 if entity='content_briefs' and body->>'status'='approved' and exists(select 1 from unnest(array['title','problem','audience','country','informationGain','officialSources','outline','readerOutcome']) k where nullif(trim(body->>k),'') is null) then raise exception 'BRIEF_INCOMPLETE'; end if;
 if entity='content_outlines' and body->>'status'='approved' then
 if coalesce(jsonb_typeof(body->'sections'),'null')<>'array' then raise exception 'OUTLINE_INCOMPLETE'; end if;
 if jsonb_array_length(body->'sections')=0 or exists(select 1 from jsonb_array_elements(body->'sections') s where coalesce(s->>'level','') not in ('2','3') or nullif(trim(s->>'title'),'') is null) then raise exception 'OUTLINE_INCOMPLETE'; end if;
 end if;
 if entity='source_claims' and body->>'status'='verified' and (coalesce(body->>'url','') !~ '^https://' or nullif(body->>'checkedAt','') is null) then raise exception 'SOURCE_NOT_VERIFIED'; end if;
 perform pg_advisory_xact_lock(hashtextextended(row_id::text,0));
 execute format('select to_jsonb(t) from public.%I t where id=$1 for update',entity) into oldrow using row_id;
 if coalesce((oldrow->>'version')::int,0)<>expected_version then raise exception 'VERSION_CONFLICT'; end if;
 if r='writer' and oldrow is not null and oldrow->>'created_by' is distinct from auth.uid()::text then raise exception 'FORBIDDEN'; end if;
 if oldrow is not null and entity<>'content_items' then item:=(oldrow->>'item_id')::uuid; end if;
 if entity in ('cluster_members','content_briefs','content_outlines','workflow_tasks','content_reviews','source_claims','content_assets') and item is null then raise exception 'ITEM_REQUIRED'; end if;
 if item is not null then
 perform 1 from public.content_items where id=item for update;
 if not found then raise exception 'NOT_FOUND'; end if;
 if r='writer' and not exists(select 1 from public.content_items where id=item and data->>'ownerId'=auth.uid()::text) then raise exception 'FORBIDDEN'; end if;
 end if;
 if entity='idea_evidence' and oldrow is null and nullif(payload->>'idea_id','') is null then raise exception 'IDEA_REQUIRED'; end if;
 if entity='cluster_members' and oldrow is null and nullif(payload->>'cluster_id','') is null then raise exception 'CLUSTER_REQUIRED'; end if;
 if entity='idea_evidence' and (coalesce(body->>'sourceUrl','') !~ '^https://' or nullif(body->>'observedAt','') is null) then raise exception 'EVIDENCE_REQUIRED'; end if;
 if entity='workflow_tasks' and (nullif(body->>'ownerId','') is null or nullif(trim(body->>'acceptance'),'') is null or (body->>'status'='blocked' and nullif(trim(body->>'blockedReason'),'') is null)) then raise exception 'TASK_INCOMPLETE'; end if;
 if entity='content_items' then
 if nullif(trim(body->>'title'),'') is null then raise exception 'TITLE_REQUIRED'; end if;
 if nullif(body->>'publicPath','') is not null and (body->>'publicPath' !~ '^/[a-zA-Z0-9/_-]+$' or body->>'publicPath' ~ '^//') then raise exception 'INVALID_PATH'; end if;
 if oldrow is null then
 if coalesce(body->>'stage','research')<>'research' then raise exception 'USE_TRANSITION'; end if;
 body:=body||jsonb_build_object('stage','research','stageEnteredAt',now());
 elsif body ? 'stage' and body->>'stage' is distinct from oldrow->'data'->>'stage' then raise exception 'USE_TRANSITION';
 end if;
 end if;
 if entity in ('content_briefs','content_outlines') and body->>'status'='approved' and
 exists(select 1 from public.content_items where id=item and data->>'ownerId'=auth.uid()::text) then
 if r<>'admin' then raise exception 'SELF_APPROVAL_FORBIDDEN'; end if;
 if nullif(trim(body->>'approvalOverrideReason'),'') is null then raise exception 'OVERRIDE_REASON_REQUIRED'; end if;
 end if;
 if entity='content_items' and oldrow is not null then
 body:=body || jsonb_build_object('stage',coalesce(oldrow->'data'->>'stage','research'),'stageEnteredAt',oldrow->'data'->'stageEnteredAt');
 end if;
 if oldrow is null then
 if entity='content_items' then
 insert into public.content_items(id,data,created_by) values(row_id,body,auth.uid()) returning to_jsonb(content_items.*) into result;
 else
 if entity='idea_evidence' then
 insert into public.idea_evidence(id,item_id,idea_id,data,created_by) values(row_id,item,(payload->>'idea_id')::uuid,body,auth.uid()) returning to_jsonb(idea_evidence.*) into result;
 elsif entity='cluster_members' then
 insert into public.cluster_members(id,item_id,cluster_id,data,created_by) values(row_id,item,(payload->>'cluster_id')::uuid,body,auth.uid()) returning to_jsonb(cluster_members.*) into result;
 else
 execute format('insert into public.%I(id,item_id,data,created_by) values($1,$2,$3,$4) returning to_jsonb(%I.*)',entity,entity) into result using row_id,item,body,auth.uid();
 end if;
 end if;
 else
 execute format('update public.%I set data=$2,version=version+1,updated_at=now() where id=$1 returning to_jsonb(%I.*)',entity,entity) into result using row_id,body;
 end if;
 -- A changed prerequisite reopens review; previously ready content cannot stay approved silently.
 if item is not null and entity in ('content_briefs','content_outlines','source_claims','content_reviews') then
 update public.content_items set data=data||jsonb_build_object('stage','editorial','stageEnteredAt',now(),'transitionReason','Prerequisite changed: '||entity),version=version+1,updated_at=now()
 where id=item and data->>'stage'='ready';
 end if;
 return result;
end $$;
revoke all on function public.ops_save(text,jsonb,integer) from public,anon;
grant execute on function public.ops_save(text,jsonb,integer) to authenticated;

create function public.ops_transition(item uuid,next_stage text,reason text,expected_version integer) returns jsonb
language plpgsql security definer set search_path='' as $$
declare current_row public.content_items; r text:=public.ops_role(); stages text[]:=array['research','brief','outline','drafting','editorial','fact_check','visual_seo','final_approval','ready']; oldpos int; newpos int; result jsonb;
begin
 if r not in ('admin','editor','strategist','fact_checker','publisher','writer') or r is null then raise exception 'FORBIDDEN'; end if;
 if expected_version is null or expected_version<1 then raise exception 'VERSION_CONFLICT'; end if;
 select * into current_row from public.content_items where id=item for update;
 if not found then raise exception 'NOT_FOUND'; end if;
 if current_row.version<>expected_version then raise exception 'VERSION_CONFLICT'; end if;
 oldpos:=array_position(stages,current_row.data->>'stage'); newpos:=array_position(stages,next_stage);
 if newpos is null or oldpos is null or newpos=oldpos or newpos>oldpos+1 then raise exception 'INVALID_TRANSITION'; end if;
 if newpos<oldpos and nullif(trim(reason),'') is null then raise exception 'REASON_REQUIRED'; end if;
 if r='writer' and (current_row.data->>'ownerId' is distinct from auth.uid()::text or next_stage<>'editorial') then raise exception 'FORBIDDEN'; end if;
 if r='fact_checker' and (oldpos<>6 or next_stage<>'visual_seo') then raise exception 'FORBIDDEN'; end if;
 if r='publisher' and (oldpos<>8 or next_stage<>'ready') then raise exception 'FORBIDDEN'; end if;
 if next_stage in ('drafting','editorial','fact_check','visual_seo','final_approval','ready') then
 if not exists(select 1 from public.content_briefs where item_id=item and data->>'status'='approved') then raise exception 'BRIEF_REQUIRED'; end if;
 if not exists(select 1 from public.content_outlines where item_id=item and data->>'status'='approved') then raise exception 'OUTLINE_REQUIRED'; end if;
 end if;
 if next_stage='ready' then
 if r not in ('admin','editor','publisher') then raise exception 'FINAL_APPROVAL_FORBIDDEN'; end if;
 if current_row.data->>'ownerId'=auth.uid()::text then
 if r<>'admin' then raise exception 'SELF_APPROVAL_FORBIDDEN'; end if;
 if nullif(trim(reason),'') is null then raise exception 'OVERRIDE_REASON_REQUIRED'; end if;
 end if;
 if exists(select 1 from public.source_claims where item_id=item and (coalesce(data->>'status','pending')<>'verified' or nullif(data->>'expiresAt','')::date<current_date)) then raise exception 'UNVERIFIED_CLAIMS'; end if;
 if exists(select 1 from public.content_reviews where item_id=item and data->>'severity'='critical' and coalesce(data->>'result','fail')<>'pass') then raise exception 'CRITICAL_REVIEW'; end if;
 if not exists(select 1 from public.content_reviews where item_id=item and data->>'result'='pass') then raise exception 'REVIEW_REQUIRED'; end if;
 end if;
 update public.content_items set data=data||jsonb_build_object('stage',next_stage,'stageEnteredAt',now(),'transitionReason',reason,
 'stageHistory',coalesce(data->'stageHistory','[]'::jsonb)||jsonb_build_array(jsonb_build_object('stage',data->>'stage','enteredAt',coalesce(data->>'stageEnteredAt',created_at::text),'exitedAt',now(),'reason',reason,'actor',auth.uid()))),version=version+1,updated_at=now() where id=item returning to_jsonb(content_items.*) into result;
 return result;
end $$;
revoke all on function public.ops_transition(uuid,text,text,integer) from public,anon;
grant execute on function public.ops_transition(uuid,text,text,integer) to authenticated;

-- Idempotent conversion: one decision creates the linked records in a single transaction.
create function public.ops_convert_idea(idea uuid,expected_version integer,reason text,kind text,owner_id uuid,existing_item uuid default null) returns jsonb
language plpgsql security definer set search_path='' as $$
declare r text:=public.ops_role(); source public.content_ideas; target uuid; brief_id uuid; task_id uuid;
begin
 if r is null or r not in ('admin','editor','strategist') then raise exception 'FORBIDDEN'; end if;
 if expected_version is null or expected_version<1 then raise exception 'VERSION_CONFLICT'; end if;
 select * into source from public.content_ideas where id=idea for update;
 if not found then raise exception 'NOT_FOUND'; end if;
 if source.data ? 'convertedItemId' then return jsonb_build_object('itemId',source.data->>'convertedItemId','reused',true); end if;
 if source.version<>expected_version then raise exception 'VERSION_CONFLICT'; end if;
 if nullif(trim(reason),'') is null then raise exception 'REASON_REQUIRED'; end if;
 if kind not in ('article','guide','course','lesson','tool') or kind is null then raise exception 'INVALID_CONTENT_TYPE'; end if;
 if owner_id is null or not (exists(select 1 from public.ops_members where user_id=owner_id and active) or exists(select 1 from public.cms_admins where user_id=owner_id)) then raise exception 'OWNER_REQUIRED'; end if;
 if not exists(select 1 from public.idea_evidence where idea_id=idea) and (coalesce(source.data->>'sourceUrl','') !~ '^https://' or nullif(source.data->>'observedAt','') is null) then raise exception 'EVIDENCE_REQUIRED'; end if;
 if existing_item is not null then
 select id into target from public.content_items where id=existing_item for update;
 if not found then raise exception 'NOT_FOUND'; end if;
 else
 insert into public.content_items(data,created_by) values(jsonb_build_object('title',source.data->>'title','kind',kind,'stage','research','ownerId',owner_id,'ideaId',idea,'stageEnteredAt',now()),auth.uid()) returning id into target;
 end if;
 insert into public.content_briefs(item_id,data,created_by) values(target,jsonb_build_object('title',source.data->>'title','problem',source.data->>'problem','audience',source.data->>'audience','country',source.data->>'country','informationGain',coalesce(source.data->>'informationGain',''),'status','draft','ideaId',idea),auth.uid()) returning id into brief_id;
 insert into public.workflow_tasks(item_id,data,created_by) values(target,jsonb_build_object('title','إعداد الموجز: '||(source.data->>'title'),'ownerId',owner_id,'stage','brief','status','open','acceptance','تعبئة الموجز والمصادر والنتيجة المتوقعة ثم اعتماده','ideaId',idea),auth.uid()) returning id into task_id;
 update public.content_ideas set item_id=target,data=data||jsonb_build_object('status','approved','decisionReason',reason,'convertedItemId',target,'briefId',brief_id,'taskId',task_id,'decidedAt',now(),'decidedBy',auth.uid()),version=version+1,updated_at=now() where id=idea;
 return jsonb_build_object('itemId',target,'briefId',brief_id,'taskId',task_id,'reused',false);
end $$;
revoke all on function public.ops_convert_idea(uuid,integer,text,text,uuid,uuid) from public,anon;
grant execute on function public.ops_convert_idea(uuid,integer,text,text,uuid,uuid) to authenticated;
