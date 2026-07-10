"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth/login");
        return;
      }
      const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();
      setPlan(profile?.plan || "free");
      setLoading(false);
    };
    init();
  }, [router]);

  const checkout = async () => {
    const response = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: "pro" }) });
    const data = await response.json();
    if (data.url) window.location.href = data.url;
  };

  if (loading) return <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">Loading billing…</div>;

  return (
    <div className="min-h-screen bg-[#050816] p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-3xl font-semibold">Billing & subscriptions</h1>
          <p className="mt-2 text-sm text-slate-400">Upgrade to Pro for higher generation volume, more credits, and enterprise-grade studio access.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[#0b1122] p-6">
            <div className="text-sm uppercase tracking-[0.3em] text-slate-400">Current plan</div>
            <div className="mt-4 text-3xl font-semibold">{plan === "pro" ? "Pro" : "Free"}</div>
            <div className="mt-2 text-sm text-slate-400">{plan === "pro" ? "You have premium generation access and a larger credit allotment." : "You are on the free tier with limited generations."}</div>
          </div>
          <div className="rounded-3xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-6">
            <div className="text-sm uppercase tracking-[0.3em] text-fuchsia-300">Pro plan</div>
            <div className="mt-4 text-3xl font-semibold">$29/mo</div>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>• 30 credits monthly</li>
              <li>• Priority studio rendering</li>
              <li>• Advanced collection management</li>
            </ul>
            <button onClick={checkout} className="mt-6 rounded-2xl bg-fuchsia-600 px-4 py-3 font-semibold">Upgrade to Pro</button>
          </div>
        </div>
      </div>
    </div>
  );
}
