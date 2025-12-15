"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function loginWithEmail() {
    setLoading(true);

    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email to login");
    }
  }

  async function loginWithGoogle() {
    await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });
  }

  return (
    <div className="max-w-md mx-auto mt-20 space-y-6">
      <h1 className="text-2xl font-semibold text-center">
        Login to Zero Conflict AI
      </h1>

      <button
        onClick={loginWithGoogle}
        className="w-full bg-white text-black py-2 rounded-lg font-medium"
      >
        Continue with Google
      </button>

      <div className="text-center text-white/40">or</div>

      <input
        type="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 rounded bg-black border border-white/20"
      />

      <button
        onClick={loginWithEmail}
        disabled={loading}
        className="w-full bg-blue-600 py-2 rounded-lg"
      >
        Login
      </button>
    </div>
  );
}
