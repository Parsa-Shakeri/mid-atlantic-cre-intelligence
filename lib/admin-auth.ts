import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createAuthenticatedSupabaseClient } from "@/lib/supabase/auth-server";
import type { AdminProfile } from "@/lib/types";

export async function getCurrentAdmin(): Promise<{ user: User; profile: AdminProfile } | null> {
  const client = await createAuthenticatedSupabaseClient();
  if (!client) return null;
  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;
  const { data: profile } = await client.from("admin_profiles").select("user_id, role, display_name").eq("user_id", user.id).maybeSingle();
  if (!profile) return null;
  return { user, profile: { userId: profile.user_id, role: profile.role, displayName: profile.display_name } };
}

export async function requireAdmin() {
  const client = await createAuthenticatedSupabaseClient();
  if (!client) redirect("/admin/login?error=not-configured");
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/admin/login?error=sign-in-required");
  const { data: profile } = await client.from("admin_profiles").select("user_id, role, display_name").eq("user_id", user.id).maybeSingle();
  if (!profile) redirect("/admin/login?error=not-authorized");
  return { client, user, profile: { userId: profile.user_id, role: profile.role, displayName: profile.display_name } as AdminProfile };
}
