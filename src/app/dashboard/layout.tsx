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
    <div className="flex h-screen bg-black text-white overflow-hidden">

      {/* SIDEBAR */}
      <div
        className={`transition-all duration-300 ${
          open ? "w-[260px]" : "w-0"
        } border-r border-gray-800 overflow-hidden`}
      >
        <Sidebar />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-black sticky top-0 z-50">
          <h1 className="text-lg font-semibold">Dashboard</h1>

          <button
            onClick={() => setOpen(!open)}
            className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 transition"
          >
            {open ? "Hide Menu" : "Show Menu"}
          </button>
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#0a0a0a]">
          {children}
        </main>

      </div>
    </div>
  );
}