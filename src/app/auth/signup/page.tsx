import SignupForm from "../../../components/auth/signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold">
            AJUPY AI
          </h1>

          <p className="text-zinc-400 mt-3">
            AI Operating System for Fashion & Textile Industry
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-2">
            Create Account
          </h2>

          <p className="text-zinc-400 mb-8">
            Start building with AJUPY AI
          </p>

          <SignupForm />

          <div className="mt-8 text-center">
            <p className="text-zinc-400">
              Already have an account?
            </p>

            <Link
              href="/login"
              className="font-semibold hover:text-zinc-300 transition"
            >
              Login Now
            </Link>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-zinc-500">
          © 2026 AJUPY AI
        </div>
      </div>
    </main>
  );
}