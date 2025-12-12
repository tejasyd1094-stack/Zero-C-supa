"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function loginWithEmail() {
    setMessage("");

    const supabase = supabaseBrowser();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Magic link sent! Check your email.");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 text-white">
      <h1 className="text-3xl font-semibold mb-6">Login</h1>

      <input
        type="email"
        placeholder="Enter your email"
        className="w-full px-4 py-2 rounded bg-[#0d1730] border border-white/10"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={loginWithEmail}
        className="w-full mt-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        Send Magic Link
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-white/70">{message}</p>
      )}
    </div>
  );
}
