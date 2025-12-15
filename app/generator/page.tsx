"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/app/providers";

const ROLES = [
  "Manager",
  "Colleague",
  "Friend",
  "Partner",
  "Boyfriend / Girlfriend",
  "Parents",
  "Sibling",
  "Relative",
];

const MODES = [
  "Written message",
  "Face to face conversation",
  "WhatsApp / Chat",
  "Email",
];

const BEHAVIOURS = [
  "Calm and understanding",
  "Aggressive",
  "Emotionally sensitive",
  "Dominating",
  "Avoidant",
  "Logical and practical",
];

export default function GeneratorPage() {
  const { user, loading } = useContext(AuthContext);

  const [situation, setSituation] = useState("");
  const [role, setRole] = useState("");
  const [mode, setMode] = useState("");
  const [behaviour, setBehaviour] = useState("");
  const [result, setResult] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ⏳ Loading auth state
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // 🔐 Not logged in
  if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">
          Please log in to generate scripts
        </h2>
        <p className="text-white/60">
          You must be logged in to use Zero Conflict AI.
        </p>
      </div>
    );
  }

  async function handleGenerate() {
    setError("");
    setResult([]);
    setSubmitting(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation,
          role,
          mode,
          behaviour,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate scripts");
        return;
      }

      setResult(data.scripts || []);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Zero Conflict Script Generator</h1>
      <p className="text-white/60 mb-6">
        Generate respectful, clear, and effective communication scripts for
        work and personal relationships.
      </p>

      {/* Situation */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Describe your situation
        </label>
        <textarea
          className="w-full p-3 rounded bg-[#0f1a35] border border-white/10"
          rows={4}
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="Explain what happened and what you want to communicate..."
        />
      </div>

      {/* Role */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Who are you talking to?
        </label>
        <select
          className="w-full p-3 rounded bg-[#0f1a35] border border-white/10"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select role</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Mode */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Mode of communication
        </label>
        <select
          className="w-full p-3 rounded bg-[#0f1a35] border border-white/10"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="">Select mode</option>
          {MODES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Behaviour */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">
          How is the other person’s behaviour?
        </label>
        <select
          className="w-full p-3 rounded bg-[#0f1a35] border border-white/10"
          value={behaviour}
          onChange={(e) => setBehaviour(e.target.value)}
        >
          <option value="">Select behaviour</option>
          {BEHAVIOURS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGenerate}
        disabled={submitting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 transition px-4 py-3 rounded font-semibold"
      >
        {submitting ? "Generating..." : "Generate Scripts"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Results */}
      {result.length > 0 && (
        <div className="mt-8 space-y-4">
          {result.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded bg-[#0f1a35] border border-white/10"
            >
              <h3 className="font-semibold mb-2">{item.type}</h3>
              <p className="whitespace-pre-wrap text-white/80">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
