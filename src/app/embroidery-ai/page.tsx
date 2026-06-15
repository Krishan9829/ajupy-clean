"use client";

import { useState } from "react";
import Sidebar from "../../components/layout/sidebar";

export default function EmbroideryAI() {
  const [style, setStyle] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!style) {
      alert("Please enter embroidery style");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Generate a detailed ${style} embroidery design with rich patterns, textures, and cultural inspiration`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data.result);
    } catch (err) {
      console.error(err);
      alert("Failed to generate embroidery design");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar />

      <div className="ml-[260px] p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">
          🧵 Embroidery AI
        </h1>

        <input
          placeholder="zari / mirror / beadwork"
          className="p-3 bg-gray-800 rounded w-full"
          onChange={(e) => setStyle(e.target.value)}
        />

        <button
          onClick={generate}
          disabled={loading}
          className="mt-5 bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Design"}
        </button>

        {result && (
          <div className="mt-6 bg-gray-800 p-4 rounded whitespace-pre-wrap">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}