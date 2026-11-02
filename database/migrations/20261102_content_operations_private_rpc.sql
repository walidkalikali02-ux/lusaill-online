-- Keep privileged implementations outside the PostgREST exposed schema.
create schema content_ops_private;
revoke all on schema content_ops_private from public,anon;
grant usage on schema content_ops_private to authenticated;
alter function public.ops_role() set schema content_ops_private;
alter function public.ops_audit() set schema content_ops_private;
alter function public.ops_save(text,jsonb,integer) set schema content_ops_private;
alter function public.ops_transition(uuid,text,text,integer) set schema content_ops_private;
alter function public.ops_convert_idea(uuid,integer,text,text,uuid,uuid) set schema content_ops_private;

create function public.ops_role() returns text language sql stable security invoker set search_path='' as $$
 select content_ops_private.ops_role()
$$;
create function public.ops_save(entity text,payload jsonb,expected_version integer) returns jsonb
language sql security invoker set search_path='' as $$
 select content_ops_private.ops_save(entity,payload,expected_version)
$$;
create function public.ops_transition(item uuid,next_stage text,reason text,expected_version integer) returns jsonb
language sql security invoker set search_path='' as $$
 select content_ops_private.ops_transition(item,next_stage,reason,expected_version)
$$;
create function public.ops_convert_idea(idea uuid,expected_version integer,reason text,kind text,owner_id uuid,existing_item uuid default null) returns jsonb
language sql security invoker set search_path='' as $$
 select content_ops_private.ops_convert_idea(idea,expected_version,reason,kind,owner_id,existing_item)
$$;
revoke all on function public.ops_role(),public.ops_save(text,jsonb,integer),public.ops_transition(uuid,text,text,integer),public.ops_convert_idea(uuid,integer,text,text,uuid,uuid) from public,anon;
grant execute on function public.ops_role(),public.ops_save(text,jsonb,integer),public.ops_transition(uuid,text,text,integer),public.ops_convert_idea(uuid,integer,text,text,uuid,uuid) to authenticated;
