"use client";

import { useState } from "react";

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("luxury");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const getUserId = () => {
    let id = localStorage.getItem("user_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("user_id", id);
    }
    return id;
  };

  const generate = async () => {
    if (!prompt.trim()) {
      setError("Please enter prompt");
      return;
    }

    if (loading) return;

    setLoading(true);
    setError("");
    setImages(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style,
          user_id: getUserId(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate");
      }

      setImages(data.result.images);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DOWNLOAD FUNCTION (PRO)
  const downloadImage = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `saree-${Date.now()}.png`;

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Download failed");
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(images.high);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1>✨ AI Saree Designer Studio</h1>
        <p>Create premium AI fashion designs</p>
      </div>

      {/* INPUT CARD */}
      <div style={styles.card}>
        <textarea
          placeholder="Describe your saree design..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={styles.input}
        />

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

        <button
          onClick={generate}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Generating..." : "Generate Design ✨"}
        </button>

        {error && <p style={styles.error}>❌ {error}</p>}
      </div>

      {/* LOADING */}
      {loading && (
        <div style={styles.loader}>
          <div style={styles.spinner}></div>
          <p>Creating your design...</p>
        </div>
      )}

      {/* RESULT */}
      {images && (
        <div style={styles.result}>
          <img src={images.high} style={styles.image} />

          {/* DOWNLOAD OPTIONS */}
          <div style={styles.grid}>

  <button onClick={() => downloadImage(images.hd)} style={styles.btn}>
  HD(748)
</button>

<button onClick={() => downloadImage(images["2k"])} style={styles.btn}>
  2K(1024)
</button>

<button onClick={() => downloadImage(images["4k"])} style={styles.btn}>
  4K(2048)
</button>

<button onClick={() => downloadImage(images.premium)} style={styles.btnPrimary}>
  Premium(4096)
</button> 

</div>
            
          {/* COPY */}
          <button onClick={copyLink} style={styles.copy}>
            {copied ? "✔ Copied" : "📋 Copy Link"}
          </button>
        </div>
      )}
    </div>
  );
}

/* 🎨 STYLES */

const styles: any = {
  page: {
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Arial",
    color: "#fff",
    background: "linear-gradient(135deg, #0f172a, #020617)",
  },

  header: {
    textAlign: "center",
    marginBottom: 25,
  },

  card: {
    maxWidth: 650,
    margin: "0 auto",
    padding: 20,
    borderRadius: 16,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  input: {
    width: "100%",
    height: 120,
    padding: 12,
    borderRadius: 10,
    background: "#111",
    color: "#fff",
    marginBottom: 10,
    border: "1px solid #333",
  },

  select: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    background: "#111",
    color: "#fff",
    border: "1px solid #333",
    marginBottom: 10,
  },

  button: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
    color: "#fff",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    color: "red",
    marginTop: 10,
  },

  loader: {
    textAlign: "center",
    marginTop: 20,
  },

  spinner: {
    width: 40,
    height: 40,
    border: "4px solid #333",
    borderTop: "4px solid #fff",
    borderRadius: "50%",
    margin: "0 auto",
    animation: "spin 1s linear infinite",
  },

  result: {
    maxWidth: 650,
    margin: "20px auto",
    padding: 15,
    borderRadius: 16,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
  },

  image: {
    width: "100%",
    borderRadius: 12,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 15,
  },

  btn: {
    padding: 10,
    background: "#1f2937",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  btnPrimary: {
    padding: 10,
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  copy: {
    marginTop: 10,
    padding: 10,
    background: "#3b82f6",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
  },
};