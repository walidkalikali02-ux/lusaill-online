import test from 'node:test';
import assert from 'node:assert/strict';
import { parseGeometryNumber, calculatePrismVolume } from '../lib/geometry-math.mjs';
test('Arabic, Persian, fractional and decimal lengths preserve their value',()=>{
 for(const [text,expected] of [['3/2',1.5],['١/٢',0.5],['۱٫۵',1.5],['0.25',0.25],['.5',0.5],['١،٥',1.5],['2,5',2.5]])assert.equal(parseGeometryNumber(text),expected,text);
});
test('ambiguous, invalid, non-positive and unbounded lengths are rejected',()=>{
 for(const text of ['', '0', '-1', '1/0', '1/2/3', '1 1/2', '1 2', '1e3', 'Infinity', 'abc', '1.2.3', '1000001','0.0000001'])assert.equal(parseGeometryNumber(text),null,text);
});
test('volume uses three lengths and one half only for a triangular cross-section',()=>{
 assert.equal(calculatePrismVolume('rectangular',7,4,3),84);
 assert.equal(calculatePrismVolume('rectangular',1.5,4/3,2.5),5);
 assert.equal(calculatePrismVolume('triangular',8,5,12),240);
 assert.equal(calculatePrismVolume('triangular',0.5,0.4,2),0.2);
 for(const shape of ['sphere','bad'])assert.equal(calculatePrismVolume(shape,2,3,4),null);
 assert.equal(calculatePrismVolume('rectangular',0,3,4),null);
 assert.equal(calculatePrismVolume('rectangular',Infinity,3,4),null);
});
