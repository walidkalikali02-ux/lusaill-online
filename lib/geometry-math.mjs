export function parseGeometryNumber(value) {
 const text=value.trim().replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[٫,،]/g,'.');
 const part='(?:\\d+(?:\\.\\d+)?|\\.\\d+)';
 if(!new RegExp(`^${part}(?:/${part})?$`).test(text))return null;
 const [numerator,denominator]=text.split('/').map(Number);
 if(denominator===0)return null;
 const number=denominator===undefined?numerator:numerator/denominator;
 return Number.isFinite(number)&&number>=0.000001&&number<=1000000?number:null;
}
export function calculatePrismVolume(shape,a,b,length) {
 if(![a,b,length].every(n=>Number.isFinite(n)&&n>0))return null;
 if(shape!=="rectangular"&&shape!=="triangular")return null;
 const volume=a*b*length*(shape==="triangular"?0.5:1);
 return Number.isFinite(volume)?volume:null;
}
