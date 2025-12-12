"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/providers";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="flex items-center justify-between py-4">
      {/* LEFT SECTION */}
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-md"
        />

        {/* Hide text if user is logged in */}
        {!user && (
          <span className="font-bold text-lg tracking-wide text-white">
            Zero Conflict
          </span>
        )}
      </Link>

      {/* RIGHT SECTION */}
      <div className="flex gap-4 items-center text-sm">
        <Link
          href="/pricing"
          className="text-white/70 hover:text-white transition"
        >
          Pricing
        </Link>

        <Link
          href="/generator"
          className="text-white/70 hover:text-white transition"
        >
          Generate
        </Link>

        {/* Auth Toggle */}
        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-white/80">
              Dashboard
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <Link
            href="/login"
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

// Logout Component
function LogoutButton() {
  async function logout() {
    const { supabaseBrowser } = await import("@/lib/supabaseClient");
    await supabaseBrowser.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button className="px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20">
      Logout
    </button>
  );
}
