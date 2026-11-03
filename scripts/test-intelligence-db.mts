import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {PGlite} from "@electric-sql/pglite";

// Synthetic data only. No production keys, projects, competitor content or user activity.
const db=new PGlite();
await db.exec(`create role anon;create role authenticated;create schema auth;
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
create table public.cms_admins(user_id uuid primary key);grant usage on schema auth to anon,authenticated;
grant execute on function auth.uid() to anon,authenticated;`);
await db.exec(await readFile("database/intelligence-schema.sql","utf8"));
const admin="11111111-1111-4111-8111-111111111111",outsider="22222222-2222-4222-8222-222222222222";
await db.query("insert into cms_admins values($1)",[admin]);
async function as(role:string,user:string|null,sql:string,params:unknown[]=[]){
 await db.exec(`set role ${role};select set_config('request.jwt.claim.sub','${user??""}',false)`);
 try{return await db.query(sql,params);}finally{await db.exec("reset role");}
}
const adm=(sql:string,p:unknown[]=[])=>as("authenticated",admin,sql,p);
const key="synthetic-worker-key-only",hash=createHash("sha256").update(key).digest("hex");
await db.query("update ti_private.settings set key_hashes=array[$1]",[hash]);
await assert.rejects(as("anon",null,"select * from ti_projects"),/permission denied/);
assert.equal((await as("authenticated",outsider,"select * from ti_projects")).rows.length,0);
await assert.rejects(as("authenticated",outsider,"insert into ti_projects(title,topic)values('اختبار','موضوع')"),/row-level security/);
await assert.rejects(as("anon",null,"select ti_claim_job($1)",["bad"]),/FORBIDDEN/);
await assert.rejects(as("authenticated",outsider,"select ti_claim_job('')"),/FORBIDDEN/);
await assert.rejects(adm("select * from ti_private.settings"),/permission denied/);
const project=(await adm("insert into ti_projects(title,topic)values('مشروع اختبار اصطناعي','شهادة الميلاد') returning id")).rows[0].id;
const source=(await adm("insert into ti_sources(project_id,url)values($1,'https://example.com/article')returning id",[project])).rows[0].id;
await assert.rejects(adm("insert into ti_sources(project_id,url)values($1,'https://example.com/article')",[project]),/unique/);
const job=(await adm("insert into ti_jobs(project_id,source_id,phase)values($1,$2,'crawl')returning id",[project,source])).rows[0].id;
await assert.rejects(adm("insert into ti_jobs(project_id,source_id,phase)values($1,$2,'crawl')",[project,source]),/unique/);
const rawClaim=async(filter:string|null=null)=>((await as("anon",null,"select ti_claim_job($1,$2) as value",[key,filter])).rows[0].value);
const claim=async()=>{await db.exec("update ti_jobs set updated_at=now()-interval '3 seconds' where status in('succeeded','failed','blocked','retry','cancelled')");return rawClaim();};
const finish=(j:{id:string,lease:string},result:unknown,failure:string|null=null)=>as("anon",null,"select ti_finish_job($1,$2,$3,$4::jsonb,$5) as value",[key,j.id,j.lease,JSON.stringify(result),failure]);
const c=await claim();assert.equal(c.id,job);assert.equal(c.attempt,1);assert.equal(c.url,"https://example.com/article");assert.equal(await claim(),null);
const doc={url:"https://example.com/article",canonical:"https://example.com/article",title:"مصدر اختبار عربي",text:"نص اختبار فقط وليس تحليلاً لمصدر فعلي.",fingerprint:"a".repeat(64),quality:"complete"};
await assert.rejects(finish({...c,lease:outsider},doc),/STALE_LEASE/);
await finish(c,doc);assert.equal((await adm("select status from ti_jobs where id=$1",[job])).rows[0].status,"succeeded");
await assert.rejects(finish(c,doc),/STALE_LEASE/);
assert.equal((await adm("select count(*)::int as n from ti_snapshots")).rows[0].n,1);
await assert.rejects(adm("update ti_snapshots set document='{}'"),/permission denied/);
await assert.rejects(adm("update ti_jobs set status='succeeded'"),/permission denied/);
// A new crawl with an unchanged fingerprint records job history, not a duplicate snapshot.
await adm("insert into ti_jobs(project_id,source_id,phase)values($1,$2,'crawl')",[project,source]);await finish(await claim(),doc);
assert.equal((await adm("select count(*)::int as n from ti_snapshots")).rows[0].n,1);
await adm("insert into ti_jobs(project_id,phase)values($1,'analyze')",[project]);const ac=await claim();
const opportunity={kind:"content",action:"expand",title:"إكمال متطلبات شهادة الميلاد — اختبار",priority:70,data:{intent:"طلب شهادة ميلاد",evidence:[{sourceUrl:doc.url,classification:"observed"}],need:"توضيح المتطلبات"}};
await finish(ac,{report:{summary:"تحليل اصطناعي للاختبار فقط",uncertainties:["ليست حقائق منشورة"]},opportunities:[opportunity],agentRuns:[{agent:"content-architect",status:"succeeded",model:null,inputTokens:null,outputTokens:null,costUsd:null,details:{mode:"synthetic-test"}}]});
const o=(await adm("select * from ti_opportunities")).rows[0];assert.equal(o.status,"REVIEW");
await assert.rejects(adm("update ti_opportunities set status='APPROVED'"),/permission denied/);
await assert.rejects(as("authenticated",outsider,"select ti_decide($1,1,'APPROVED','موافقة')",[o.id]),/FORBIDDEN/);
await assert.rejects(adm("select ti_decide($1,1,'PUBLISHED','نشر')",[o.id]),/INVALID_DECISION/);
await assert.rejects(adm("select ti_decide($1,1,'IN_PROGRESS','بدء')",[o.id]),/APPROVAL_REQUIRED/);
await assert.rejects(adm("select ti_decide($1,1,'APPROVED','')",[o.id]),/INVALID_DECISION/);
const decision=(await adm("select ti_decide($1,1,'APPROVED','اعتماد العمل على المقترح وليس النشر') as value",[o.id])).rows[0].value;
assert.equal(decision.scope,"planning_only");assert.equal(decision.version,2);
await assert.rejects(adm("select ti_decide($1,1,'REJECTED','نسخة قديمة')",[o.id]),/VERSION_CONFLICT/);
const audit=(await adm("select * from ti_decisions")).rows[0];assert.equal(audit.actor,admin);assert.equal(audit.from_status,"REVIEW");
await adm("select ti_decide($1,2,'REJECTED','لا نحتاج صفحة منفصلة لنفس القصد')",[o.id]);
await adm("insert into ti_jobs(project_id,phase)values($1,'analyze')",[project]);await finish(await claim(),{report:{summary:"اختبار إعادة التحليل"},opportunities:[opportunity]});
assert.equal((await adm("select count(*)::int as n from ti_opportunities")).rows[0].n,1,"Rejected intent must not be regenerated");
// Explicit blocking is terminal, ordinary transient failure retries up to three attempts.
await adm("insert into ti_jobs(project_id,source_id,phase)values($1,$2,'crawl')",[project,source]);const blocked=await claim();await finish(blocked,{},"BLOCKED: robots.txt");
assert.equal((await adm("select status from ti_jobs where id=$1",[blocked.id])).rows[0].status,"blocked");
await adm("insert into ti_jobs(project_id,source_id,phase)values($1,$2,'crawl')",[project,source]);let retry=await claim();await finish(retry,{},"مهلة اتصال");
for(let n=2;n<=3;n++){await db.exec("update ti_jobs set run_after=now()-interval '1 minute' where status='retry'");retry=await claim();assert.equal(retry.attempt,n);await finish(retry,{},"مهلة اتصال");}
assert.equal((await adm("select status from ti_jobs where id=$1",[retry.id])).rows[0].status,"failed");
// Lease recovery and cancellation do not accept a late worker response.
await adm("insert into ti_jobs(project_id,source_id,phase)values($1,$2,'crawl')",[project,source]);const old=await claim();await db.exec("update ti_jobs set lease_expires_at=now()-interval '1 minute' where status='running'");const recovered=await claim();assert.equal(recovered.id,old.id);assert.equal(recovered.attempt,2);assert.notEqual(recovered.lease,old.lease);await assert.rejects(finish(old,doc),/STALE_LEASE/);
await adm("select ti_cancel_job($1,'ألغاه المدير في الاختبار')",[recovered.id]);await assert.rejects(finish(recovered,doc),/STALE_LEASE/);
assert.equal((await as("authenticated",outsider,"select * from ti_analyses")).rows.length,0);
// A selected-project worker cannot drain another project's queue.
const secondProject=(await adm("insert into ti_projects(title,topic)values('ثانٍ — اختبار','خدمة أخرى')returning id")).rows[0].id;
const secondSource=(await adm("insert into ti_sources(project_id,url)values($1,'https://example.com/second')returning id",[secondProject])).rows[0].id;
await adm("insert into ti_jobs(project_id,source_id,phase)values($1,$2,'crawl')",[secondProject,secondSource]);
assert.equal(await rawClaim(project),null);
await db.exec("update ti_jobs set updated_at=now()-interval '3 seconds' where status in('succeeded','failed','blocked','retry','cancelled')");
const secondClaim=await rawClaim(secondProject);assert.equal(secondClaim.project_id,secondProject);
// A second same-host crawl waits for both the first lease and a post-completion cooldown.
await adm("insert into ti_jobs(project_id,source_id,phase)values($1,$2,'crawl')",[project,source]);
assert.equal(await rawClaim(project),null);
await finish(secondClaim,doc);assert.equal(await rawClaim(project),null);
const pending=await claim();assert.equal(pending.project_id,project);await finish(pending,doc);
await assert.rejects(as("anon",null,"select ti_schedule_due('wrong')"),/FORBIDDEN/);
await adm("update ti_sources set next_check_at=now()-interval '1 minute' where id=$1",[source]);
assert.equal((await as("anon",null,"select ti_schedule_due($1) as n",[key])).rows[0].n,1);
assert.equal((await as("anon",null,"select ti_schedule_due($1) as n",[key])).rows[0].n,0);
const future=(await adm("select next_check_at>now()+interval '6 days' as future from ti_sources where id=$1",[source])).rows[0].future;assert.equal(future,true);
const scheduled=await claim();await as("anon",null,"select ti_record_failure($1,$2,$3,$4,$5::jsonb)",[key,scheduled.id,scheduled.lease,"BLOCKED: robots policy",JSON.stringify({phase:"robots"})]);
const failureRun=(await adm("select * from ti_agent_runs where job_id=$1",[scheduled.id])).rows[0];assert.equal(failureRun.status,"blocked");assert.equal(failureRun.details.details.phase,"robots");
// Scheduling is opt-in, at most ten enqueues per invocation and one hundred per UTC day.
await adm("insert into ti_sources(project_id,url,next_check_at) select $1,'https://example.org/'||n,now()-interval '1 minute' from generate_series(1,12)n",[project]);
assert.equal((await adm("select ti_schedule_due('') as n")).rows[0].n,10);
assert.equal((await adm("select ti_schedule_due('') as n")).rows[0].n,2);
await db.exec("insert into ti_jobs(project_id,source_id,phase,status,payload,created_by) select project_id,id,'crawl','succeeded','{\"scheduled\":true}',created_by from ti_sources limit 1");
await db.exec("insert into ti_jobs(project_id,source_id,phase,status,payload,created_by) select p.id,s.id,'crawl','succeeded','{\"scheduled\":true}',p.created_by from ti_projects p join ti_sources s on s.project_id=p.id cross join generate_series(1,100)n limit 100");
await adm("insert into ti_sources(project_id,url,next_check_at)values($1,'https://example.net/daily-limit',now()-interval '1 minute')",[project]);
assert.equal((await adm("select ti_schedule_due('') as n")).rows[0].n,0);
await db.close();
console.log("PASS: admin-only RLS, scoped workers, domain concurrency/cooldown, bounded opt-in scheduling, idempotent ingestion, Arabic persistence, atomic leases/recovery, bounded retries/failure history, cancellation, immutable evidence, auditable optimistic approvals and rejected-intent suppression");
