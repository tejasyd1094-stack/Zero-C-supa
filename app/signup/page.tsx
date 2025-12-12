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

  async function signupWithEmail() {
    setLoading(true);
    setMessage("");

    const { error } = await supabaseBrowser.auth.signUp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });

    setLoading(false);

    if (error) return setMessage(error.message);
    setMessage("Check your email to confirm your account.");
  }

  async function signupWithPhone() {
    setLoading(true);
    setMessage("");

    const { error } = await supabaseBrowser.auth.signInWithOtp({
      phone,
    });

    setLoading(false);

    if (error) return setMessage(error.message);
    setMessage("OTP sent to your phone.");
  }

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
      <div className="text-center mb-8">
        <Image
          src="/logo.png"
          alt="Zero Conflict Logo"
          width={70}
          height={70}
          className="mx-auto"
        />
        <h1 className="mt-4 text-2xl font-bold">Create Your Account</h1>
        <p className="text-white/60 text-sm mt-1">
          Sign up to start generating powerful AI scripts.
        </p>
      </div>

      <div className="bg-[#0f1a35] rounded-xl p-6 border border-white/10 space-y-4">

        {/* Email Input */}
        <div>
          <label className="text-white/70 text-sm">Email Address</label>
          <input
            className="w-full mt-1 p-3 rounded-lg bg-[#071026] border border-white/10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <button
            onClick={signupWithEmail}
            disabled={loading}
            className="mt-3 w-full py-3 rounded-lg bg-gradient-to-r from-[#21D4FD] to-[#B721FF] font-semibold"
          >
            {loading ? "Sending Link..." : "Sign Up with Email"}
          </button>
        </div>

        {/* Phone Number Input */}
        <div className="pt-2">
          <label className="text-white/70 text-sm">Mobile Number</label>
          <input
            className="w-full mt-1 p-3 rounded-lg bg-[#071026] border border-white/10"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 9876543210"
          />
          <button
            onClick={signupWithPhone}
            disabled={loading}
            className="mt-3 w-full py-3 rounded-lg bg-white/10 hover:bg-white/20"
          >
            {loading ? "Sending OTP..." : "Sign Up with Mobile"}
          </button>
        </div>

        {/* Social Login */}
        <div className="border-t border-white/10 pt-4">
          <button
            onClick={() => oauthLogin("google")}
            className="w-full py-3 rounded-lg bg-white text-black font-semibold flex items-center justify-center gap-2"
          >
            <Image src="/google.svg" width={20} height={20} alt="Google" />
            Continue with Google
          </button>

          <button
            onClick={() => oauthLogin("apple")}
            className="w-full mt-3 py-3 rounded-lg bg-black text-white font-semibold flex items-center justify-center gap-2"
          >
             Continue with Apple
          </button>
        </div>
      </div>

      {message && (
        <p className="text-center text-sm mt-4 text-green-400">{message}</p>
      )}

      <p className="text-center text-sm mt-6 text-white/50">
        Already have an account?{" "}
        <Link href="/login" className="text-[#21D4FD] underline">
          Login here
        </Link>
      </p>
    </div>
  );
}