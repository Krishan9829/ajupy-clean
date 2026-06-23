"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageCard from "../../components/ai/image-card";
import { useRouter } from "next/navigation";

type Collection = {
  id: number;
  image_url: string;
  prompt: string;
  user_id?: string;
  created_at?: string;
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      // ✅ FIXED AUTH (NO NETWORK FAIL)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setErrorMsg("Please login first");
        router.push("/login"); // 🔥 redirect
        return;
      }

      const userId = session.user.id;

      // 🔥 FETCH USER DATA
      const { data, error } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMsg(error.message || "Failed to load collections");
        setCollections([]);
        return;
      }

      setCollections(data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong");
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 SEARCH FILTER
  const filtered = collections.filter((item) =>
    item.prompt?.toLowerCase().includes(search.toLowerCase())
  );

  // ⏳ LOADING UI
  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-40 bg-zinc-800 animate-pulse rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white">
          🗂️ Your Collections
        </h1>

        <input
          type="text"
          placeholder="Search designs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-lg text-sm outline-none focus:border-white text-white"
        />
      </div>

      {/* ERROR */}
      {errorMsg && (
        <div className="mb-4 text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      {/* STATS */}
      <p className="text-sm text-zinc-500 mb-4">
        Total Designs: {filtered.length}
      </p>

      {/* EMPTY */}
      {filtered.length === 0 ? (
        <div className="text-center mt-10 text-zinc-500">
          <p>No designs found.</p>
          <p className="text-sm">
            Try generating some designs first 👗
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <ImageCard key={item.id} img={item} />
          ))}
        </div>
      )}

    </div>
  );
}