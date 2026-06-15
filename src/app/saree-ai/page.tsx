"use client";

import { useState, useEffect } from "react";

export default function SareeAI() {
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    fabric: "",
    region: "",
    festival: "",
    embroidery: "",
    colors: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  const suggestions = [
    "Banarasi Silk",
    "Kanjivaram",
    "Bridal Red",
    "Royal Blue",
    "Festival Wear",
  ];

  // ✅ Fix hydration
  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem("saree_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  if (!mounted) return null;

  async function generate() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const prompt = `
Saree Design AI:
Fabric: ${form.fabric}
Region: ${form.region}
Festival: ${form.festival}
Embroidery: ${form.embroidery}
Colors: ${form.colors}
      `;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style: "luxury bridal",
        }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Failed");

      setResult(data.result);

      // 🧠 History (localStorage safe)
      const updated = [data.result, ...history].slice(0, 5);
      setHistory(updated);
      localStorage.setItem("saree_history", JSON.stringify(updated));

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function downloadImage(url: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = "saree-design.png";
    a.click();
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">

      {/* HEADER */}
      <h1 className="text-4xl font-bold">👗 Saree Design AI</h1>
      <p className="text-gray-400 mb-6">
        AI-powered Indian textile generator
      </p>

      {/* SUGGESTIONS */}
      <div className="flex flex-wrap gap-2 mb-4">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setForm({ ...form, fabric: s })}
            className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700"
          >
            {s}
          </button>
        ))}
      </div>

      {/* INPUTS */}
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            placeholder={key.toUpperCase()}
            className="p-3 bg-gray-800 rounded outline-none"
            value={value}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
          />
        ))}
      </div>

      {/* BUTTON */}
      <button
        onClick={generate}
        disabled={loading}
        className="mt-6 bg-blue-600 px-6 py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "🎨 Generating AI Design..." : "Generate Design 🚀"}
      </button>

      {/* LOADING */}
      {loading && (
        <div className="mt-6 text-blue-400 animate-pulse">
          AI is designing your saree...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mt-4 text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mt-8 grid md:grid-cols-2 gap-6">

          {/* IMAGE */}
          <div className="bg-gray-900 p-4 rounded-xl">
            <h2 className="font-bold mb-3">AI Design Preview</h2>

            {result.image ? (
              <>
                <img
                  src={result.image}
                  className="rounded-xl w-full"
                />

                <button
                  onClick={() => downloadImage(result.image)}
                  className="mt-3 px-3 py-2 bg-green-600 rounded"
                >
                  Download ⬇️
                </button>
              </>
            ) : (
              <div className="text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* TEXT */}
          <div className="bg-gray-900 p-4 rounded-xl">
            <h2 className="font-bold mb-3">Design Description</h2>
            <p className="text-gray-300 whitespace-pre-line">
              {result.text}
            </p>
          </div>

        </div>
      )}

      {/* HISTORY */}
      {history.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3">
            🧠 Recent Designs
          </h2>

          <div className="grid md:grid-cols-3 gap-3">
            {history.map((h, i) => (
              <div key={i} className="bg-gray-900 p-3 rounded">
                {h.image && (
                  <img src={h.image} className="rounded mb-2" />
                )}
                <p className="text-sm text-gray-400">
                  {h.text?.slice(0, 80)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}