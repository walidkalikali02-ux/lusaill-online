import assert from 'node:assert/strict';
import { calculateResidentialBill as calculate, parseConsumption } from '../lib/electricity-tariff.ts';
// Independent expected amounts in EGP from the regulator's April 2026 table.
const examples = [[0,0,9],[1,.68,1],[50,34,1],[51,34.78,2],[100,73,2],[101,95.95,6],[200,190,6],[201,191.55,11],[350,422.5,11],[351,424.45,15],[650,1007.5,15],[651,1367.1,25],[1000,2100,25],[1001,2582.58,40],[1200,3096,40]];
for (const [kwh, energy, service] of examples) {
  const result = calculate(kwh);
  assert.equal(result.energy, energy, `${kwh} kWh energy`);
  assert.equal(result.service, service, `${kwh} kWh service`);
  assert.ok(Math.abs(result.total - energy - service) < 1e-9, `${kwh} kWh subtotal`);
}
for (const value of [-1, 1.5, NaN, Infinity, 1000001]) assert.throws(() => calculate(value), RangeError);
for (const input of ['', ' ', '-2', '2.5', 'NaN', '2e3', '1000001', '12x']) assert.equal(parseConsumption(input), null);
for (const input of ['200', ' 200 ', '٢٠٠', '۲۰۰']) assert.equal(parseConsumption(input), 200);
assert.equal(parseConsumption('٠'), 0);
console.log(`PASS: ${examples.length} tariff cases, tier resets, invalid inputs and Arabic digits`);
