import "server-only";

export function supabaseRequest(path: string, init: RequestInit = {}, token?: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) throw new Error("Supabase is not configured");
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  if (token) headers.set("Authorization", "Bearer " + token);
  if (init.body) headers.set("Content-Type", "application/json");
  return fetch(base.replace(/\/$/, "") + path, { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(10000) });
}

export async function isOrderAdmin(token: string) {
  const response = await supabaseRequest("/rest/v1/cms_admins?select=user_id&limit=1", {}, token);
  return response.ok && (await response.json()).length === 1;
}
