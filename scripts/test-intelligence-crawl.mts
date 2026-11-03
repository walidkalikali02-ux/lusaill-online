import assert from "node:assert/strict";
import {isPublicAddress,robotsAllowed,crawlUrl,fetchPermitted,discoverSitemap,type CrawlDependencies,type HttpResult} from "../lib/intelligence/crawl.ts";
import {extractDocument} from "../lib/intelligence/extract.ts";
import {normalizeUrl,importUrlText} from "../lib/intelligence/import.ts";
import {importXlsx} from "../lib/intelligence/xlsx.ts";
import {deflateRawSync} from "node:zlib";

// Synthetic fixtures only: no competitor source or factual verification is claimed.
const article=`<!doctype html><html lang="ar"><head><title>دليل تجريبي لخدمة عامة</title><meta name="description" content="وصف تجريبي"><meta name="author" content="محرر تجريبي"><meta property="article:published_time" content="2026-01-02"><link rel="canonical" href="/guide"><script type="application/ld+json">{"@type":"Article","headline":"تجريبي"}</script></head><body><nav>قائمة</nav><article><header><h1>خدمة تجريبية</h1></header><p>${"معلومات اصطناعية لاختبار استخراج المقال والمصدر فقط. ".repeat(7)}</p><h2>خطوات تجريبية</h2><ol><li>جهز البيانات</li><li>راجع المتطلبات</li></ol><table><tr><th>بند</th><td>تجريبي</td></tr></table><a href="https://official.example.org/source">مصدر تجريبي</a><img src="/cover.webp" alt="صورة تجريبية"><form>FIELD_SHOULD_NOT_LEAK<input value="secret"></form><script>EXECUTE_SHOULD_NOT_LEAK</script></article></body></html>`;
for(const ip of ["127.0.0.1","10.1.2.3","169.254.169.254","100.64.0.1","172.16.0.1","192.168.1.1","0.0.0.0","198.18.0.1","198.51.100.3","203.0.113.1","224.0.0.1","::1","::ffff:127.0.0.1","fd00::1","fe80::1","2001:db8::1","2002:7f00:1::"])assert.equal(isPublicAddress(ip),false,ip);
for(const ip of ["1.1.1.1","8.8.8.8","2606:4700:4700::1111","2a00:1450:4001::1"])assert.equal(isPublicAddress(ip),true,ip);
for(const url of ["http://example.org/a","https://127.0.0.1/","https://[::1]/","https://a.local/","https://user:pass@example.org/","https://example.org:8443/"])assert.throws(()=>normalizeUrl(url));
assert.equal(normalizeUrl("https://EXAMPLE.org/a?z=2&a=1#private"),"https://example.org/a?a=1&z=2");
assert.deepEqual(importUrlText('url,title\n"https://example.org/a#part","عنوان"\nhttps://example.org/a,مكرر\nhttps://127.0.0.1/,مرفوض').urls,["https://example.org/a"]);
assert.equal(importUrlText("https://example.org/a\nhttps://127.0.0.1/").errors.length,1);
const policy="User-agent: *\nDisallow: /private\nAllow: /private/open\nDisallow: /*?secret=\nDisallow: /ملف\nAllow: /same\nDisallow: /same\n";
assert.equal(robotsAllowed(policy,"/private/x"),false);assert.equal(robotsAllowed(policy,"/private/open/x"),true);assert.equal(robotsAllowed(policy,"/same"),true);assert.equal(robotsAllowed(policy,"/file?secret=yes"),false);assert.equal(robotsAllowed(policy,"/%D9%85%D9%84%D9%81"),false);
assert.equal(robotsAllowed("User-agent: *\nDisallow: /\nUser-agent: LusaillTopicBot\nAllow: /guide$", "/guide"),true);
assert.equal(robotsAllowed("User-agent: *\nDisallow: /%7Eguide", "/~guide"),false);
const doc=extractDocument(article,"https://fixture.example.org/start");
assert.equal(doc.quality,"complete");assert.equal(doc.canonical,"https://fixture.example.org/guide");assert.equal(doc.headings[0].level,1);assert.equal(doc.tables[0][0][1],"تجريبي");assert.equal(doc.structuredData.length,1);assert.equal(doc.dates.published,"2026-01-02");assert.equal(doc.authors[0],"محرر تجريبي");assert.equal(doc.links[0].url,"https://official.example.org/source");assert.equal(doc.sections[0].id,"s1");assert(!doc.text.includes("FIELD_SHOULD_NOT_LEAK"));assert(!doc.text.includes("EXECUTE_SHOULD_NOT_LEAK"));assert.equal(doc.fingerprint.length,64);
assert.equal(extractDocument(article.replace(/<article>/,"<div>").replace(/<\/article>/,"</div>"),"https://fixture.example.org/a").quality,"partial");
const gated=extractDocument(article.replace('{"@type":"Article","headline":"تجريبي"}','{"@type":"Article","dateModified":"2026-02-03","author":{"@type":"Person","name":"كاتب تجريبي"},"isAccessibleForFree":false}'),"https://fixture.example.org/a");assert.equal(gated.quality,"partial");assert.equal(gated.dates.modified,"2026-02-03");assert(gated.authors.includes("كاتب تجريبي"));
assert.throws(()=>extractDocument("<html><title>Verify you are human</title><main>captcha</main></html>","https://fixture.example.org/a"));
assert.throws(()=>extractDocument("<main><h1>خدمة</h1><p>تحميل</p></main>","https://fixture.example.org/a"));
assert.equal(extractDocument(article.replace("</article>",`<p>${"س".repeat(65000)}</p></article>`),"https://fixture.example.org/a").quality,"partial");
const response=(status:number,body:string,headers:Record<string,string>={}):HttpResult=>({status,body,headers});
function fixtures(host:string,handler:(url:URL)=>HttpResult,resolve:CrawlDependencies["resolve"]=async()=>[{address:"1.1.1.1",family:4}]){const visited:string[]=[];const deps:CrawlDependencies={resolve,wait:async()=>{},transport:async(url,pin)=>{assert(isPublicAddress(pin.address));visited.push(url.href);assert.equal(url.hostname,host);return handler(url);}};return {deps,visited};}
const allowed=fixtures("allowed.fixture.org",url=>url.pathname==="/robots.txt"?response(200,"User-agent: *\nDisallow: /blocked"):response(200,article,{"content-type":"text/html"}));
assert.equal((await crawlUrl("https://allowed.fixture.org/guide",allowed.deps)).title,"دليل تجريبي لخدمة عامة");
await assert.rejects(()=>crawlUrl("https://allowed.fixture.org/blocked",allowed.deps),/robots/);assert(!allowed.visited.some(u=>u.endsWith("/blocked")));
const failedRobots=fixtures("robots-fail.fixture.org",()=>response(503,"maintenance"));await assert.rejects(()=>crawlUrl("https://robots-fail.fixture.org/a",failedRobots.deps),/robots/);
const noRobots=fixtures("robots-404.fixture.org",url=>url.pathname==="/robots.txt"?response(404,""):response(200,article,{"content-type":"text/html"}));assert.equal((await crawlUrl("https://robots-404.fixture.org/a",noRobots.deps)).quality,"complete");
let transported=false;await assert.rejects(()=>fetchPermitted("https://mixed.fixture.org/a",1000,{resolve:async()=>[{address:"1.1.1.1",family:4},{address:"127.0.0.1",family:4}],transport:async()=>{transported=true;return response(200,article);}}),/خاص/);assert.equal(transported,false);
const redirect=fixtures("redirect.fixture.org",url=>url.pathname==="/robots.txt"?response(404,""):response(302,"",{location:"https://127.0.0.1/secret"}));await assert.rejects(()=>crawlUrl("https://redirect.fixture.org/a",redirect.deps));
const loop=fixtures("loop.fixture.org",url=>url.pathname==="/robots.txt"?response(404,""):response(302,"",{location:"/again"}));await assert.rejects(()=>crawlUrl("https://loop.fixture.org/a",loop.deps),/التوجيه/);assert.equal(loop.visited.length,5);
const sitemap=fixtures("sitemap.fixture.org",url=>url.pathname==="/robots.txt"?response(404,""):response(200,'<urlset><url><loc>https://sitemap.fixture.org/a</loc></url><url><loc>https://other.fixture.org/b</loc></url><url><loc>https://sitemap.fixture.org/c?a=1&amp;b=2</loc></url></urlset>',{"content-type":"application/xml"}));assert.deepEqual(await discoverSitemap("https://sitemap.fixture.org/sitemap.xml",50,sitemap.deps),["https://sitemap.fixture.org/a","https://sitemap.fixture.org/c?a=1&b=2"]);
console.log("PASS: synthetic Arabic extraction/provenance, URL normalization/import, robots longest-match, private/mixed DNS and redirect SSRF rejection, bounded redirects, inaccessible sources and same-host sitemap discovery");

function zip(entries:[string,string][],inflateSize?:number){const locals:Buffer[]=[],central:Buffer[]=[];let offset=0;
 for(const [name,text] of entries){const file=Buffer.from(name),data=Buffer.from(text),compressed=deflateRawSync(data);let crc=0xffffffff;for(const b of data){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}crc=(crc^0xffffffff)>>>0;
  const header=Buffer.alloc(30);header.writeUInt32LE(0x04034b50);header.writeUInt16LE(20,4);header.writeUInt16LE(8,8);header.writeUInt32LE(crc,14);header.writeUInt32LE(compressed.length,18);header.writeUInt32LE(data.length,22);header.writeUInt16LE(file.length,26);
  const directory=Buffer.alloc(46);directory.writeUInt32LE(0x02014b50);directory.writeUInt16LE(20,4);directory.writeUInt16LE(20,6);directory.writeUInt16LE(8,10);directory.writeUInt32LE(crc,16);directory.writeUInt32LE(compressed.length,20);directory.writeUInt32LE(inflateSize??data.length,24);directory.writeUInt16LE(file.length,28);directory.writeUInt32LE(offset,42);locals.push(header,file,compressed);central.push(directory,file);offset+=header.length+file.length+compressed.length;
 }
 const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);return Buffer.concat([...locals,directory,end]);
}
const xlsxEntries:[string,string][]=[
 ["[Content_Types].xml",'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"></Types>'],
 ["xl/workbook.xml",'<workbook xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="روابط" sheetId="1" r:id="rId1"/></sheets></workbook>'],
 ["xl/_rels/workbook.xml.rels",'<Relationships><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'],
 ["xl/sharedStrings.xml",'<sst><si><t>https://xlsx.fixture.org/first</t></si></sst>'],
 ["xl/worksheets/sheet1.xml",'<worksheet><sheetData><row><c r="A1" t="s"><v>0</v></c><c r="A2" t="inlineStr"><is><t>https://xlsx.fixture.org/second?a=1&amp;b=2</t></is></c><c r="A3" t="str"><f>HYPERLINK("https://ignored.fixture.org")</f><v>https://ignored.fixture.org</v></c></row></sheetData></worksheet>'],
];
const xlsx=importXlsx(zip(xlsxEntries));assert.deepEqual(xlsx.urls,["https://xlsx.fixture.org/first","https://xlsx.fixture.org/second?a=1&b=2"]);assert.equal(xlsx.errors.length,1);assert(xlsx.errors[0].includes("صيغ"));
assert.throws(()=>importXlsx(zip([...xlsxEntries,["../escape.xml","<xml/>"]])),/غير آمن/);
assert.throws(()=>importXlsx(zip(xlsxEntries,8_000_001)),/8 ميجابايت/);
assert.throws(()=>importXlsx(zip([...xlsxEntries,["xl/extra.xml",'<!DOCTYPE root [<!ENTITY payload SYSTEM "file:///etc/passwd">]><root>&payload;</root>']])),/الكيانات/);
assert.throws(()=>importXlsx(zip([...xlsxEntries,["xl/_rels/sheet.rels",'<Relationships><Relationship Id="x" Target="https://external.fixture.org/" TargetMode="External"/></Relationships>']])),/العلاقات الخارجية/);
assert.throws(()=>importXlsx(zip([...xlsxEntries,xlsxEntries[0]])),/مكرر/);
assert.throws(()=>importXlsx(zip([...xlsxEntries,["xl/vbaProject.bin","not-code"]])),/الماكرو/);
const tampered=zip(xlsxEntries);tampered[31]^=1;assert.throws(()=>importXlsx(tampered));
console.log("PASS: bounded first-sheet XLSX/shared strings/inline URLs, formula exclusion, traversal/duplicate/macro/external-relationship/DTD/bomb rejection and ZIP integrity");
