import assert from 'node:assert/strict';
import { parseInlineLinks } from '../lib/inline-markdown-links.ts';

const sample = 'حمّل [الملف](https://www.lusaill.online/examples/sample.pdf) ثم [المصدر](https://example.org/wiki/Topic_(detail)).';
assert.deepEqual(parseInlineLinks(sample), [
  {kind:'text',text:'حمّل '},
  {kind:'link',label:'الملف',href:'/examples/sample.pdf'},
  {kind:'text',text:' ثم '},
  {kind:'link',label:'المصدر',href:'https://example.org/wiki/Topic_(detail)'},
  {kind:'text',text:'.'},
]);
for (const raw of ['javascript:alert(1)','data:text/html,test','//example.org','https://bad host/']) {
  const text = `[رابط](${raw})`;
  assert.deepEqual(parseInlineLinks(text), [{kind:'text',text}]);
}
assert.deepEqual(parseInlineLinks('[أ](#target)'), [{kind:'link',label:'أ',href:'#target'}]);
assert.deepEqual(parseInlineLinks('[دليل](/knowledge/ai-pdf-analysis)'), [{kind:'link',label:'دليل',href:'/knowledge/ai-pdf-analysis'}]);
assert.deepEqual(parseInlineLinks('نص <script> لا يفسر كـHTML'), [{kind:'text',text:'نص <script> لا يفسر كـHTML'}]);
assert.deepEqual(parseInlineLinks('[بلا نهاية](https://example.org'), [{kind:'text',text:'[بلا نهاية](https://example.org'}]);
console.log('PASS inline links: downloads, internal links, balanced URLs, invalid protocols and plain text');
