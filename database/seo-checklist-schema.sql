create table public.seo_task_definitions(id text primary key,scope text not null check(scope in ('article','site')),definition jsonb not null);
create table public.seo_targets(
 target_key text primary key,scope text not null check(scope in ('article','site')),
 metadata jsonb not null,content_hash text not null,
 task_states jsonb not null default '{}'::jsonb,last_run jsonb,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table public.seo_review_runs(
 id uuid primary key,target_key text not null references public.seo_targets(target_key),content_hash text not null,
 report jsonb not null,actor uuid references auth.users(id),created_at timestamptz not null default now()
);
create index seo_runs_target on public.seo_review_runs(target_key,created_at desc);
create table public.seo_task_activity(
 id bigint generated always as identity primary key,target_key text not null references public.seo_targets(target_key),task_id text,
 actor uuid references auth.users(id),action text not null,before_state jsonb,after_state jsonb,created_at timestamptz not null default now()
);
create index seo_activity_target on public.seo_task_activity(target_key,created_at desc);
do $$declare t text;begin foreach t in array array['seo_task_definitions','seo_targets','seo_review_runs','seo_task_activity'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from anon,authenticated',t);
 execute format('grant select on public.%I to authenticated',t);
 execute format('create policy seo_staff_read on public.%I for select to authenticated using ((select public.ops_role()) is not null)',t);
end loop;end $$;

create view public.seo_target_summary with (security_invoker=true) as
 select target_key,metadata,content_hash,last_run,updated_at,
 (select count(*) from jsonb_each(task_states) s where s.value->>'status'='done' and s.value->>'contentHash'=content_hash) as done,
 (select count(*) from jsonb_each(task_states) s where s.value->>'status'='na' and s.value->>'contentHash'=content_hash) as not_applicable,
 (select count(*) from jsonb_each(task_states) s where s.value->>'status'='blocked') as blocked
 from public.seo_targets;
revoke all on public.seo_target_summary from public,anon,authenticated;grant select on public.seo_target_summary to authenticated;

create function content_ops_private.seo_can_write(target text) returns boolean
language sql stable security definer set search_path='' as $$
 select coalesce(public.ops_role() in ('admin','editor','strategist','fact_checker','publisher') or
 (public.ops_role()='writer' and target<>'site' and exists(
 select 1 from public.content_items i join public.seo_targets t on t.target_key=target
 where i.data->>'ownerId'=auth.uid()::text and (i.cms_document_id::text=t.metadata->>'documentId' or i.data->>'publicPath'=t.metadata->>'path'))),false)
$$;
revoke all on function content_ops_private.seo_can_write(text) from public,anon,authenticated;

create function content_ops_private.seo_sync(payload jsonb) returns integer
language plpgsql security definer set search_path='' as $$
declare r text:=public.ops_role(); item jsonb;n integer:=0;previous jsonb;
begin
 if r is null or r not in ('admin','editor','strategist') then raise exception 'FORBIDDEN';end if;
 if jsonb_typeof(payload)<>'array' or jsonb_array_length(payload)>500 then raise exception 'INVALID_DATA';end if;
 for item in select value from jsonb_array_elements(payload) loop
 if coalesce(item->>'key','') !~ '^(site|article:[0-9a-f-]{36})$' or coalesce(item->>'scope','') not in ('site','article') or nullif(item->>'hash','') is null or length(item::text)>10000 then raise exception 'INVALID_DATA';end if;
 if (item->>'scope'='site') is distinct from (item->>'key'='site') then raise exception 'INVALID_DATA';end if;
 select metadata into previous from public.seo_targets where target_key=item->>'key' for update;
 insert into public.seo_targets(target_key,scope,metadata,content_hash) values(item->>'key',item->>'scope',item,item->>'hash')
 on conflict(target_key) do update set metadata=excluded.metadata,content_hash=excluded.content_hash,updated_at=now()
 where seo_targets.metadata is distinct from excluded.metadata or seo_targets.content_hash is distinct from excluded.content_hash;
 if previous is distinct from item then insert into public.seo_task_activity(target_key,actor,action,before_state,after_state) values(item->>'key',auth.uid(),'sync_target',previous,item);end if;
 n:=n+1;
 end loop;return n;
end $$;
revoke all on function content_ops_private.seo_sync(jsonb) from public,anon;
grant execute on function content_ops_private.seo_sync(jsonb) to authenticated;
create function public.seo_sync(payload jsonb) returns integer language sql security invoker set search_path='' as $$select content_ops_private.seo_sync(payload)$$;
revoke all on function public.seo_sync(jsonb) from public,anon;grant execute on function public.seo_sync(jsonb) to authenticated;

create function content_ops_private.seo_set_task(target text,task text,state jsonb,expected_version integer,expected_hash text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare current_row public.seo_targets;def public.seo_task_definitions;old_state jsonb;next_state jsonb;r text:=public.ops_role();owner_id uuid:=nullif(state->>'ownerId','')::uuid;
begin
 if not content_ops_private.seo_can_write(target) then raise exception 'FORBIDDEN';end if;
 if expected_version is null or expected_version<0 then raise exception 'VERSION_CONFLICT';end if;
 select * into current_row from public.seo_targets where target_key=target for update;
 if not found then raise exception 'NOT_FOUND';end if;
 if expected_hash is distinct from current_row.content_hash then raise exception 'CONTENT_CHANGED';end if;
 select * into def from public.seo_task_definitions where id=task;
 if not found or def.scope<>current_row.scope then raise exception 'TASK_SCOPE_MISMATCH';end if;
 old_state:=current_row.task_states->task;
 if coalesce((old_state->>'version')::integer,0)<>expected_version then raise exception 'VERSION_CONFLICT';end if;
 if coalesce(state->>'status','') not in ('pending','working','done','blocked','na') or length(state::text)>12000 then raise exception 'INVALID_DATA';end if;
 if state->>'status' in ('done','blocked','na') and length(trim(coalesce(state->>'note','')))<10 then raise exception 'EVIDENCE_REQUIRED';end if;
 if coalesce((def.definition->>'protected')::boolean,false) and state->>'status'='done' and r not in ('admin','editor','fact_checker') then raise exception 'APPROVAL_FORBIDDEN';end if;
 if owner_id is not null and not (exists(select 1 from public.ops_members where user_id=owner_id and active) or exists(select 1 from public.cms_admins where user_id=owner_id)) then raise exception 'OWNER_REQUIRED';end if;
 next_state:=jsonb_build_object('status',state->>'status','note',left(coalesce(state->>'note',''),6000),'evidence',left(coalesce(state->>'evidence',''),3000),'ownerId',owner_id,'dueAt',nullif(state->>'dueAt','')::timestamptz,'priority',case when state->>'priority' in ('low','normal','high','critical') then state->>'priority' else 'normal' end,'version',expected_version+1,'contentHash',current_row.content_hash,'reviewedAt',now(),'reviewedBy',auth.uid());
 update public.seo_targets set task_states=task_states||jsonb_build_object(task,next_state),updated_at=now() where target_key=target;
 insert into public.seo_task_activity(target_key,task_id,actor,action,before_state,after_state) values(target,task,auth.uid(),'task_update',old_state,next_state);
 return next_state;
end $$;
revoke all on function content_ops_private.seo_set_task(text,text,jsonb,integer,text) from public,anon;
grant execute on function content_ops_private.seo_set_task(text,text,jsonb,integer,text) to authenticated;
create function public.seo_set_task(target text,task text,state jsonb,expected_version integer,expected_hash text) returns jsonb language sql security invoker set search_path='' as $$select content_ops_private.seo_set_task(target,task,state,expected_version,expected_hash)$$;
revoke all on function public.seo_set_task(text,text,jsonb,integer,text) from public,anon;grant execute on function public.seo_set_task(text,text,jsonb,integer,text) to authenticated;

create function content_ops_private.seo_record_run(run_id uuid,target text,hash text,report jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare result jsonb;r text:=public.ops_role();
begin
 if r is null or r not in ('admin','editor','strategist') then raise exception 'FORBIDDEN';end if;
 if run_id is null or report is null or jsonb_typeof(report)<>'object' or coalesce(jsonb_typeof(report->'checks'),'null')<>'array' or length(report::text)>150000 then raise exception 'INVALID_DATA';end if;
 if not exists(select 1 from public.seo_targets where target_key=target and content_hash=hash) then raise exception 'CONTENT_CHANGED';end if;
 insert into public.seo_review_runs(id,target_key,content_hash,report,actor) values(run_id,target,hash,report,auth.uid()) on conflict(id) do nothing;
 select to_jsonb(t) into result from public.seo_review_runs t where id=run_id;
 if result->>'target_key' is distinct from target or result->>'content_hash' is distinct from hash then raise exception 'RUN_CONFLICT';end if;
 update public.seo_targets set last_run=jsonb_build_object('id',run_id,'hash',hash,'checkedAt',report->>'checkedAt','mode',report->>'mode','createdAt',result->>'created_at','failures',(select count(*) from jsonb_array_elements(report->'checks') c where c->>'status' in ('fail','error')),'warnings',(select count(*) from jsonb_array_elements(report->'checks') c where c->>'status'='warning'),'passed',(select count(*) from jsonb_array_elements(report->'checks') c where c->>'status'='pass'))
 where target_key=target and (last_run is null or (last_run->>'createdAt')::timestamptz<=(result->>'created_at')::timestamptz);
 return result;
end $$;
revoke all on function content_ops_private.seo_record_run(uuid,text,text,jsonb) from public,anon;grant execute on function content_ops_private.seo_record_run(uuid,text,text,jsonb) to authenticated;
create function public.seo_record_run(run_id uuid,target text,hash text,report jsonb) returns jsonb language sql security invoker set search_path='' as $$select content_ops_private.seo_record_run(run_id,target,hash,report)$$;
revoke all on function public.seo_record_run(uuid,text,text,jsonb) from public,anon;grant execute on function public.seo_record_run(uuid,text,text,jsonb) to authenticated;
