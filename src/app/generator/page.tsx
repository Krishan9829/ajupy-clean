"use client";

import { useState } from "react";

export default function GeneratorPage() {
  const [image, setImage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("saree");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");

      // ⚠️ IMPORTANT: user_id tumhe auth se lena chahiye
      const user_id = "demo-user-id"; // 👉 replace with real user id

      const res = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image,
          prompt,
          category,
          user_id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessage("✅ Saved successfully!");
      setImage("");
      setPrompt("");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Generator</h1>

      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "300px" }}
      />

      <input
        type="text"
        placeholder="Prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "300px" }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ marginBottom: "10px" }}
      >
        <option value="saree">Saree</option>
        <option value="kurti">Kurti</option>
        <option value="lehenga">Lehenga</option>
      </select>

      <br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}