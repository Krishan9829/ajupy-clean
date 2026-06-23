import { supabaseAdmin } from "../lib/supabaseAdmin";

// =========================
// 🔥 GET LATEST GENERATIONS
// =========================
export async function getGenerations(limit = 50) {
  const { data, error } = await supabaseAdmin
    .from("generations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data;
}

// =========================
// 🔥 GET TOTAL COUNT
// =========================
export async function getGenerationsCount() {
  const { count, error } = await supabaseAdmin
    .from("generations")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(error.message);

  return count || 0;
}

// =========================
// 🔥 DELETE GENERATION
// =========================
export async function deleteGeneration(id: string) {
  const { error } = await supabaseAdmin
    .from("generations")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  return { success: true };
}

// =========================
// 🔥 GET USER STATS (SaaS base feature)
// =========================
export async function getUserStats() {
  const { data, error } = await supabaseAdmin
    .from("generations")
    .select("user_id");

  if (error) throw new Error(error.message);

  const map = new Map<string, number>();

  data?.forEach((row) => {
    map.set(row.user_id, (map.get(row.user_id) || 0) + 1);
  });

  return Array.from(map.entries()).map(([user_id, count]) => ({
    user_id,
    count,
  }));
}

// =========================
// 🔥 TODAY GENERATIONS (analytics)
// =========================
export async function getTodayGenerations() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabaseAdmin
    .from("generations")
    .select("*")
    .gte("created_at", today.toISOString());

  if (error) throw new Error(error.message);

  return data;
}