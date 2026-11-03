import assert from "node:assert/strict";
import {requestJson} from "../lib/seo/transport.ts";
import {indexingSnapshot,snapshotContains} from "../lib/seo/search-console.ts";
const old={kind:"indexing" as const,from:"2026-10-23",to:"2026-10-23",reason:"Discovered – currently not indexed",rows:[{url:"https://www.lusaill.online/articles/example"}],importedAt:"2026-11-03T00:00:00Z"};
const newer={...old,to:"2026-10-30",from:"2026-10-30",importedAt:"2026-11-01T00:00:00Z"};
assert.equal(indexingSnapshot([]),null);
assert.equal(indexingSnapshot([old,newer])?.to,"2026-10-30","Prefer newest data date, not the latest import timestamp");
assert.equal(snapshotContains(indexingSnapshot([old]),"/articles/example"),true);
assert.equal(snapshotContains(indexingSnapshot([old]),"/articles/absent"),false);
assert.equal(snapshotContains(null,"/articles/example"),false);
assert.equal(indexingSnapshot([{...old,kind:"performance"}]),null);
const original=globalThis.fetch;
try {
 const bodies:string[]=[];let calls=0;const body=JSON.stringify({action:"audit",requestId:"same-retry-id",targets:["article:test"]});
 globalThis.fetch=(async(_,init)=>{calls++;bodies.push(String(init?.body));if(calls===1)throw new TypeError("Network disconnected after sending");return Response.json({saved:true});}) as typeof fetch;
 assert.deepEqual(await requestJson("https://example.test/seo",{method:"POST",body}),{saved:true});assert.equal(calls,2);assert.deepEqual(bodies,[body,body]);
 calls=0;globalThis.fetch=(async()=>{calls++;return Response.json({error:"Not authorized"},{status:401});}) as typeof fetch;
 await assert.rejects(requestJson("https://example.test/seo"),/Not authorized/);assert.equal(calls,1);
 calls=0;const controller=new AbortController();controller.abort();globalThis.fetch=(async()=>{calls++;throw new TypeError("Abort");}) as typeof fetch;
 await assert.rejects(requestJson("https://example.test/seo",{signal:controller.signal}),/إلغاء/);assert.equal(calls,1);
 calls=0;globalThis.fetch=(async()=>{calls++;return Response.json(calls===1?{error:"Temporary"}:{saved:true},{status:calls===1?503:200});}) as typeof fetch;
 assert.deepEqual(await requestJson("https://example.test/seo"),{saved:true});assert.equal(calls,2);
 console.log("PASS: interrupted audit retry preserves request body/id, retryable server failures recover, and authorization/abort failures do not retry");
} finally {globalThis.fetch=original;}
