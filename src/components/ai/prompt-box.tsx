"use client";

import { useState } from "react";

export default function PromptBox({
  onGenerate,
}: {
  onGenerate: (prompt: string) => void;
}) {
  const [prompt, setPrompt] = useState("");

  return (
    <div style={{ marginBottom: 20 }}>
      <textarea
        placeholder="Enter your AI prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{
          width: "100%",
          height: "100px",
          padding: "10px",
          borderRadius: 8,
          border: "1px solid #333",
          background: "#111",
          color: "white",
        }}
      />

      <button
        onClick={() => onGenerate(prompt)}
        style={{
          marginTop: 10,
          padding: "10px 15px",
          background: "#222",
          color: "white",
          border: "1px solid #333",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Generate AI ✨
      </button>
    </div>
  );
}