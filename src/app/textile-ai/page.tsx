"use client";

import { useState } from "react";
import Sidebar from "../../components/layout/sidebar";

export default function TextileAI() {
  const [type, setType] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!type) {
      alert("Please enter pattern type");
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
          prompt: `Generate ${type} textile pattern`,
        }),
      });

      const data = await res.json();

      // ❌ API failed
      if (!data.success) {
        alert(data.error || "Failed to generate");
        return;
      }

      // ✅ Success
      setText(data.result.text || "");
      setImage(data.result.image || "");

    } catch (err) {
      console.error("CLIENT ERROR:", err);
      alert("Server error");
    } finally {
      setLoading(false); // 🔥 always stop loading
    }
  }

  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar />

      <div className="ml-[260px] p-8 w-full">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6">
          🎨 Textile Print AI
        </h1>

        {/* INPUT */}
        <input
          placeholder="floral / geometric / ethnic"
          className="p-3 bg-gray-800 rounded w-full outline-none"
          onChange={(e) => setType(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={generate}
          disabled={loading}
          className="mt-5 bg-blue-600 px-6 py-2 rounded 
                     disabled:opacity-50 hover:bg-blue-700 transition"
        >
          {loading ? "Generating..." : "Generate Pattern"}
        </button>

        {/* TEXT OUTPUT */}
        {text && (
          <div className="mt-6 bg-gray-900 border border-gray-800 p-5 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">
              🧠 AI Design Description
            </h3>

            <p className="whitespace-pre-line text-gray-300">
              {text}
            </p>
          </div>
        )}

        {/* IMAGE OUTPUT */}
        {image && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">
              🎨 Generated Design
            </h3>

            <img
              src={image}
              className="rounded-xl w-full max-w-md border border-gray-800"
            />

            <a
              href={image}
              download
              className="inline-block mt-3 text-blue-400 hover:underline"
            >
              ⬇ Download Image
            </a>
          </div>
        )}

      </div>
    </div>
  );
}