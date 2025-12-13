"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  async function handleLogin() {
    if (!email) return;

    setLoading(true);
    setMessage("");

    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email to continue.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] text-white">
      <div className="w-full max-w-md p-6 rounded-xl border border-white/10 bg-[#0f1a35]">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Zero Conflict AI" className="h-10" />
        </div>

        <h1 className="text-2xl font-semibold text-center">Login</h1>

        <p className="text-white/60 text-sm text-center mt-2">
          Enter your email to access Zero Conflict AI
        </p>

        <input
          type="email"
          placeholder="you@example.com"
          className="w-full mt-6 px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading || !email}
          className="w-full mt-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Login"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-white/70">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
