"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  async function send() {
    if (!email.includes("@")) {
      alert("Enter a valid email");
      return;
    }

    const res = await fetch("/api/auth/magiclink", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        redirectTo: (process.env.NEXT_PUBLIC_APP_URL || "") + "/dashboard"
      })
    });

    if (res.ok) {
      alert("Magic link sent. Check your email.");
      localStorage.setItem("zc_email", email);
    } else {
      alert("Failed to send magic link");
    }
  }

  return (
    <div className="py-12 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        className="w-full p-3 rounded-lg bg-[#071026] border border-white/5"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
      />
      <button
        className="mt-3 px-4 py-2 bg-white/10 rounded-lg"
        onClick={send}
      >
        Send Magic Link
      </button>
    </div>
  );
}