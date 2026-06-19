"use client";

import { useState, useRef } from "react";
import PromptBox from "../../components/ai/prompt-box";
import FashionSelector from "../../components/ai/fashion-selector";
import AdvancedForm from "../../components/ai/advanced-form";
import {
  buildFashionPrompt,
  FashionType,
} from "../../lib/fashion-engine";
import { getSupabase } from "../../lib/supabase";

type AIResult = {
  image?: string;
  text?: string;
};

export default function GeneratorPage() {
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState<FashionType>("saree");
  const [mode, setMode] = useState<"simple" | "advanced">("advanced");
  const [model, setModel] = useState("luxury");
  const [credits, setCredits] = useState(100);

  const controllerRef = useRef<AbortController | null>(null);

  const supabase = getSupabase(); // ✅ added

  async function generateAI(prompt: string) {
    if (loading) return;

    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    if (credits <= 0) {
      setError("No credits left");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      const fashionPrompt = buildFashionPrompt(type, prompt);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controllerRef.current.signal,
        body: JSON.stringify({
          prompt: fashionPrompt,
          style: model,
          category: type,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Server error");
      }

      const safeResult: AIResult = {
        image: data.result?.image || "",
        text: data.result?.text || "",
      };

      setResult(safeResult);

      // 🔥 AUTO SAVE WITH USER ID
      if (safeResult.image) {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            await fetch("/api/save-image", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                image: safeResult.image,
                prompt: fashionPrompt,
                category: type,
                user_id: user.id, // ✅ FIXED
              }),
            });
          }
        } catch (err) {
          console.error("Save failed", err);
        }
      }

      setCredits((prev) => Math.max(prev - 1, 0));

    } catch (err: any) {
      if (err.name === "AbortError") return;
      setError(err.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  function downloadImage() {
    if (!result?.image) return;

    try {
      const link = document.createElement("a");
      link.href = result.image;
      link.download = `ajupy-${Date.now()}.png`;
      link.click();
    } catch {
      setError("Download failed");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">🚀 AJUPY AI Studio</h1>
          <p className="text-zinc-400 mt-1">
            Generate textile, saree & fashion designs
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-xl">
          Credits: {credits}
        </div>
      </div>

      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 mb-6"
      >
        <option value="luxury">Luxury</option>
        <option value="bridal">Bridal</option>
        <option value="minimal">Minimal</option>
        <option value="royal">Royal</option>
      </select>

      <FashionSelector onSelect={setType} />

      <div className="flex gap-3 my-6">
        {["simple", "advanced"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as any)}
            className={`px-5 py-2 rounded-xl ${
              mode === m ? "bg-white text-black" : "bg-zinc-800"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
        {mode === "simple" ? (
          <PromptBox onGenerate={generateAI} />
        ) : (
          <AdvancedForm onGenerate={generateAI} />
        )}
      </div>

      {loading && (
        <div className="mt-6 bg-zinc-900 p-4 rounded-xl animate-pulse">
          ✨ Generating your design...
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-500/10 border border-red-500 rounded-xl p-4 text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          {result.image && (
            <img
              src={result.image}
              className="w-full max-w-md rounded-xl mb-4"
            />
          )}

          {result.text && (
            <pre className="text-sm text-zinc-300 whitespace-pre-wrap">
              {result.text}
            </pre>
          )}

          <button
            onClick={downloadImage}
            className="mt-4 bg-white text-black px-4 py-2 rounded-xl"
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
}