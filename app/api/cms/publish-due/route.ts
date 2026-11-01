import { createClient } from "@supabase/supabase-js";
export async function GET(request: Request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  )
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  )
    return Response.json(
      { error: "Scheduler not configured" },
      { status: 503 },
    );
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );
  const { data, error } = await client.rpc("cms_publish_due");
  if (error)
    return Response.json(
      { error: "Scheduled publication failed" },
      { status: 500 },
    );
  return Response.json({ published: data });
}
