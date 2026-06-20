import { createClient, SupabaseClient } from "@supabase/supabase-js";

// 🔥 Validate ENV
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("❌ Missing Supabase Admin environment variables");
}

// 🔥 Single stable admin instance
const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ✅ same function name (no change)
export const getSupabaseAdmin = () => supabaseAdmin;