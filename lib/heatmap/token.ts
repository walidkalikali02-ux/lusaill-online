import {createHmac,randomUUID,timingSafeEqual} from "node:crypto";
import {publicHeatmapPath} from "./model";
export type HeatmapGrant={id:string;path:string;width:number;version:string;test:boolean;expires:number};
export function signGrant(input:Omit<HeatmapGrant,"id"|"expires">,key:string,now=Date.now()){
 const grant:HeatmapGrant={...input,id:randomUUID(),expires:Math.floor(now/1000)+1800};const value=Buffer.from(JSON.stringify(grant)).toString("base64url");
 return `${value}.${createHmac("sha256",key).update(value).digest("base64url")}`;
}
export function verifyGrant(token:string,key:string,now=Date.now()):HeatmapGrant|null{
 try{if(token.length>1400)return null;const [value,signature,extra]=token.split(".");if(extra||!signature)return null;const expected=createHmac("sha256",key).update(value).digest();const received=Buffer.from(signature,"base64url");if(received.length!==expected.length||!timingSafeEqual(expected,received))return null;
 const grant=JSON.parse(Buffer.from(value,"base64url").toString());if(!publicHeatmapPath(grant.path)||!Number.isInteger(grant.width)||grant.width<280||grant.width>3000||!/^[-a-zA-Z0-9]{1,40}$/.test(grant.version)||typeof grant.test!=="boolean"||!Number.isInteger(grant.expires)||grant.expires<=now/1000||grant.expires>now/1000+1801||!/^[0-9a-f-]{36}$/.test(grant.id))return null;return grant;
 }catch{return null;}
}
