"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/app/providers";

export default function GeneratorPage() {
  const { user, loading } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  // 🚫 NOT LOGGED IN
  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-medium">
          Please log in to generate scripts
        </p>
      </div>
    );
  }

  async function generateScript() {
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "Generate a respectful conflict resolution script",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResult(data.text);
    } catch (err) {
      setError("Failed to generate script");
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Generate Script</h1>

      <button
        onClick={generateScript}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Generate
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {result && <pre className="mt-4 whitespace-pre-wrap">{result}</pre>}
    </div>
  );
}
