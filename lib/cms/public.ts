import { connection } from "next/server";
import "server-only";
import { publicCmsClient } from "./server";
import { documentSchema, type CmsDocument } from "./model";
export async function publishedCmsDocuments(): Promise<CmsDocument[]> {
  const client = publicCmsClient();
  if (!client) return [];
  await connection();
  const { data, error } = await client
    .from("cms_publications")
    .select("document");
  if (error) throw new Error("CMS_PUBLICATION_READ_FAILED");
  return (data ?? []).map((r) => documentSchema.parse(r.document));
}
export async function publishedCmsDocument(slug: string) {
  const client = publicCmsClient();
  if (!client) return null;
  await connection();
  const { data, error } = await client
    .from("cms_publications")
    .select("document")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error("CMS_PUBLICATION_READ_FAILED");
  return data ? documentSchema.parse(data.document) : null;
}

