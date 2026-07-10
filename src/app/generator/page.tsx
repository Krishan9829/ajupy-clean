"use client";

import { useState } from "react";

type ImageSet = {
  main: string;
  pallu: string;
  border: string;
  blouse: string;
  body: string;
};

const initialPrompt =
  "A luxurious bridal saree with rich zari embroidery, deep maroon and gold palette, flowing silk texture, elegant drape";

 const getQualityOptions = (format: string) => {
  if (format === "TIFF") {
    return [
      { value: "HD", label: "HD", size: "1024" },
      { value: "2K", label: "2K", size: "1600" },
    ];
  }

  return [
    { value: "HD", label: "HD", size: "1024" },
    { value: "2K", label: "2K", size: "1600" },
    { value: "4K", label: "4K", size: "2048" },
    { value: "PREMIUM", label: "Premium", size: "Enhanced" },
  ];
};

const formatOptions = ["PNG", "TIFF"];

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [images, setImages] = useState<ImageSet | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadTarget, setDownloadTarget] = useState<string | null>(null);
  const [quality, setQuality] = useState("HD");
  const [format, setFormat] = useState("PNG");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Describe your saree concept to continue.");
      return;
    }

    setLoading(true);
    setImages(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate collection");
      }

      setImages({
        main: data.main,
        pallu: data.pallu,
        border: data.border,
        blouse: data.blouse,
        body: data.body,
      });
    } catch (err) {
      console.error(err);
      alert("Unable to generate the collection right now.");
    } finally {
      setLoading(false);
    }
  };

  const resetPrompt = () => {
    setPrompt(initialPrompt);
  };

  const openDownloadModal = (imageUrl: string) => {
    setDownloadTarget(imageUrl);
    setIsModalOpen(true);
  };

  const handleDownload = async () => {
    if (!downloadTarget) return;

    setIsDownloading(true);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  imageUrl: downloadTarget,
  format: format.toLowerCase(), // 🔥 yahi fix hai
  quality,
}),
       });
if (!res.ok) {
  const err = await res.json();
  alert(err.error || "Download failed");
  return;
}
       
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `saree-${quality.toLowerCase()}-${Date.now()}.${format.toLowerCase()}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("The export could not be completed.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.25),_transparent_35%),linear-gradient(135deg,_#06070d_0%,_#12081d_45%,_#0b0f19_100%)] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-purple-300">
                AI Saree Studio
              </p>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Create a complete luxury saree collection in one shot
              </h1>
              <p className="mt-3 text-sm leading-7 text-zinc-300 sm:text-base">
                Generate the main saree, pallu, border, blouse, and body fabric together with a consistent premium look designed for luxury bridal storytelling.
              </p>
            </div>
            <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm text-purple-100">
              <div className="font-semibold">Consistency engine</div>
              <div className="mt-1 text-purple-200/80">
                Every output uses the same base styling, drape, and textile quality for a cohesive collection.
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[32px] border border-white/10 bg-[#0f1728]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Design brief</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Describe the mood, palette, embroidery, and silhouettes you want the collection to reflect.
              </p>
            </div>

            <label className="mb-3 block text-sm font-medium text-zinc-300" htmlFor="prompt">
              Prompt
            </label>
            <textarea
              id="prompt"
              className="min-h-[220px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none transition focus:border-purple-400"
              placeholder="Describe your saree concept..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleGenerate}
                className="flex-1 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 transition hover:opacity-95"
              >
                {loading ? "Generating collection..." : "Generate Collection"}
              </button>
              <button
                onClick={resetPrompt}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
              >
                Reset prompt
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4 text-sm text-purple-100">
              <div className="font-semibold">Consistency engine</div>
              <p className="mt-2 leading-7 text-purple-100/80">
                Every output uses the same base styling, texture, studio lighting, and premium catalog framing so your collection feels polished from every angle.
              </p>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-[#0f1728]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            {!images && !loading && (
              <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/15 bg-black/20 p-8 text-center">
                <div className="mb-4 rounded-full bg-purple-500/10 p-4 text-purple-200">✨</div>
                <h3 className="text-xl font-semibold">Your collection preview will appear here</h3>
                <p className="mt-2 max-w-md text-sm leading-7 text-zinc-400">
                  Generate a luxury set to inspect the main silhouette, pallu detail, border treatment, blouse design, and body fabric in one place.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[24px] border border-white/10 bg-black/20 p-8 text-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-400/40 border-t-purple-400" />
                <h3 className="text-xl font-semibold">Generating premium designs</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Curating the main saree, accessories, and textile details with a refined AI catalog style.
                </p>
              </div>
            )}

            {images && (
              <div className="space-y-5">
                <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-300">
                        Main saree
                      </p>
                      <p className="mt-1 text-sm text-zinc-400">
                        Full front drape with complete garment view
                      </p>
                    </div>
                    <button
                      onClick={() => openDownloadModal(images.main)}
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/10"
                    >
                      Download
                    </button>
                  </div>
                  <img
                    src={images.main}
                    alt="Main saree preview"
                    className="h-[360px] w-full rounded-[20px] object-cover"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { key: "pallu", title: "Pallu", subtitle: "Detail-focused view" },
                    { key: "border", title: "Border", subtitle: "Detail-focused view" },
                    { key: "blouse", title: "Blouse", subtitle: "Detail-focused view" },
                    { key: "body", title: "Body Fabric", subtitle: "Detail-focused view" },
                  ].map((item) => (
                    <div key={item.key} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                          <p className="mt-1 text-xs text-zinc-400">{item.subtitle}</p>
                        </div>
                        <button
                          onClick={() => openDownloadModal(images[item.key as keyof ImageSet])}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold text-zinc-200 transition hover:bg-white/10"
                        >
                          Download
                        </button>
                      </div>
                      <img
                        src={images[item.key as keyof ImageSet]}
                        alt={`${item.title} preview`}
                        className="h-44 w-full rounded-[18px] object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#111827] p-6 shadow-2xl">
            <h3 className="text-xl font-semibold">Select export settings</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Choose the resolution and file format before downloading your design asset.
            </p>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-zinc-200">Quality</p>
              <div className="grid grid-cols-2 gap-3">
                 {getQualityOptions(format).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setQuality(option.value)}
                    className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                      quality === option.value
                        ? "border-purple-400 bg-purple-500/20 text-purple-100"
                        : "border-white/10 bg-white/5 text-zinc-300"
                    }`}
                  >
                    {option.label}
                    <span className="ml-1 text-xs text-zinc-400">({option.size})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-zinc-200">Format</p>
              <div className="flex gap-3">
                {formatOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
  setFormat(option);

  if (option === "TIFF") {
    setQuality("HD"); // 🔥 safe default
  }
}}
                    className={`flex-1 rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                      format === option
                        ? "border-purple-400 bg-purple-500/20 text-purple-100"
                        : "border-white/10 bg-white/5 text-zinc-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white"
              >
                {isDownloading ? "Preparing download..." : "Download"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
