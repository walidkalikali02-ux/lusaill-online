export function parseDecimal(value:string):bigint|null;
export function depreciation(cost:string,residual:string,years:string):{error:string;annual?:never;monthly?:never;depreciable?:never}|{error?:never;annual:number;monthly:number;depreciable:number};
export function breakEven(price:string,variable:string,fixed:string,target:string):{error:string;contribution?:never;breakEvenUnits?:never;targetUnits?:never}|{error?:never;contribution:number;breakEvenUnits:number;targetUnits:number};
