"use client";

import { useState } from "react";

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("luxury");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const generate = async () => {
    if (!prompt.trim()) {
      setError("Prompt is required");
      return;
    }

    setLoading(true);
    setError("");
    setImage("");

    try {
      // 🔥 USER ID AUTO GENERATE
      let user_id = localStorage.getItem("user_id");
      if (!user_id) {
        user_id = crypto.randomUUID();
        localStorage.setItem("user_id", user_id);
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style,
          user_id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Generation failed");
      }

      setImage(data.result.image);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔥 AI Saree Generator</h1>

      {/* INPUT */}
      <textarea
        placeholder="Describe your design... (e.g. red bridal saree with golden embroidery)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={styles.input}
      />

      {/* STYLE */}
      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        style={styles.select}
      >
        <option value="luxury">Luxury</option>
        <option value="bridal">Bridal</option>
        <option value="minimal">Minimal</option>
        <option value="royal">Royal</option>
      </select>

      {/* BUTTON */}
      <button
        onClick={generate}
        style={{
          ...styles.button,
          opacity: loading ? 0.6 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Design"}
      </button>

      {/* LOADING */}
      {loading && <p style={styles.loading}>⏳ Generating AI design...</p>}

      {/* ERROR */}
      {error && <p style={styles.error}>❌ {error}</p>}

      {/* RESULT */}
      {image && (
        <div style={styles.resultBox}>
          <img src={image} style={styles.image} />

          <div style={styles.actions}>
            <a href={image} download style={styles.download}>
              ⬇ Download
            </a>

            <button
              onClick={() => navigator.clipboard.writeText(image)}
              style={styles.copy}
            >
              📋 Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: any = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    padding: 20,
    fontFamily: "Arial",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 100,
    padding: 10,
    marginBottom: 10,
  },
  select: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    padding: 12,
    background: "black",
    color: "white",
    border: "none",
  },
  loading: {
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  resultBox: {
    marginTop: 20,
    textAlign: "center",
  },
  image: {
    width: "100%",
    borderRadius: 10,
  },
  actions: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginTop: 10,
  },
  download: {
    padding: 10,
    background: "green",
    color: "white",
    textDecoration: "none",
  },
  copy: {
    padding: 10,
    background: "blue",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};