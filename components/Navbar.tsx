"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/providers";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="flex items-center justify-between py-4">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.png" alt="Zero Conflict logo" width={40} height={40} />
        <span className="font-bold text-lg">Zero Conflict</span>
      </Link>

      <div className="flex gap-4 items-center text-sm">
        <Link href="/pricing" className="text-white/70 hover:text-white">Pricing</Link>
        <Link href="/generator" className="text-white/70 hover:text-white">Generate</Link>

        {user ? (
          // Logged-in UI
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/80">Hi, {user.email?.split("@")[0]}</span>
            <Link href="/dashboard" className="px-3 py-2 bg-white/10 rounded-lg">Dashboard</Link>
            <LogoutButton />
          </div>
        ) : (
          <Link href="/login" className="px-3 py-2 bg-white/10 rounded-lg">Login</Link>
        )}
      </div>
    </nav>
  );
}

// Logout helper component
function LogoutButton() {
  async function logout() {
    // sign out using supabase
    const { error } = await (await import("@/lib/supabaseClient")).supabaseBrowser.auth.signOut();
    if (error) {
      console.error("Logout failed", error);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <button onClick={logout} className="px-3 py-2 bg-white/10 rounded-lg text-sm">
      Logout
    </button>
  );
}
