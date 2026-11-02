import assert from "node:assert/strict";
import { parseInvitation } from "../lib/cms/invitation.ts";
const origin="https://project.supabase.co";
assert.deepEqual(parseInvitation(origin+"/auth/v1/verify?token=example&type=invite&redirect_to=https://evil.example",origin),{type:"invite",token_hash:"example"});
assert.equal(parseInvitation(origin+"/auth/v1/verify?token_hash=example&type=recovery",origin).type,"recovery");
for(const link of ["https://evil.example/auth/v1/verify?token=x&type=invite",origin+"/other?token=x&type=invite",origin+"/auth/v1/verify?token=x&type=signup",origin+"/auth/v1/verify?type=invite","invalid"])assert.throws(()=>parseInvitation(link,origin));
console.log("PASS: invitation links accept only this project's invite/recovery tokens and never follow redirects");
