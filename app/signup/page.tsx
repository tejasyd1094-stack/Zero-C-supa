"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --------------------------
  // EMAIL MAGIC LINK SIGNUP
  // --------------------------
  async function signupWithEmail() {
    setLoading(true);
    setMessage("");

    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });

    setLoading(false);

    if (error) return setMessage(error.message);
    setMessage("Magic link sent! Check your email to continue.");
  }

  // --------------------------
  // PHONE OTP SIGNUP
  // --------------------------
  async function signupWithPhone() {
    setLoading(true);
    setMessage("");

    const { error } = await supabaseBrowser.auth.signInWithOtp({
      phone,
    });

    setLoading(false);

    if (error) return setMessage(error.message);
    setMessage("OTP sent to your phone number.");
  }

  // --------------------------
  // GOOGLE / APPLE SIGNUP
  // --------------------------
  async function oauthLogin(provider: "google" | "apple") {
    await supabaseBrowser.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });
  }

  return (
    <div className="max-w-md mx-auto pt-20 px-6 text-white">
      {/* HEADER */}
      <div className="text-center mb-8">
        <Image
          src="/logo.png"
          alt="Zero Conflict Logo"
          width={70}
          height={70}
          className="mx-auto rounded-xl"
        />
        <h1 className="mt-4 text-3xl font-bold">Create Your Account</h1>
        <p className="text-white/60 text-sm mt-2">
          Sign up using email, mobile number or social login.
        </p>
      </div>

      {/* CARD */}
      <div className="bg-[#0f1a35] rounded-xl p-6 border border-white/10 space-y-6">

        {/* EMAIL INPUT */}
        <div>
          <label className="text-white/70 text-sm">Email Address</label>
          <input
            className="w-full mt-1 p-3 rounded-lg bg-[#071026] border border-white/10 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
          />
          <button
            onClick={signupWithEmail}
            disabled={loading}
            className="mt-3 w-full py-3 rounded-lg bg-gradient-to-r from-[#21D4FD] to-[#B721FF] font-semibold"
          >
            {loading ? "Sending magic link..." : "Sign Up with Email"}
          </button>
        </div>

        {/* PHONE NUMBER INPUT */}
        <div>
          <label className="text-white/70 text-sm">Mobile Number</label>
          <input
            className="w-full mt-1 p-3 rounded-lg bg-[#071026] border border-white/10 text-white"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 9876543210"
          />
          <button
            onClick={signupWithPhone}
            disabled={loading}
            className="mt-3 w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 font-semibold"
          >
            {loading ? "Sending OTP..." : "Sign Up with Phone"}
          </button>
        </div>

        {/* SOCIAL LOGIN */}
        <div className="border-t border-white/10 pt-4">
          {/* GOOGLE */}
          <button
            onClick={() => oauthLogin("google")}
            className="w-full py-3 rounded-lg bg-white text-black font-semibold flex items-center justify-center gap-2"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </button>

          {/* APPLE */}
          <button
            onClick={() => oauthLogin("apple")}
            className="w-full mt-3 py-3 rounded-lg bg-black text-white font-semibold flex items-center justify-center gap-2"
          >
             Continue with Apple
          </button>
        </div>

      </div>

      {/* MESSAGE */}
      {message && (
        <p className="text-center text-green-400 text-sm mt-4">
          {message}
        </p>
      )}

      {/* LOGIN LINK */}
      <p className="text-center text-sm mt-6 text-white/50">
        Already have an account?{" "}
        <Link href="/login" className="text-[#21D4FD] underline">
          Login here
        </Link>
      </p>
    </div>
  );
}
