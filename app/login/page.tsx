"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function loginWithEmail() {
    setMessage("");

    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });

    if (error) setMessage(error.message);
    else setMessage("A login link has been sent to your email.");
  }

  async function loginWithGoogle() {
    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });
    if (error) setMessage(error.message);
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-[#0f1a35] border border-white/10 rounded-xl text-white">
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

      <label className="block text-white/70 mb-2">Email Address</label>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full px-4 py-2 rounded bg-white/10"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="mt-4 w-full py-2 bg-gradient-to-r from-[#21D4FD] to-[#B721FF] text-black rounded-lg font-semibold"
        onClick={loginWithEmail}
      >
        Login with Email
      </button>

      <p className="text-center my-4 text-white/50">or</p>

      <button
        className="w-full py-2 bg-white text-black rounded-lg"
        onClick={loginWithGoogle}
      >
        Continue with Google
      </button>

      {message && (
        <p className="text-center text-sm text-red-400 mt-4">{message}</p>
      )}
    </div>
  );
}
