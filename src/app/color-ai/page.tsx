"use client";

import { useState } from "react";
import Sidebar from "../../components/layout/sidebar";

export default function ColorAI() {
  const [festival, setFestival] = useState("");
  const [region, setRegion] = useState("");
  const [result, setResult] = useState("");

  async function generate() {
    const prompt = `
    Suggest trending color palettes for:
    Festival: ${festival}
    Region: ${region}
    Include Pantone references.
    `;

    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResult(data.result);
  }

  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar />

      <div className="ml-[260px] p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">
          🎨 AI Color Intelligence
        </h1>

        <input
          placeholder="Festival (Diwali, Wedding)"
          className="p-3 bg-gray-800 rounded w-full mb-3"
          onChange={(e) => setFestival(e.target.value)}
        />

        <input
          placeholder="Region (Rajasthan, South India)"
          className="p-3 bg-gray-800 rounded w-full"
          onChange={(e) => setRegion(e.target.value)}
        />

        <button
          onClick={generate}
          className="mt-5 bg-purple-600 px-6 py-2 rounded"
        >
          Generate Palette
        </button>

        {result && (
          <div className="mt-6 bg-gray-800 p-4 rounded">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}