import test from 'node:test';
import assert from 'node:assert/strict';
import {parseTransferNumber,estimateTransferSeconds} from '../lib/transfer-estimate.mjs';
test('decimal and Arabic inputs parse while invalid inputs are rejected',()=>{
 for(const [text,value] of [['١٫٥',1.5],['2.5',2.5],[' 80 ',80],['۰٫۵',0.5]])assert.equal(parseTransferNumber(text),value);
 for(const text of ['','0','-1','1/2','1 2','NaN','Infinity','1000001'])assert.equal(parseTransferNumber(text),null,text);
});
test('decimal file sizes convert bytes to bits once and preserve time units',()=>{
 assert.equal(estimateTransferSeconds(100,'MB',100),8);
 assert.equal(estimateTransferSeconds(1,'GB',80),100);
 assert.equal(estimateTransferSeconds(2,'GB',100),160);
 assert.equal(estimateTransferSeconds(0.5,'GB',200),20);
 for(const args of [[1,'MiB',80],[1,'GB',0],[-1,'MB',10],[Infinity,'MB',10],[1,'GB',1000001]])assert.equal(estimateTransferSeconds(...args),null);
});
