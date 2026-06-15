"use client";

import { useState } from "react";
import Sidebar from "../../components/layout/sidebar";

export default function PatternAI() {
  const [type, setType] = useState("");
  const [result, setResult] = useState("");

  async function generate() {
    const prompt = `
    Generate seamless repeat pattern:
    Type: ${type}
    Output formats: TIFF, PSD, SVG, CMYK PDF
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
          🔁 Pattern Generator
        </h1>

        <input
          placeholder="floral / geometric / luxury"
          className="p-3 bg-gray-800 rounded w-full"
          onChange={(e) => setType(e.target.value)}
        />

        <button
          onClick={generate}
          className="mt-5 bg-green-600 px-6 py-2 rounded"
        >
          Generate Pattern
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