"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getPlanMeta } from "@/lib/saas";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
      setProfile(data);
      setName(data?.name || user.email?.split("@")[0] || "Designer");
      setLoading(false);
    };
    init();
  }, []);

  const save = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("users").update({ name }).eq("id", user.id);
  };

  if (loading) return <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">Loading profile…</div>;

  return (
    <div className="min-h-screen bg-[#050816] p-6 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-3xl font-semibold">Profile</h1>
          <p className="mt-2 text-sm text-slate-400">Manage your account, plan, and credits in the studio.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b1122] p-6">
          <label className="text-sm text-slate-400">Display name</label>
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111827] px-3 py-2" />
          <button onClick={save} className="mt-4 rounded-2xl bg-fuchsia-600 px-4 py-2 font-semibold">Save profile</button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[#0b1122] p-6">
            <div className="text-sm uppercase tracking-[0.3em] text-slate-400">Subscription</div>
            <div className="mt-4 text-2xl font-semibold">{getPlanMeta(profile?.plan).name}</div>
            <div className="mt-2 text-sm text-slate-400">{profile?.plan === "pro" ? "Premium access active" : "Upgrade for more credits"}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#0b1122] p-6">
            <div className="text-sm uppercase tracking-[0.3em] text-slate-400">Credits</div>
            <div className="mt-4 text-2xl font-semibold">{profile?.credits ?? 0}</div>
            <div className="mt-2 text-sm text-slate-400">Available for your next generation.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
