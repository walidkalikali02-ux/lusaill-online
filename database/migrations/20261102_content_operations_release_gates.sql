-- Release cutover: deploy the operations-aware CMS first, then apply this migration.
-- The old implementation is retained privately for an explicit compatibility rollback.
alter function public.cms_save(jsonb,integer) set schema content_ops_private;
alter function content_ops_private.cms_save(jsonb,integer) security definer;
revoke all on function content_ops_private.cms_save(jsonb,integer) from public,anon,authenticated;
create function public.cms_save(payload jsonb,expected_version integer) returns jsonb
language sql security invoker set search_path='' as $$select content_ops_private.ops_cms_save(payload,expected_version)$$;
revoke all on function public.cms_save(jsonb,integer) from public,anon;
grant execute on function public.cms_save(jsonb,integer) to authenticated;

-- Mutation is possible only through the guarded RPC, never directly via the Data API.
revoke all on public.cms_documents,public.cms_revisions,public.cms_publications from authenticated;
grant select on public.cms_documents,public.cms_revisions,public.cms_publications to authenticated;
revoke all on sequence public.cms_revisions_id_seq from authenticated;
revoke truncate,references,trigger on public.cms_publications from anon;

create function content_ops_private.guard_public_snapshot() returns trigger
language plpgsql security definer set search_path='' as $$
declare operation public.content_items;
begin
 if new.document->>'status'='archived' then return new; end if;
 select * into operation from public.content_items where cms_document_id=new.id for update;
 if operation.id is null or operation.data->>'stage'<>'ready' then raise exception 'OPERATIONS_NOT_READY'; end if;
 if operation.approved_document_hash is distinct from content_ops_private.document_hash(new.document) then raise exception 'APPROVAL_STALE'; end if;
 perform content_ops_private.check_publication(operation.id,new.document);
 return new;
end $$;
revoke all on function content_ops_private.guard_public_snapshot() from public,anon,authenticated;
create trigger ops_guard_public_snapshot before insert or update on public.cms_publications for each row execute function content_ops_private.guard_public_snapshot();
