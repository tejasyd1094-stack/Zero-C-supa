// components/Navbar.tsx
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
        alert("Logout failed. Try again.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Logout failed. Try again.");
    }
  }

  return (
    <nav className="flex items-center justify-between py-3 px-4 md:px-8">
      {/* Left: logo + brand text (brand text hidden on small screens to avoid overlap) */}
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.png" alt="Logo" width={42} height={42} className="rounded-md" />
        {/* hidden on small screens to avoid overlap; visible on md+ */}
        <span className="hidden md:inline-block font-bold text-lg tracking-wide text-white">
          Zero Conflict
        </span>
      </Link>

      {/* Right menu */}
      <div className="flex items-center gap-4">
        <Link href="/pricing" className="text-white/80 hover:text-white">
          Pricing
        </Link>

        <Link href="/generator" className="text-white/80 hover:text-white">
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
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#21D4FD] to-[#B721FF] text-black font-semibold"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-white/80 hover:text-white">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
