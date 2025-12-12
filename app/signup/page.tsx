"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Passwordless email (magic link)
  async function signupWithEmail() {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabaseBrowser.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Magic link sent — check your email to continue.");
      }
    } catch (err: any) {
      setMessage(err?.message || "Failed to send magic link.");
    } finally {
      setLoading(false);
    }
  }

  // Google OAuth
  async function signupWithGoogle() {
    setMessage("");
    try {
      const { error } = await supabaseBrowser.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        },
      });

      if (error) setMessage(error.message);
      // otherwise redirects to Google
    } catch (err: any) {
      setMessage(err?.message || "OAuth failed.");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-[#0f1a35] rounded-xl border border-white/10 text-white">
      <h1 className="text-2xl font-bold text-center mb-6">Create your account</h1>

      <label className="block text-white/70 mb-2">Email Address</label>
      <input
        type="email"
        placeholder="you@example.com"
        className="w-full px-4 py-2 rounded bg-white/10 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={signupWithEmail}
        disabled={loading}
        className="mt-4 w-full py-2 bg-gradient-to-r from-[#21D4FD] to-[#B721FF] text-black rounded-lg font-semibold"
      >
        {loading ? "Sending magic link..." : "Sign Up with Email"}
      </button>

      <p className="text-center my-4 text-white/50">or</p>

      <button
        onClick={signupWithGoogle}
        className="w-full py-2 bg-white text-black rounded-lg"
      >
        Continue with Google
      </button>

      {message && <p className="text-center text-sm text-red-400 mt-4">{message}</p>}
    </div>
  );
}
