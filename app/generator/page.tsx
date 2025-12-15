"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/app/providers";

export default function GeneratorPage() {
  const { user, loading } = useContext(AuthContext);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="p-10 text-center">
        <p className="text-lg font-semibold text-red-600">
          Please log in to generate scripts
        </p>
      </div>
    );
  }

  async function generate() {
    setError("");
    setResult("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setResult(data.output);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Script Generator</h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the situation..."
        className="w-full border p-3 rounded mb-4"
        rows={4}
      />

      <button
        onClick={generate}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Generate
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {result && (
        <pre className="bg-gray-100 p-4 mt-4 rounded whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  );
}
