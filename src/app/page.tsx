import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center p-6">
      
      <h1 className="text-6xl font-bold">
        AJUPY AI 🚀
      </h1>

      <p className="mt-4 text-gray-400 text-lg">
        World's First AI Textile Operating System
      </p>

      <Link href="/dashboard">
        <button className="mt-8 px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700">
          Enter Dashboard
        </button>
      </Link>

    </div>
  );
}