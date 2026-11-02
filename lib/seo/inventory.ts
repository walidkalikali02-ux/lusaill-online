import "server-only";
import {articles} from "../content";
import {documentSchema} from "../cms/model";
import {cmsClient} from "../cms/server";
import {makeInventory} from "./inventory-core";
export async function seoInventory(client:Awaited<ReturnType<typeof cmsClient>>){
 const [{data:saved,error},{data:publicRows,error:publicError}]=await Promise.all([client.from("cms_documents").select("document"),client.from("cms_publications").select("document")]);if(error||publicError)throw Error("INVENTORY_FAILED");
 return makeInventory(articles,(saved??[]).map(r=>documentSchema.parse(r.document)),(publicRows??[]).map(r=>documentSchema.parse(r.document)));
}
