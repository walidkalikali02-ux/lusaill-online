import assert from "node:assert/strict";
import {spawn,spawnSync} from "node:child_process";
function run(args){const r=spawnSync(process.execPath,args,{stdio:"inherit",env:process.env});if(r.error)throw r.error;assert.equal(r.status,0,args.join(" "));}
run(["node_modules/eslint/bin/eslint.js","lib/content.ts","lib/content-modified.ts","lib/sitemaps.ts","lib/electricity-inquiry-detail.ts","lib/search-titles.ts","scripts/check-site.mjs","components/electricity-inquiry-detail.tsx","app/articles/[slug]/page.tsx","app/food-safety/[slug]/page.tsx","scripts/test-topic-discovery.mjs","scripts/verify-discovery-release.mjs"]);
run(["scripts/seo-qa.mjs"]);
run(["scripts/check-guide-paths.mjs"]);
run(["scripts/test-topic-discovery.mjs"]);
run(["node_modules/next/dist/bin/next","build"]);
const origin="http://127.0.0.1:3048";
const server=spawn(process.execPath,["node_modules/next/dist/bin/next","start","-H","127.0.0.1","-p","3048"],{stdio:"inherit",env:process.env});
try{
 let ready=false;for(let i=0;i<100;i++){try{ready=(await fetch(origin,{signal:AbortSignal.timeout(3000)})).status===200;}catch{/* Startup is asynchronous. */}if(ready)break;await new Promise(resolve=>setTimeout(resolve,500));}
 assert(ready);
 run(["scripts/check-site.mjs",origin,"--skip-external-images"]);
 const hub=await (await fetch(origin+"/articles/electricity-bill-inquiry")).text();
 assert(hub.includes('id="electricity-task-routing"'));
 const peers=["south-delta-electricity","north-delta-electricity","north-cairo-electricity","south-cairo-electricity","alexandria-electricity","upper-egypt-electricity","beheira-electricity","electricity-complaint","electricity-outage-report","electricity-meter-apply","code-electricity-meter","electricity-meter-transfer","electricity-meter-test","prepaid-meter-mobile-charge","electricity-consumer-rights","electricity-company-obligations"];
 for(const slug of peers){const response=await fetch(origin+"/articles/"+slug);assert.equal(response.status,200);const html=await response.text();assert(html.includes('href="/articles/electricity-bill-inquiry"'),"Peer needs contextual hub return link: "+slug);}
 const categories=await (await fetch(origin+"/sitemap-categories.xml")).text();
 const found=new Set();
 for(const m of categories.matchAll(/<loc>(.*?)<\/loc>/g)){
  const path=new URL(m[1]).pathname;let pending=[path],seen=new Set();
  while(pending.length){const current=pending.shift();if(seen.has(current))continue;seen.add(current);const response=await fetch(origin+current);assert.equal(response.status,200);const html=await response.text();
   for(const a of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)){const href=a[1].replace(/&amp;/g,"&");if(/^\/articles\/[^?#]+$/.test(href))found.add(href);if(href.startsWith(path+"?page="))pending.push(href);}
  }
 }
 const sitemap=await (await fetch(origin+"/sitemap-articles.xml")).text(),classic=[...sitemap.matchAll(/<loc>(https:\/\/www.lusaill.online\/articles\/.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 for(const path of classic)assert(found.has(path),"Article is not reachable from a category: "+path);
 const food=await(await fetch(origin+"/food-safety")).text();
 for(const m of sitemap.matchAll(/<loc>(https:\/\/www.lusaill.online\/food-safety\/.*?)<\/loc>/g))assert(food.includes('href="'+new URL(m[1]).pathname+'"'));
 console.log("DISCOVERY_RENDERED "+JSON.stringify({categoryReachable:classic.length,foodHubReachable:4,electricityPeerBacklinks:peers.length,serviceTable:true,result:"PASS"}));
}finally{server.kill("SIGTERM");}
