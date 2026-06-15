"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../lib/supabase"; // ✅ FIXED
import { User } from "@supabase/supabase-js";

const modules = [
  { title: "Saree AI", path: "/saree-ai", icon: "👗" },
  { title: "Textile AI", path: "/textile-ai", icon: "🎨" },
  { title: "Embroidery AI", path: "/embroidery-ai", icon: "🧵" },
  { title: "Color AI", path: "/color-ai", icon: "🌈" },
  { title: "Pattern AI", path: "/pattern-ai", icon: "🔁" },
  { title: "Training Studio", path: "/training", icon: "🧠" },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [credits] = useState(100);

  const router = useRouter();

 useEffect(() => {
  const supabase = getSupabase();

  const initUser = async () => {
    // ✅ STEP 1: get session first
    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData?.session?.user) {
      setUser(sessionData.session.user);
      setLoading(false);
      return;
    }

    // ✅ STEP 2: fallback
    const { data } = await supabase.auth.getUser();
    setUser(data?.user ?? null);
    setLoading(false);
  };

  initUser();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);

useEffect(() => {
  if (loading) return;

  // ✅ Only redirect AFTER loading complete
  if (!user) {
    router.replace("/login"); // 🔥 change /auth → /login
  }
}, [user, loading, router]);

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // ❌ USER NA HO
  if (!user) return null;

  // 🔥 LOGOUT
  const handleLogout = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  // ✅ UI
  return (
    <div className="min-h-screen bg-black text-white p-8">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-bold">🚀 AJUPY AI Dashboard</h1>

          <p className="text-zinc-400 mt-2 max-w-xl">
            AI OS for Fashion Industry
          </p>

          <p className="text-green-400 mt-3 text-sm">
            Logged in as: {user.email ?? "No Email"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-xl">
            Credits: {credits}
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-xl"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {modules.map((module) => (
          <Link
            key={module.title}
            href={module.path}
            className="bg-zinc-900 p-6 rounded-2xl hover:scale-105 transition"
          >
            <div className="text-4xl">{module.icon}</div>
            <h3 className="text-xl mt-4">{module.title}</h3>
          </Link>
        ))}
      </div>

    </div>
  );
}