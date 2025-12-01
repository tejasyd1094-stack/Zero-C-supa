"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/"), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen bg-black flex justify-center items-center">
      <img src="/logo.png" width="180" alt="App Logo" />
    </div>
  );
}