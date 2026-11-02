// Parse only the project's original Supabase verification link; never navigate to its redirect.
export function parseInvitation(value: string, projectUrl: string) {
  const link = new URL(value.trim());
  if (link.origin !== new URL(projectUrl).origin || link.pathname !== "/auth/v1/verify") throw Error("INVALID_INVITATION");
  const type = link.searchParams.get("type");
  const token_hash = link.searchParams.get("token_hash") ?? link.searchParams.get("token");
  if ((type !== "invite" && type !== "recovery") || !token_hash || token_hash.length > 2000) throw Error("INVALID_INVITATION");
  return { type, token_hash } as { type: "invite" | "recovery"; token_hash: string };
}
