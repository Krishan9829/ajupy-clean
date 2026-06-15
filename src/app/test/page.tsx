"use client";

import { getSupabase } from "../../lib/supabase";
import { useEffect } from "react";

export default function Test() {
  useEffect(() => {
    async function test() {
      try {
        const supabase = getSupabase();

        const { data, error } = await supabase
          .from("designs")
          .select("*")
          .limit(10);

        if (error) {
          console.error("Supabase Error:", error.message);
          return;
        }

        console.log("✅ DATA:", data);
      } catch (err) {
        console.error("❌ Unexpected Error:", err);
      }
    }

    test();
  }, []);

  return (
    <div className="p-10 text-white">
      <h1 className="text-xl font-bold">Supabase Test Page</h1>
      <p>Check console for database output</p>
    </div>
  );
}