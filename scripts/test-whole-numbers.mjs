import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {explainWholeNumbers} from '../lib/whole-number-arithmetic.mjs';
const course=JSON.parse(readFileSync(new URL('../lib/whole-numbers-course.json',import.meta.url),'utf8').replace(/^\uFEFF/,''));
let checked=0;
function result(expression){const p=expression.split(' ');let a=p[0];for(let i=1;i<p.length;i+=2){const x=explainWholeNumbers(a,p[i+1],p[i]);assert.equal(x.error,undefined,expression);a=x.result;}return a;}
assert.equal(course.lessons.length,15);
for(const [i,l] of course.lessons.entries()){
 assert.equal(l.order,i+1);assert.equal(l.cases.length,2);assert.equal(l.worksheet.length,6);assert.equal(new Set(l.quiz.choices).size,4);assert.equal(l.quiz.choices[l.quiz.correctIndex],l.cases[0].result);assert.ok(l.title.length+9<=60);assert.ok(l.description.length<=160);
 for(const x of l.cases){assert.equal(result(x.expression),x.result);checked++;}
 for(const x of l.worksheet){const p=x.expression.split(' ');const r=result(x.expression);if(x.task==='family'){assert.equal(explainWholeNumbers(p[0],p[2],'+').facts.join('؛ '),x.answer);}else assert.equal(r,x.answer);checked++;
 if(x.task==='pattern'){const rows=x.dataTable.rows.map(r=>r.map(Number));const d=rows[1][1]-rows[0][1];assert.ok(rows.slice(1).every((r,i)=>r[0]-rows[i][0]===1&&r[1]-rows[i][1]===d));assert.equal(String(rows.at(-1)[1]+d),x.answer);}}
}
for(let a=0;a<100;a++)for(let b=0;b<100;b++){assert.equal(explainWholeNumbers(String(a),String(b),'+').result,String(a+b));if(a>=b)assert.equal(explainWholeNumbers(String(a),String(b),'-').result,String(a-b));}
for(const [a,b,op,want] of [['4002','1768','-','2234'],['10000','6437','-','3563'],['999999','999999','+','1999998'],['٠','٠','+','0'],['٧٦','٤٨','+','124'],['۰۸۱','۴۶','-','35']])assert.equal(explainWholeNumbers(a,b,op).result,want);
for(const [a,b,op] of [['1.5','2','+'],['-3','2','+'],['2','4','-'],['1/2','3','+'],['','3','+'],['1,000','3','+'],['1000000','3','+'],['1e3','3','+'],['2','3','*'],['<script>','3','+']])assert.ok(explainWholeNumbers(a,b,op).error);
const chain=explainWholeNumbers('4002','1768','-');assert.ok(chain.steps.some(s=>s.includes('كل منزلة صفرية')));assert.ok(explainWholeNumbers('47','28','+').steps.some(s=>s.includes('ونحمل 1')));
console.log(`PASS: ${checked} published cases/worksheet answers, fact families, table rules, 15 quizzes; 15050 small operand operations and boundary/Arabic/invalid inputs.`);
