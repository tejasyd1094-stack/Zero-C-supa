"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/app/providers";

export default function GeneratorPage() {
  const { session, loading } = useContext(AuthContext);
  const user = session?.user;

  const [error, setError] = useState("");

  const generateScript = async () => {
    setError("");

    if (loading) {
      setError("Checking login status, please wait...");
      return;
    }

    if (!user) {
      setError("Please log in to generate the script.");
      return;
    }

    // generation logic continues...
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {loading && (
        <p className="text-white/60 mb-4">Loading session…</p>
      )}

      {/* UI continues */}
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
}
