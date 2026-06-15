"use client";

import { useState } from "react";
import Sidebar from "../../components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* SIDEBAR */}
      {open && (
        <aside className="w-[260px] border-r border-gray-800">
          <Sidebar />
        </aside>
      )}

      {/* MAIN */}
      <main className="flex-1 p-6 overflow-auto">

        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Dashboard</h1>

          <button
            onClick={() => setOpen(!open)}
            className="px-3 py-1 bg-gray-800 rounded"
          >
            {open ? "Hide Menu" : "Show Menu"}
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}