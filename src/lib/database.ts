import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function ensureUserProfile(userId: string, email: string) {
  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  if (existing) return existing;

  const { data, error } = await supabaseAdmin.from("users").insert({
    id: userId,
    email,
    name: email.split("@")[0],
    plan: "free",
    credits: 3,
    avatar: null,
  }).select("*").single();

  if (error) throw error;
  return data;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabaseAdmin.from("users").select("*").eq("id", userId).single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin.from("users").update(updates).eq("id", userId).select("*").single();
  if (error) throw error;
  return data;
}

export async function consumeCredits(userId: string, plan: string) {
  const profile = await getProfile(userId);
  const planCredits = plan === "pro" ? 30 : 3;
  if (profile.credits <= 0) return { ok: false, reason: "insufficient_credits" as const };
  const nextCredits = Math.max(profile.credits - 1, 0);
  await updateProfile(userId, { credits: nextCredits });
  return { ok: true, remaining: nextCredits, limit: planCredits };
}

export async function resetCredits(userId: string, plan: string) {
  const limit = plan === "pro" ? 30 : 3;
  await updateProfile(userId, { credits: limit });
}

export async function createGenerationRecord(input: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin.from("generations").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function listGenerations(userId: string) {
  const { data, error } = await supabaseAdmin.from("generations").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createCollection(userId: string, name: string) {
  const { data, error } = await supabaseAdmin.from("collections").insert({ user_id: userId, name }).select("*").single();
  if (error) throw error;
  return data;
}

export async function listCollections(userId: string) {
  const { data, error } = await supabaseAdmin.from("collections").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addCollectionItem(collectionId: string, imageUrl: string, prompt: string) {
  const { data, error } = await supabaseAdmin.from("collection_items").insert({ collection_id: collectionId, image_url: imageUrl, prompt }).select("*").single();
  if (error) throw error;
  return data;
}

export async function listCollectionItems(collectionId: string) {
  const { data, error } = await supabaseAdmin.from("collection_items").select("*").eq("collection_id", collectionId).order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createSubscriptionRecord(input: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin.from("subscriptions").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function getAdminMetrics() {
  const [{ count: userCount }, { count: generationCount }, { count: revenueCount }] = await Promise.all([
    supabaseAdmin.from("users").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("generations").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("subscriptions").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalUsers: userCount || 0,
    totalGenerations: generationCount || 0,
    totalRevenue: revenueCount || 0,
  };
}
