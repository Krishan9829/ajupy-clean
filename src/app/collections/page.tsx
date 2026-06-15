"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "../../lib/supabase";
import ImageCard from "../../components/ai/image-card";

type Collection = {
  id: number;
  image: string;
  prompt: string;
  created_at?: string;
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ✅ FIX: create supabase instance
  const supabase = getSupabase();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      // ✅ safety check
      if (!supabase) {
        console.error("❌ Supabase not initialized");
        setCollections([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error(error);
        setCollections([]);
      } else {
        setCollections((data || []) as Collection[]);
      }
    } catch (err) {
      console.error(err);
      setCollections([]);
    }

    setLoading(false);
  };

  // 🔍 SEARCH FILTER
  const filtered = collections.filter((item) =>
    item.prompt?.toLowerCase().includes(search.toLowerCase())
  );

  // ⏳ LOADING UI
  if (loading) {
    return (
      <div className="ml-[240px] p-6">
        <p className="animate-pulse text-gray-500">
          Loading your designs...
        </p>
      </div>
    );
  }

  return (
    <div className="ml-[240px] p-6">

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

      {/* STATS */}
      <p className="text-sm text-gray-500 mb-4">
        Total Designs: {collections.length}
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