"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/app/providers";

export default function GeneratorPage() {
  const { user, loading } = useContext(AuthContext);

  const [situation, setSituation] = useState("");
  const [role, setRole] = useState("Manager");
  const [tone, setTone] = useState("Empathetic");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  // ✅ ONLY show this if truly logged out
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
    setOutput("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        situation,
        role,
        tone,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to generate");
      return;
    }

    setOutput(data.output);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Zero Conflict Script Generator
      </h1>

      <label className="block mb-2 font-semibold">
        Describe the situation
      </label>
      <textarea
        className="w-full border p-3 rounded mb-4"
        rows={4}
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="font-semibold block mb-1">Your Role</label>
          <select
            className="w-full border p-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Manager</option>
            <option>Employee</option>
            <option>Colleague</option>
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-1">Tone</label>
          <select
            className="w-full border p-2 rounded"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option>Empathetic</option>
            <option>Bold</option>
            <option>Professional</option>
          </select>
        </div>
      </div>

      <button
        onClick={generate}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Generate Script
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {output && (
        <pre className="bg-gray-100 p-4 mt-6 rounded whitespace-pre-wrap">
          {output}
        </pre>
      )}
    </div>
  );
}
