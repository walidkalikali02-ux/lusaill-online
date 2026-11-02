-- DDL-like table privileges are never needed by browser roles and bypass row policies.
revoke truncate,references,trigger on public.cms_documents,public.cms_revisions,public.cms_publications,public.cms_reports,public.cms_admins from anon,authenticated;
