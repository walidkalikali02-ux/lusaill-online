export function parseTransferNumber(text) {
 const normalized=text.trim().replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[٫،,]/g,'.');
 if(!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalized))return null;
 const value=Number(normalized);return Number.isFinite(value)&&value>=0.000001&&value<=1000000?value:null;
}
export function estimateTransferSeconds(size,unit,rate){
 if(!['MB','GB'].includes(unit)||![size,rate].every(n=>Number.isFinite(n)&&n>=0.000001&&n<=1000000))return null;
 return size*(unit==='GB'?1000:1)*8/rate;
}
