"use client";

import { useState } from "react";
import PromptBox from "../../components/ai/prompt-box";
import ResultGrid from "../../components/ai/result-grid";
import FashionSelector from "../../components/ai/fashion-selector";
import AdvancedForm from "../../components/ai/advanced-form";
import {
  buildFashionPrompt,
  FashionType,
} from "../../lib/fashion-engine";

export default function GeneratorPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [type, setType] =
    useState<FashionType>("saree");

  const [mode, setMode] = useState<
    "simple" | "advanced"
  >("advanced");

  const [model, setModel] =
    useState("FLUX Pro");

  const [credits, setCredits] = useState(100);

  // 🔥 GENERATE FUNCTION (UPGRADED)
  async function generateAI(prompt: string) {
    if (!prompt || loading) return;

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const fashionPrompt =
        buildFashionPrompt(type, prompt);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          prompt: fashionPrompt,
          style: model,
          category: type,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "Generation failed"
        );
      }

      setResult(data.result);

      // 🎯 reduce credits
      setCredits((prev) => prev - 1);

    } catch (error: any) {
      console.error(error);
      setError(
        error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  // 🔽 DOWNLOAD IMAGE
  function downloadImage() {
    if (!result?.image) return;

    const link = document.createElement("a");
    link.href = result.image;
    link.download = "ajupy-design.png";
    link.click();
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            🚀 AJUPY AI Studio
          </h1>

          <p className="text-zinc-400 mt-1">
            Generate textile, saree,
            embroidery & fashion designs.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-xl">
          Credits: {credits}
        </div>
      </div>

      {/* MODEL SELECTOR */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          AI Model
        </label>

        <select
          value={model}
          onChange={(e) =>
            setModel(e.target.value)
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl p-3"
        >
          <option>FLUX Pro</option>
          <option>SDXL</option>
          <option>Bridal AI</option>
          <option>Luxury AI</option>
          <option>Minimal AI</option>
        </select>
      </div>

      {/* CATEGORY */}
      <FashionSelector
        onSelect={setType}
      />

      {/* MODE */}
      <div className="flex gap-3 my-6">
        <button
          onClick={() =>
            setMode("simple")
          }
          className={`px-5 py-2 rounded-xl ${
            mode === "simple"
              ? "bg-white text-black"
              : "bg-zinc-800"
          }`}
        >
          Simple
        </button>

        <button
          onClick={() =>
            setMode("advanced")
          }
          className={`px-5 py-2 rounded-xl ${
            mode === "advanced"
              ? "bg-white text-black"
              : "bg-zinc-800"
          }`}
        >
          Advanced
        </button>
      </div>

      {/* INPUT */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
        {mode === "simple" ? (
          <PromptBox
            onGenerate={generateAI}
          />
        ) : (
          <AdvancedForm
            onGenerate={generateAI}
          />
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-pulse">
          ✨ Generating premium design...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mt-6 bg-red-500/10 border border-red-500 rounded-xl p-4 text-red-400">
          {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          {/* IMAGE */}
          {result.image && (
            <img
              src={result.image}
              className="w-full max-w-md rounded-xl mb-4"
            />
          )}

          {/* TEXT */}
          <pre className="whitespace-pre-wrap text-sm text-zinc-300">
            {result.text}
          </pre>

          {/* ACTIONS */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={downloadImage}
              className="bg-white text-black px-4 py-2 rounded-xl"
            >
              Download
            </button>
          </div>
        </div>
      )}

      {/* OLD GRID (optional) */}
      {/* <ResultGrid result={result} /> */}
    </div>
  );
}