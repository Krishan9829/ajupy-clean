"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-lg transition flex items-center gap-2 ${
      pathname === path
        ? "bg-white text-black"
        : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`;

  return (
    <aside className="w-[260px] h-screen bg-gray-950 border-r border-gray-800 p-6 fixed left-0 top-0 text-white flex flex-col justify-between">

      {/* TOP */}
      <div>
        {/* LOGO */}
        <h2 className="text-2xl font-bold mb-8 tracking-wide">
          🚀 AJUPY AI
        </h2>

        <nav className="flex flex-col gap-4 text-sm">

          {/* MAIN */}
          <div>
            <p className="text-gray-500 mb-2 text-xs uppercase">
              Main
            </p>

            <Link href="/dashboard" className={linkClass("/dashboard")}>
              📊 Dashboard
            </Link>

            <Link href="/collections" className={linkClass("/collections")}>
              🗂️ Collections
            </Link>

            <Link href="/history" className={linkClass("/history")}>
              🕒 History
            </Link>
          </div>

          {/* AI DESIGN */}
          <div>
            <p className="text-gray-500 mb-2 text-xs uppercase">
              AI Design
            </p>

            <Link href="/saree-ai" className={linkClass("/saree-ai")}>
              👗 Saree AI
            </Link>

            <Link href="/textile-ai" className={linkClass("/textile-ai")}>
              🎨 Textile AI
            </Link>

            <Link href="/embroidery-ai" className={linkClass("/embroidery-ai")}>
              🧵 Embroidery AI
            </Link>

            <Link href="/pattern-ai" className={linkClass("/pattern-ai")}>
              🔁 Pattern AI
            </Link>

            <Link href="/color-ai" className={linkClass("/color-ai")}>
              🌈 Color AI
            </Link>
          </div>

          {/* AI SYSTEM */}
          <div>
            <p className="text-gray-500 mb-2 text-xs uppercase">
              AI System
            </p>

            <Link href="/ai-models" className={linkClass("/ai-models")}>
              🤖 AI Models
            </Link>

            <Link href="/workflow" className={linkClass("/workflow")}>
              ⚙️ Workflow
            </Link>

            <Link href="/training" className={linkClass("/training")}>
              🧠 Training Studio
            </Link>
          </div>

          {/* OTHER */}
          <div>
            <p className="text-gray-500 mb-2 text-xs uppercase">
              Other
            </p>

            <Link href="/generator" className={linkClass("/generator")}>
              ✨ Generator
            </Link>

            <Link href="/pricing" className={linkClass("/pricing")}>
              💰 Pricing
            </Link>

            <Link href="/settings" className={linkClass("/settings")}>
              ⚙️ Settings
            </Link>
          </div>

        </nav>
      </div>

      {/* BOTTOM */}
      <div className="text-xs text-gray-500">
        © 2026 AJUPY AI
      </div>

    </aside>
  );
}