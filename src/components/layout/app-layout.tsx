"use client";

import Sidebar from "./sidebar";
import Navbar from "./navbar";
import Footer from "./footer";

export default function AppLayout({ children }: any) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </div>
  );
}