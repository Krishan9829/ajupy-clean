import { getSupabase } from "../lib/supabase";

export async function signUp(email: string, password: string) {
  const supabase = getSupabase();

  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabase();

  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  const supabase = getSupabase();

  return await supabase.auth.signOut();
}

export async function getUser() {
  const supabase = getSupabase();

  const { data } = await supabase.auth.getUser();
  return data.user;
}