-- Assigned writers may edit draft briefs created by an approving strategist. Approval stays forbidden.
create or replace function content_ops_private.ops_save(entity text,payload jsonb,expected_version integer) returns jsonb
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
 if entity='source_claims' and body->>'status'='verified' and (coalesce(body->>'url','') !~ '^https://' or nullif(body->>'checkedAt','') is null or nullif(body->>'checkedAt','')::date>current_date) then raise exception 'SOURCE_NOT_VERIFIED'; end if;
 perform pg_advisory_xact_lock(hashtextextended(row_id::text,0));
 execute format('select to_jsonb(t) from public.%I t where id=$1 for update',entity) into oldrow using row_id;
 if coalesce((oldrow->>'version')::int,0)<>expected_version then raise exception 'VERSION_CONFLICT'; end if;
 if oldrow is not null and entity<>'content_items' then item:=(oldrow->>'item_id')::uuid; end if;
 if r='writer' and oldrow is not null and (item is null or entity not in ('content_briefs','content_outlines','content_assets')) and oldrow->>'created_by' is distinct from auth.uid()::text then raise exception 'FORBIDDEN'; end if;
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
 body:=body || jsonb_build_object('stage',coalesce(oldrow->'data'->>'stage','research'),'stageEnteredAt',oldrow->'data'->'stageEnteredAt','stageHistory',coalesce(oldrow->'data'->'stageHistory','[]'::jsonb));
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
