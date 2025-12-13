"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup() {
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
      setMessage(
        "Check your email. We’ve sent you a secure login link from Zero Conflict AI."
      );
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] text-white">
      <div className="w-full max-w-md p-6 rounded-xl border border-white/10 bg-[#0f1a35]">
        <h1 className="text-2xl font-semibold text-center">
          Create your account
        </h1>
        <p className="text-white/60 text-sm text-center mt-2">
          Sign up using your email. No password required.
        </p>

        <input
          type="email"
          placeholder="you@example.com"
          className="w-full mt-6 px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading || !email}
          className="w-full mt-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Sending link..." : "Sign up with Email"}
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
