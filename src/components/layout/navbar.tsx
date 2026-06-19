"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/services/auth-service";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/auth/login");
  };

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`px-3 py-1 rounded transition ${
        pathname === href
          ? "bg-black text-white"
          : "text-gray-600 hover:text-black"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="h-[70px] flex justify-between items-center px-6 border-b bg-white">
      
      {/* Logo */}
      <h2 className="text-lg font-bold">AJUPY AI 🚀</h2>

      {/* Links */}
      <div className="flex items-center gap-4">
        {navLink("/", "Home")}
        {navLink("/dashboard", "Dashboard")}
        {navLink("/generator", "Generator")}
        {navLink("/collections", "Collections")}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="bg-black text-white px-4 py-1 rounded"
      >
        Logout
      </button>

    </nav>
  );
}