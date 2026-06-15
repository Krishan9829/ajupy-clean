"use client";

import Sidebar from "../../components/layout/sidebar";

export default function TrainingStudio() {
  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar />

      <div className="ml-[260px] p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">
          🧠 AI Training Studio
        </h1>

        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="mb-4">
            Upload your textile dataset and train custom AI models.
          </p>

          <input
            type="file"
            className="mb-4"
          />

          <button className="bg-blue-600 px-6 py-2 rounded">
            Start Training
          </button>

          <p className="text-sm text-gray-400 mt-4">
            (Coming Soon: Private model training)
          </p>
        </div>
      </div>
    </div>
  );
}
