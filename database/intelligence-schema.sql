-- Topic Intelligence: planning and research only. No publication endpoint or automatic release.
create schema ti_private;
revoke all on schema ti_private from public;
grant usage on schema ti_private to authenticated,anon;

create table ti_private.settings(id boolean primary key default true check(id),key_hashes text[] not null default '{}');
insert into ti_private.settings(id) values(true);
alter table ti_private.settings enable row level security;
create policy deny_direct_settings on ti_private.settings for all to anon,authenticated using(false) with check(false);
revoke all on ti_private.settings from public,anon,authenticated;

create function ti_private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from public.cms_admins where user_id=auth.uid())
$$;
revoke all on function ti_private.is_admin() from public,anon;
grant execute on function ti_private.is_admin() to authenticated;

create table public.ti_projects(
 id uuid primary key default gen_random_uuid(),title text not null check(length(title) between 1 and 300),
 topic text not null check(length(topic) between 1 and 1000),country text not null default 'مصر' check(length(country) between 1 and 100),
 settings jsonb not null default '{}' check(jsonb_typeof(settings)='object' and octet_length(settings::text)<=20000),
 created_by uuid not null default auth.uid() references public.cms_admins(user_id),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table public.ti_sources(
 id uuid primary key default gen_random_uuid(),project_id uuid not null references public.ti_projects(id) on delete cascade,
 url text not null check(url ~ '^https://[^/@[:space:]]+[^[:space:]]*$' and length(url)<=2000),
 role text not null default 'competitor' check(role in('competitor','official','reference')),
 status text not null default 'queued' check(status in('queued','fetched','partial','blocked','failed')),
 payload jsonb not null default '{}' check(jsonb_typeof(payload)='object' and octet_length(payload::text)<=20000),
 next_check_at timestamptz,last_crawled_at timestamptz,
 created_by uuid not null default auth.uid() references public.cms_admins(user_id),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 unique(project_id,url),unique(id,project_id)
);
create index ti_sources_freshness on public.ti_sources(next_check_at) where next_check_at is not null;
create table public.ti_jobs(
 id uuid primary key default gen_random_uuid(),project_id uuid not null references public.ti_projects(id) on delete cascade,
 source_id uuid,phase text not null check(phase in('crawl','analyze')),
 status text not null default 'queued' check(status in('queued','running','retry','succeeded','failed','cancelled','blocked')),
 payload jsonb not null default '{}' check(jsonb_typeof(payload)='object' and octet_length(payload::text)<=1000000),
 attempt integer not null default 0 check(attempt between 0 and 3),lease uuid,lease_expires_at timestamptz,
 run_after timestamptz not null default now(),error text check(length(error)<=2000),
 created_by uuid not null default auth.uid() references public.cms_admins(user_id),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 foreign key(source_id,project_id) references public.ti_sources(id,project_id),
 check((phase='crawl' and source_id is not null) or (phase='analyze' and source_id is null)),
 unique(id,project_id)
);
create index ti_jobs_due on public.ti_jobs(status,run_after,created_at);
create index ti_jobs_project on public.ti_jobs(project_id,created_at desc);
create unique index ti_jobs_source_active on public.ti_jobs(project_id,source_id,phase) where source_id is not null and status in('queued','running','retry');
create unique index ti_jobs_analysis_active on public.ti_jobs(project_id,phase) where source_id is null and status in('queued','running','retry');
create table public.ti_snapshots(
 id uuid primary key default gen_random_uuid(),project_id uuid not null references public.ti_projects(id) on delete cascade,
 source_id uuid not null,job_id uuid not null references public.ti_jobs(id),
 fingerprint text not null check(fingerprint ~ '^[a-f0-9]{64}$'),
 document jsonb not null check(jsonb_typeof(document)='object' and octet_length(document::text)<=1500000),
 created_at timestamptz not null default now(),last_seen_at timestamptz not null default now(),
 foreign key(source_id,project_id) references public.ti_sources(id,project_id),unique(source_id,fingerprint),unique(id,project_id)
);
create index ti_snapshots_project on public.ti_snapshots(project_id,created_at desc);
create table public.ti_analyses(
 id uuid primary key default gen_random_uuid(),project_id uuid not null references public.ti_projects(id) on delete cascade,
 job_id uuid not null unique references public.ti_jobs(id),
 report jsonb not null check(jsonb_typeof(report)='object' and octet_length(report::text)<=2000000),
 created_at timestamptz not null default now(),unique(id,project_id)
);
create index ti_analyses_project on public.ti_analyses(project_id,created_at desc);
create table public.ti_opportunities(
 id uuid primary key default gen_random_uuid(),project_id uuid not null references public.ti_projects(id) on delete cascade,
 analysis_id uuid not null,kind text not null check(kind in('content','tool','document','research')),
 action text not null check(action in('create','expand','update','merge','section','tool','document','research','none')),
 title text not null check(length(title) between 1 and 400),
 status text not null default 'REVIEW' check(status in('DRAFT','RESEARCHING','VERIFIED','PROPOSED','REVIEW','APPROVED','IN_PROGRESS','QA','READY_TO_PUBLISH','MONITORING','REJECTED','NEEDS_REVISION','BLOCKED','OUTDATED','ARCHIVED')),
 priority integer not null check(priority between 0 and 100),
 data jsonb not null check(jsonb_typeof(data)='object' and octet_length(data::text)<=200000),
 version integer not null default 1 check(version>0),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 foreign key(analysis_id,project_id) references public.ti_analyses(id,project_id),unique(id,project_id)
);
create index ti_opportunities_project on public.ti_opportunities(project_id,status,priority desc);
create table public.ti_decisions(
 id bigint generated always as identity primary key,opportunity_id uuid not null references public.ti_opportunities(id),
 actor uuid not null references public.cms_admins(user_id),from_status text not null,to_status text not null,
 reason text not null check(length(reason) between 1 and 3000),version integer not null,
 created_at timestamptz not null default now()
);
create index ti_decisions_opportunity on public.ti_decisions(opportunity_id,created_at desc);
create table public.ti_agent_runs(
 id uuid primary key default gen_random_uuid(),job_id uuid not null references public.ti_jobs(id),
 project_id uuid not null references public.ti_projects(id) on delete cascade,
 agent text not null check(length(agent) between 1 and 100),status text not null check(status in('succeeded','failed','blocked','skipped')),
 model text check(length(model)<=200),input_tokens integer check(input_tokens>=0),output_tokens integer check(output_tokens>=0),
 cost_usd numeric(14,8) check(cost_usd>=0),details jsonb not null default '{}' check(octet_length(details::text)<=50000),
 created_at timestamptz not null default now()
);
create index ti_agent_runs_job on public.ti_agent_runs(job_id);
create index ti_agent_runs_project on public.ti_agent_runs(project_id,created_at desc);

-- All CMS administrators share this single-owner workspace; ordinary signed-in users have no rows.
do $$declare t text;begin
 foreach t in array array['ti_projects','ti_sources','ti_jobs','ti_snapshots','ti_analyses','ti_opportunities','ti_decisions','ti_agent_runs'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from public,anon,authenticated',t);
  execute format('grant select on public.%I to authenticated',t);
  execute format('create policy admin_read on public.%I for select to authenticated using ((select ti_private.is_admin()))',t);
 end loop;
 foreach t in array array['ti_projects','ti_sources','ti_jobs'] loop
  execute format('grant insert on public.%I to authenticated',t);
  execute format('create policy admin_insert on public.%I for insert to authenticated with check ((select ti_private.is_admin()) and created_by=(select auth.uid()))',t);
 end loop;
end$$;
grant update(title,topic,country,settings,updated_at) on public.ti_projects to authenticated;
create policy admin_update on public.ti_projects for update to authenticated using((select ti_private.is_admin())) with check((select ti_private.is_admin()));
grant update(role,payload,next_check_at,updated_at) on public.ti_sources to authenticated;
create policy admin_update on public.ti_sources for update to authenticated using((select ti_private.is_admin())) with check((select ti_private.is_admin()));

create function ti_private.worker_allowed(worker_key text) returns boolean language sql stable security definer set search_path='' as $$
 select (auth.uid() is not null and exists(select 1 from public.cms_admins where user_id=auth.uid()))
 or exists(select 1 from ti_private.settings where encode(sha256(convert_to(coalesce(worker_key,''),'UTF8')),'hex')=any(key_hashes))
$$;
revoke all on function ti_private.worker_allowed(text) from public,anon,authenticated;

create function ti_private.claim_job(worker_key text,project_filter uuid default null) returns jsonb language plpgsql security definer set search_path='' as $$
declare j public.ti_jobs;u text;begin
 if not ti_private.worker_allowed(worker_key) then raise exception 'FORBIDDEN';end if;
 -- Serialize only the short claim transaction: independent HTTP workers cannot race the domain guard.
 perform pg_advisory_xact_lock(hashtextextended('ti_claim_job',0));
 -- An exhausted lease becomes terminal so it cannot remain running forever.
 update public.ti_jobs set status='failed',error='انتهت مهلة المحاولة الأخيرة',lease=null,lease_expires_at=null,updated_at=now()
 where status='running' and lease_expires_at<now() and attempt>=3;
 select candidate.* into j from public.ti_jobs candidate left join public.ti_sources source on source.id=candidate.source_id
 where candidate.attempt<3 and (project_filter is null or candidate.project_id=project_filter) and
 ((candidate.status in('queued','retry') and candidate.run_after<=now()) or (candidate.status='running' and candidate.lease_expires_at<now()))
 and (candidate.phase<>'crawl' or not exists(
  select 1 from public.ti_jobs other join public.ti_sources os on os.id=other.source_id
  where other.id<>candidate.id and lower(substring(os.url from '^https://([^/:]+)'))=lower(substring(source.url from '^https://([^/:]+)'))
  and ((other.status='running' and other.lease_expires_at>=now()) or
   (other.status in('succeeded','failed','blocked','retry','cancelled') and other.updated_at>now()-interval '2 seconds'))
 ))
 order by candidate.created_at for update of candidate skip locked limit 1;
 if not found then return null;end if;
 update public.ti_jobs set status='running',attempt=attempt+1,lease=gen_random_uuid(),lease_expires_at=now()+interval '5 minutes',updated_at=now(),error=null
 where id=j.id returning * into j;
 if j.source_id is not null then select url into u from public.ti_sources where id=j.source_id;end if;
 return jsonb_build_object('id',j.id,'project_id',j.project_id,'source_id',j.source_id,'url',u,'phase',j.phase,'payload',j.payload,'attempt',j.attempt,'lease',j.lease);
end$$;
revoke all on function ti_private.claim_job(text,uuid) from public;grant execute on function ti_private.claim_job(text,uuid) to anon,authenticated;
create function public.ti_claim_job(worker_key text default '',project_filter uuid default null) returns jsonb language sql security invoker set search_path='' as $$select ti_private.claim_job(worker_key,project_filter)$$;
revoke all on function public.ti_claim_job(text,uuid) from public;grant execute on function public.ti_claim_job(text,uuid) to anon,authenticated;

create function ti_private.schedule_due(worker_key text) returns integer language plpgsql security definer set search_path='' as $$
declare scheduled integer:=0;today_count integer;s public.ti_sources;begin
 if not ti_private.worker_allowed(worker_key) then raise exception 'FORBIDDEN';end if;
 perform pg_advisory_xact_lock(hashtextextended('ti_schedule_due',0));
 select count(*)::integer into today_count from public.ti_jobs where payload->>'scheduled'='true'
 and created_at>=(date_trunc('day',now() at time zone 'UTC') at time zone 'UTC');
 if today_count>=100 then return 0;end if;
 for s in select * from public.ti_sources source where next_check_at is not null and next_check_at<=now()
 and not exists(select 1 from public.ti_jobs j where j.source_id=source.id and j.status in('queued','running','retry'))
 order by next_check_at for update skip locked limit least(10,100-today_count) loop
  insert into public.ti_jobs(project_id,source_id,phase,payload,created_by) values(s.project_id,s.id,'crawl','{"scheduled":true}',s.created_by)
  on conflict do nothing;
  if found then
   update public.ti_sources set next_check_at=now()+interval '7 days',updated_at=now() where id=s.id;
   scheduled=scheduled+1;
  end if;
 end loop;
 return scheduled;
end$$;
revoke all on function ti_private.schedule_due(text) from public;grant execute on function ti_private.schedule_due(text) to anon,authenticated;
create function public.ti_schedule_due(worker_key text default '') returns integer language sql security invoker set search_path='' as $$select ti_private.schedule_due(worker_key)$$;
revoke all on function public.ti_schedule_due(text) from public;grant execute on function public.ti_schedule_due(text) to anon,authenticated;

create function ti_private.finish_job(worker_key text,job_id uuid,lease uuid,result jsonb,failure text default null) returns jsonb language plpgsql security definer set search_path='' as $$
declare j public.ti_jobs;a uuid;o jsonb;r jsonb;finger text;begin
 if not ti_private.worker_allowed(worker_key) then raise exception 'FORBIDDEN';end if;
 select * into j from public.ti_jobs where id=job_id for update;
 if not found or j.status<>'running' or j.lease is distinct from lease or j.lease_expires_at<now() then raise exception 'STALE_LEASE';end if;
 if failure is not null then
  insert into public.ti_agent_runs(job_id,project_id,agent,status,details)
  values(j.id,j.project_id,case when j.phase='crawl' then 'competitor-collector' else 'semantic-intelligence' end,
   case when failure like 'BLOCKED:%' then 'blocked' else 'failed' end,
   jsonb_build_object('error',left(failure,2000),'attempt',j.attempt,'details',case when jsonb_typeof(result->'details')='object' and octet_length((result->'details')::text)<=20000 then result->'details' else '{}'::jsonb end));
  update public.ti_jobs set status=case when failure like 'BLOCKED:%' then 'blocked' when j.attempt>=3 then 'failed' else 'retry' end,
   error=left(failure,2000),run_after=now()+make_interval(secs=>30*j.attempt),lease=null,lease_expires_at=null,updated_at=now() where id=j.id;
  if j.source_id is not null then update public.ti_sources set status=case when failure like 'BLOCKED:%' then 'blocked' else 'failed' end,updated_at=now() where id=j.source_id;end if;
  return jsonb_build_object('accepted',true,'failed',true);
 end if;
 if result is null or jsonb_typeof(result)<>'object' or octet_length(result::text)>2500000 then raise exception 'INVALID_RESULT';end if;
 if j.phase='crawl' then
  finger=result->>'fingerprint';
  if coalesce(finger,'') !~ '^[a-f0-9]{64}$' or jsonb_typeof(result->'text')<>'string' or length(coalesce(result->>'title',''))=0 or result->>'quality' not in('complete','partial') then raise exception 'INVALID_DOCUMENT';end if;
  insert into public.ti_snapshots(project_id,source_id,job_id,fingerprint,document) values(j.project_id,j.source_id,j.id,finger,result)
  on conflict(source_id,fingerprint) do update set last_seen_at=now();
  update public.ti_sources set status=case when result->>'quality'='partial' then 'partial' else 'fetched' end,last_crawled_at=now(),updated_at=now() where id=j.source_id;
 else
  if jsonb_typeof(result->'report')<>'object' or jsonb_typeof(result->'opportunities')<>'array' or jsonb_array_length(result->'opportunities')>50 then raise exception 'INVALID_ANALYSIS';end if;
  insert into public.ti_analyses(project_id,job_id,report) values(j.project_id,j.id,result->'report') returning id into a;
  for o in select value from jsonb_array_elements(result->'opportunities') loop
   -- Do not silently revive a rejected same-intent proposal. New evidence must be reviewed manually.
   if not exists(select 1 from public.ti_opportunities where project_id=j.project_id and status in('REJECTED','ARCHIVED') and
     (title=o->>'title' or (coalesce(data->>'intent','')<>'' and data->>'intent'=o->'data'->>'intent'))) then
    insert into public.ti_opportunities(project_id,analysis_id,kind,action,title,priority,data)
     values(j.project_id,a,o->>'kind',o->>'action',o->>'title',(o->>'priority')::int,o->'data');
   end if;
  end loop;
 end if;
 if result ? 'agentRuns' then
  if jsonb_typeof(result->'agentRuns')<>'array' or jsonb_array_length(result->'agentRuns')>14 then raise exception 'INVALID_AGENT_RUNS';end if;
  for r in select value from jsonb_array_elements(result->'agentRuns') loop
   insert into public.ti_agent_runs(job_id,project_id,agent,status,model,input_tokens,output_tokens,cost_usd,details)
   values(j.id,j.project_id,r->>'agent',r->>'status',r->>'model',(r->>'inputTokens')::int,(r->>'outputTokens')::int,(r->>'costUsd')::numeric,coalesce(r->'details','{}'::jsonb));
  end loop;
 end if;
 update public.ti_jobs set status='succeeded',lease=null,lease_expires_at=null,error=null,updated_at=now() where id=j.id;
 return jsonb_build_object('accepted',true,'analysis_id',a);
end$$;
revoke all on function ti_private.finish_job(text,uuid,uuid,jsonb,text) from public;grant execute on function ti_private.finish_job(text,uuid,uuid,jsonb,text) to anon,authenticated;
create function public.ti_finish_job(worker_key text,job_id uuid,lease uuid,result jsonb,failure text default null) returns jsonb language sql security invoker set search_path='' as $$select ti_private.finish_job(worker_key,job_id,lease,result,failure)$$;
revoke all on function public.ti_finish_job(text,uuid,uuid,jsonb,text) from public;grant execute on function public.ti_finish_job(text,uuid,uuid,jsonb,text) to anon,authenticated;

-- Optional failure-specific alias: logs the failed executed stage and closes/retries its exact lease atomically.
create function public.ti_record_failure(worker_key text,job_id uuid,lease uuid,failure text,details jsonb default '{}') returns jsonb language sql security invoker set search_path='' as $$
 select ti_private.finish_job(worker_key,job_id,lease,jsonb_build_object('details',details),failure)
$$;
revoke all on function public.ti_record_failure(text,uuid,uuid,text,jsonb) from public;grant execute on function public.ti_record_failure(text,uuid,uuid,text,jsonb) to anon,authenticated;

create function ti_private.decide(opportunity_id uuid,expected_version integer,decision text,reason text) returns jsonb language plpgsql security definer set search_path='' as $$
declare o public.ti_opportunities;begin
 if not ti_private.is_admin() then raise exception 'FORBIDDEN';end if;
 if decision not in('REVIEW','APPROVED','IN_PROGRESS','REJECTED','NEEDS_REVISION','BLOCKED','ARCHIVED') or reason is null or length(trim(reason)) not between 1 and 3000 then raise exception 'INVALID_DECISION';end if;
 select * into o from public.ti_opportunities where id=opportunity_id for update;
 if not found or o.version<>expected_version then raise exception 'VERSION_CONFLICT';end if;
 if o.status='ARCHIVED' and decision<>'REVIEW' then raise exception 'INVALID_TRANSITION';end if;
 if decision='IN_PROGRESS' and o.status<>'APPROVED' then raise exception 'APPROVAL_REQUIRED';end if;
 -- APPROVED authorizes work on the proposal, never factual correctness or publication.
 update public.ti_opportunities set status=decision,version=version+1,updated_at=now() where id=o.id;
 insert into public.ti_decisions(opportunity_id,actor,from_status,to_status,reason,version) values(o.id,auth.uid(),o.status,decision,trim(reason),o.version+1);
 return jsonb_build_object('id',o.id,'status',decision,'version',o.version+1,'scope','planning_only');
end$$;
revoke all on function ti_private.decide(uuid,integer,text,text) from public,anon;grant execute on function ti_private.decide(uuid,integer,text,text) to authenticated;
create function public.ti_decide(opportunity_id uuid,expected_version integer,decision text,reason text) returns jsonb language sql security invoker set search_path='' as $$select ti_private.decide(opportunity_id,expected_version,decision,reason)$$;
revoke all on function public.ti_decide(uuid,integer,text,text) from public,anon;grant execute on function public.ti_decide(uuid,integer,text,text) to authenticated;

create function ti_private.cancel_job(job_id uuid,reason text) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if not ti_private.is_admin() then raise exception 'FORBIDDEN';end if;
 if reason is null or length(trim(reason)) not between 1 and 2000 then raise exception 'INVALID_REASON';end if;
 update public.ti_jobs set status='cancelled',lease=null,lease_expires_at=null,error=reason,updated_at=now() where id=job_id and status in('queued','running','retry','blocked');
 if not found then raise exception 'JOB_NOT_CANCELLABLE';end if;
 return jsonb_build_object('cancelled',true,'actor',auth.uid());
end$$;
revoke all on function ti_private.cancel_job(uuid,text) from public,anon;grant execute on function ti_private.cancel_job(uuid,text) to authenticated;
create function public.ti_cancel_job(job_id uuid,reason text) returns jsonb language sql security invoker set search_path='' as $$select ti_private.cancel_job(job_id,reason)$$;
revoke all on function public.ti_cancel_job(uuid,text) from public,anon;grant execute on function public.ti_cancel_job(uuid,text) to authenticated;
