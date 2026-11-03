import {type SupabaseClient} from '@supabase/supabase-js';
import {crawlUrl} from './crawl';
import {analyzeTopic} from './analysis';
export async function runIntelligenceJob(client:SupabaseClient,key='',projectId?:string){
 const {data:job,error}=await client.rpc('ti_claim_job',{worker_key:key,project_filter:projectId??null});if(error)throw Error('تعذر حجز المهمة؛ تحقق من تثبيت مخطط المحرك.');if(!job)return {worked:false};
 try{
  const result=job.phase==='crawl'?{...await crawlUrl(job.url),agentRuns:[{agent:'collector_extractor',status:'succeeded',details:{robotsEnforced:true,dnsPinned:true}}]}:await analyzeTopic(job.payload);
  const finish=await client.rpc('ti_finish_job',{worker_key:key,job_id:job.id,lease:job.lease,result,failure:null});if(finish.error)throw Error('تعذر حفظ النتيجة أو انتهى حجز المهمة.');
  return {worked:true,id:job.id,phase:job.phase,status:'succeeded'};
 }catch(e){const message=e instanceof Error?e.message:'تعذر تنفيذ المهمة';const permanent=/BLOCKED:|robots|عنوان شبكة|حاجز وصول|نوع المصدر|غير كافٍ|ضغط استجابة/.test(message);const failure=(permanent&&!message.startsWith('BLOCKED:')?'BLOCKED:':'')+message.slice(0,1500);const finished=await client.rpc('ti_finish_job',{worker_key:key,job_id:job.id,lease:job.lease,result:null,failure});if(finished.error)throw Error('لم يُحفظ فشل المهمة؛ ستُستعاد بعد انتهاء الحجز.');return {worked:true,id:job.id,phase:job.phase,status:permanent?'blocked':'retry',error:message};}
}
