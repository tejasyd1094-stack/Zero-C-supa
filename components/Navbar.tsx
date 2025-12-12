"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/providers";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="flex items-center justify-between py-4">
      {/* LEFT — LOGO ONLY WHEN LOGGED IN */}
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-md"
        />

        {/* Hide brand text when user is logged in */}
        {!user && (
          <span className="font-bold text-lg tracking-wide text-white">
            Zero Conflict
          </span>
        )}
      </Link>

      {/* RIGHT — MENU */}
      <div className="flex gap-4 items-center text-sm">

        <Link href="/pricing" className="text-white/70 hover:text-white">
          Pricing
        </Link>

        <Link href="/generator" className="text-white/70 hover:text-white">
          Generate
        </Link>

        {/* WHEN LOGGED OUT → Show Login + Sign Up */}
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
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#21D4FD] to-[#B721FF] font-semibold text-black transition"
            >
              Sign Up
            </Link>
          </>
        )}

        {/* WHEN LOGGED IN → Show Dashboard + Logout */}
        {user && (
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-white/80">
              Dashboard
            </Link>
            <LogoutButton />
          </div>
        )}
      </div>
    </nav>
  );
}

function LogoutButton() {
  async function logout() {
    const { supabaseBrowser } = await import("@/lib/supabaseClient");
    await supabaseBrowser.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">
      Logout
    </button>
  );
}
