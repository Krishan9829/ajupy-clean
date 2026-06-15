"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../lib/supabase";

export default function SignupForm() {
const router = useRouter();
const supabase = getSupabase();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [showPassword, setShowPassword] = useState(false);

const [loading, setLoading] = useState(false);
const [errorMsg, setErrorMsg] = useState("");
const [successMsg, setSuccessMsg] = useState("");

async function handleSignup(e: React.FormEvent) {
e.preventDefault();


setErrorMsg("");
setSuccessMsg("");

if (!email || !password || !confirmPassword) {
  setErrorMsg("Please fill all fields.");
  return;
}

if (password.length < 6) {
  setErrorMsg("Password must be at least 6 characters.");
  return;
}

if (password !== confirmPassword) {
  setErrorMsg("Passwords do not match.");
  return;
}

try {
  setLoading(true);

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    setErrorMsg(error.message);
    return;
  }

  setSuccessMsg(
    "Account created successfully. Check your email for verification."
  );

  setTimeout(() => {
    router.push("/login");
  }, 2500);
} catch (err) {
  console.error(err);
  setErrorMsg("Something went wrong.");
} finally {
  setLoading(false);
}


}

const passwordStrength =
password.length >= 10
? "Strong"
: password.length >= 6
? "Medium"
: "Weak";

return ( <div className="space-y-6">
{errorMsg && ( <div className="bg-red-500/10 border border-red-500 rounded-lg p-3"> <p className="text-red-400 text-sm text-center">
{errorMsg} </p> </div>
)}


  {successMsg && (
    <div className="bg-green-500/10 border border-green-500 rounded-lg p-3">
      <p className="text-green-400 text-sm text-center">
        {successMsg}
      </p>
    </div>
  )}

  <form
    onSubmit={handleSignup}
    className="flex flex-col gap-4"
  >
    <input
      type="email"
      placeholder="Email Address"
      autoComplete="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-white"
    />

    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Create Password"
        value={password}
        autoComplete="new-password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-white"
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-3 text-sm text-zinc-400"
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>

    <p className="text-sm text-zinc-400">
      Password Strength: {passwordStrength}
    </p>

    <input
      type={showPassword ? "text" : "password"}
      placeholder="Confirm Password"
      autoComplete="new-password"
      value={confirmPassword}
      onChange={(e) =>
        setConfirmPassword(e.target.value)
      }
      className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-white"
    />

    <button
      type="submit"
      disabled={loading}
      className="bg-white text-black font-semibold rounded-xl p-3 hover:opacity-90 transition disabled:opacity-50"
    >
      {loading
        ? "Creating Account..."
        : "Create Account"}
    </button>
  </form>

  <p className="text-center text-zinc-400">
    Already have an account?{" "}
    <Link
      href="/login"
      className="text-white font-semibold hover:underline"
    >
      Login
    </Link>
  </p>
</div>


);
}
