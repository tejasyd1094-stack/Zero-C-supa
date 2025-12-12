"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/providers";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="flex items-center justify-between py-4">
      {/* LEFT — LOGO + (Zero Conflict text only when logged OUT) */}
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-md"
        />

        {/* Show brand text ONLY when logged-out */}
        {!user && (
          <span className="font-bold text-lg tracking-wide text-white">
            Zero Conflict
          </span>
        )}
      </Link>

      {/* RIGHT MENU */}
      <div className="flex gap-4 items-center text-sm">
        <Link href="/pricing" className="text-white/70 hover:text-white">
          Pricing
        </Link>

        <Link href="/generator" className="text-white/70 hover:text-white">
          Generate
        </Link>

        {/* LOGGED OUT → Show Login + Sign Up */}
        {!user && (
          <>
            <Link
              href="/login"
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#21D4FD] to-[#B721FF] text-black font-semibold transition"
            >
              Sign Up
            </Link>
          </>
        )}

        {/* LOGGED IN → Show Dashboard + Logout */}
        {user && (
          <div className="flex gap-4 items-center">
            <Link href="/dashboard" className="text-white/80 hover:text-white">
              Dashboard
            </Link>

            <button
              onClick={async () => {
                const { supabaseBrowser } = await import("@/lib/supabaseClient");
                await supabaseBrowser.auth.signOut();
                window.location.href = "/";
              }}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
