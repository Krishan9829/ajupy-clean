"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UserMenu() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/auth/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
    >
      Logout
    </button>
  );
}