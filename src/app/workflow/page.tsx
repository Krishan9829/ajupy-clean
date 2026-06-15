"use client";

import Sidebar from "../../components/layout/sidebar";

const steps = [
  "User Prompt",
  "AI Prompt Enhancer",
  "Style Analyzer",
  "Generation Engine",
  "Upscaler",
  "Export Engine",
];

export default function WorkflowPage() {
  return (
    
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar />

      <div className="ml-[260px] p-8">
        <h1 className="text-3xl font-bold mb-6">
          ⚙️ AI Workflow
        </h1>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-gray-900 p-5 rounded"
            >
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}