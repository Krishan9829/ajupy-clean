"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "../../lib/supabase";
import ImageCard from "../../components/ai/image-card";

type Collection = {
  id: number;
  image: string;
  prompt: string;
  user_id?: string;
  created_at?: string;
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ keep your approach
  const supabase = getSupabase();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      if (!supabase) {
        console.error("❌ Supabase not initialized");
        setErrorMsg("Server issue. Try again later.");
        setCollections([]);
        setLoading(false);
        return;
      }

      // 🔥 NEW: get current user
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user) {
        setErrorMsg("User not authenticated");
        setCollections([]);
        setLoading(false);
        return;
      }

      const userId = userData.user.id;

      // 🔥 FIX: fetch only user's data
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("user_id", userId)
        .order("id", { ascending: false });

      if (error) {
        console.error(error);
        setErrorMsg("Failed to load collections");
        setCollections([]);
      } else {
        setCollections((data || []) as Collection[]);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong");
      setCollections([]);
    }

    setLoading(false);
  };

  // 🔍 SEARCH FILTER
  const filtered = collections.filter((item) =>
    item.prompt?.toLowerCase().includes(search.toLowerCase())
  );

  // ⏳ LOADING UI (UPGRADED)
  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 animate-pulse rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          🗂️ Your Collections
        </h1>

        <input
          type="text"
          placeholder="Search designs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ERROR UI */}
      {errorMsg && (
        <div className="mb-4 text-red-500 text-sm">
          {errorMsg}
        </div>
      )}

      {/* STATS */}
      <p className="text-sm text-gray-500 mb-4">
        Total Designs: {filtered.length}
      </p>

      {/* EMPTY STATE */}
      {filtered.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          <p>No designs found.</p>
          <p className="text-sm">
            Try generating some designs first 👗
          </p>
        </div>
      ) : (
        /* GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <ImageCard key={item.id} img={item} />
          ))}
        </div>
      )}
    </div>
  );
}