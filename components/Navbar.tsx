"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full p-4 flex justify-between items-center bg-black text-white">
      <Link href="/">Zero Conflict</Link>

      <div className="space-x-4">
        <Link href="/pricing">Pricing</Link>
        <Link href="/splash">Splash</Link>
      </div>
    </nav>
  );
}