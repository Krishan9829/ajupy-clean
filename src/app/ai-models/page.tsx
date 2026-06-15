"use client";

import Sidebar from "../../components/layout/sidebar";

const models = [
  "Stable Diffusion XL",
  "FLUX Models",
  "LoRA Training",
  "ControlNet",
  "Segment Anything Model",
];

export default function Models() {
  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar />

      <div className="ml-[260px] p-8">
        <h1 className="text-3xl font-bold mb-6">
          🤖 AI Models
        </h1>

        <div className="grid md:grid-cols-2 gap-5">
          {models.map((m, i) => (
            <div
              key={i}
              className="bg-gray-900 p-5 rounded"
            >
              {m}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}