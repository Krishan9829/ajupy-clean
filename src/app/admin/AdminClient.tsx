"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminClient({ initialData }: any) {
  const [generations, setGenerations] = useState(initialData);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-generations")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "generations" },
        (payload) => {
          setGenerations((prev: any) => [
            payload.new,
            ...prev,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      <h2>Live Generations 🔥</h2>

      {generations.map((item: any) => (
        <div key={item.id}>
          <img src={item.image_url} width={150} />
          <p>{item.prompt}</p>
        </div>
      ))}
    </div>
  );
}