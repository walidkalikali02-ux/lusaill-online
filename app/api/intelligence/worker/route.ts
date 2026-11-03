import {publicCmsClient} from '@/lib/cms/server';
import {runIntelligenceJob} from '@/lib/intelligence/worker';
export const dynamic='force-dynamic';
export const maxDuration=300;
export async function GET(request:Request){if(!process.env.CRON_SECRET||request.headers.get('authorization')!==`Bearer ${process.env.CRON_SECRET}`)return new Response(null,{status:401});const client=publicCmsClient();if(!client)return new Response(null,{status:503});const scheduled=await client.rpc('ti_schedule_due',{worker_key:process.env.CRON_SECRET});if(scheduled.error)return Response.json({error:'تعذر جدولة التحديثات'},{status:503});const results=[];for(let i=0;i<2;i++){const r=await runIntelligenceJob(client,process.env.CRON_SECRET);results.push(r);if(!r.worked||r.phase==='analyze')break;}return Response.json({scheduled:scheduled.data,results},{headers:{'Cache-Control':'no-store'}});}
