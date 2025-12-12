"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    try {
      const { error } = await supabaseBrowser.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        // show friendly message if needed
        alert("Logout failed. Please try again.");
        return;
      }
      // Push to home and refresh app state
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout exception:", err);
      alert("Logout failed. Please try again.");
    }
  }

  return (
    <nav className="flex items-center justify-between py-4">
      {/* LEFT — Logo (brand text only shown when logged out) */}
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-md" />
        {!user && (
          <span className="font-bold text-lg tracking-wide text-white">
            Zero Conflict
          </span>
        )}
      </Link>

      {/* RIGHT — Menu */}
      <div className="flex gap-4 items-center text-sm">
        <Link href="/pricing" className="text-white/70 hover:text-white">
          Pricing
        </Link>

        <Link href="/generator" className="text-white/70 hover:text-white">
          Generate
        </Link>

        {!user ? (
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
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-white/80">
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
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
