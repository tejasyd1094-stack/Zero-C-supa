"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Email magic link (passwordless)
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
        setMessage("Magic link sent! Check your email to continue.");
      }
    } catch (err: any) {
      setMessage(err?.message || "Failed to send magic link.");
    } finally {
      setLoading(false);
    }
  }

  // Phone OTP
  async function signupWithPhone() {
    setLoading(true);
    setMessage("");
    try {
      const { error } = await supabaseBrowser.auth.signInWithOtp({ phone });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("OTP sent to your phone number.");
      }
    } catch (err: any) {
      setMessage(err?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  // Google OAuth
  async function oauthLogin(provider: "google") {
    try {
      await supabaseBrowser.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        },
      });
    } catch (err: any) {
      console.error("OAuth error:", err);
      alert("OAuth login failed. Check console for details.");
    }
  }

  return (
    <div className="max-w-md mx-auto pt-20 px-6 text-white">
      <div className="text-center mb-8">
        <Image src="/logo.png" alt="Zero Conflict Logo" width={70} height={70} className="mx-auto rounded-xl" />
        <h1 className="mt-4 text-3xl font-bold">Create Your Account</h1>
        <p className="text-white/60 text-sm mt-2">Sign up using email, mobile number or Google.</p>
      </div>

      <div className="bg-[#0f1a35] rounded-xl p-6 border border-white/10 space-y-6">
        {/* EMAIL */}
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

        {/* PHONE */}
        <div>
          <label className="text-white/70 text-sm">Mobile Number</label>
          <input
            className="w-full mt-1 p-3 rounded-lg bg-[#071026] border border-white/10 text-white"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 9876543210"
            type="tel"
          />
          <button
            onClick={signupWithPhone}
            disabled={loading}
            className="mt-3 w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 font-semibold"
          >
            {loading ? "Sending OTP..." : "Sign Up with Phone"}
          </button>
        </div>

        {/* SOCIAL (Google only) */}
        <div className="border-t border-white/10 pt-4">
          <button
            onClick={() => oauthLogin("google")}
            className="w-full py-3 rounded-lg bg-white text-black font-semibold flex items-center justify-center gap-2"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </button>
        </div>
      </div>

      {message && <p className="text-center text-green-400 text-sm mt-4">{message}</p>}

      <p className="text-center text-sm mt-6 text-white/50">
        Already have an account?{" "}
        <Link href="/login" className="text-[#21D4FD] underline">Login here</Link>
      </p>
    </div>
  );
}
