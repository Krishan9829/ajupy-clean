"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "🏠",
  },
  {
    name: "AI Generator",
    href: "/generator",
    icon: "✨",
  },
  {
    name: "Collections",
    href: "/collections",
    icon: "📁",
  },
  {
    name: "Saree AI",
    href: "/saree-ai",
    icon: "👗",
  },
  {
    name: "Textile AI",
    href: "/textile-ai",
    icon: "🎨",
  },
  {
    name: "Embroidery AI",
    href: "/embroidery-ai",
    icon: "🧵",
  },
  {
    name: "Color AI",
    href: "/color-ai",
    icon: "🌈",
  },
  {
    name: "Pattern AI",
    href: "/pattern-ai",
    icon: "🔁",
  },
  {
    name: "Training Studio",
    href: "/training",
    icon: "🧠",
  },
  {
    name: "Pricing",
    href: "/pricing",
    icon: "💎",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-950 border-r border-zinc-800">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white">
          🚀 AJUPY AI
        </h1>

        <p className="text-xs text-zinc-400 mt-1">
          Textile AI Operating System
        </p>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                active
                  ? "bg-white text-black font-semibold"
                  : "text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="absolute bottom-0 w-full p-4 border-t border-zinc-800">
        <div className="bg-zinc-900 rounded-xl p-4">
          <p className="text-sm text-zinc-400">
            Current Plan
          </p>

          <h3 className="font-bold">
            Free Plan
          </h3>

          <button className="mt-3 w-full bg-white text-black py-2 rounded-lg font-semibold">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}