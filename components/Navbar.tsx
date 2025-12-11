"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Zero Conflict logo"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <span className="font-bold text-lg">Zero Conflict</span>
      </Link>

      <div className="flex gap-4 items-center text-sm">
        <Link href="/pricing" className="text-white/70 hover:text-white">
          Pricing
        </Link>
        <Link href="/generator" className="text-white/70 hover:text-white">
          Generate
        </Link>
        <Link
          href="/login"
          className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}