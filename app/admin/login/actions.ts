"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAuthenticatedSupabaseClient } from "@/lib/supabase/auth-server";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect("/admin/login?error=missing-credentials");
  const client = await createAuthenticatedSupabaseClient();
  if (!client) redirect("/admin/login?error=not-configured");
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logoutAction() {
  const client = await createAuthenticatedSupabaseClient();
  if (client) await client.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login?status=signed-out");
}
