"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GeneratorPage() {
  const router = useRouter();

  const [situation, setSituation] = useState("");
  const [role, setRole] = useState("");
  const [mode, setMode] = useState("");
  const [behaviour, setBehaviour] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setError("");
    setLoading(true);

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
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setResult(data);
    } catch (e) {
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isDisabled =
    !situation || !role || !mode || !behaviour || loading;

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold text-white">
        Generate a Zero-Conflict Script
      </h1>
      <p className="text-white/60 mt-2">
        Works for workplace, relationships, friends, and family.  
        Hinglish supported. Tone stays respectful but clear.
      </p>

      {/* Situation */}
      <div className="mt-6">
        <label className="text-sm text-white/70">
          Describe the situation
        </label>
        <textarea
          className="w-full mt-2 p-3 rounded bg-[#0f1a35] text-white border border-white/10"
          rows={4}
          placeholder="Eg: I want to end a relationship without hurting them"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
        />
      </div>

      {/* Role */}
      <div className="mt-4">
        <label className="text-sm text-white/70">
          Who are you talking to?
        </label>
        <select
          className="w-full mt-2 p-3 rounded bg-[#0f1a35] text-white border border-white/10"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select role</option>
          <option>Manager</option>
          <option>Colleague</option>
          <option>Friend</option>
          <option>Partner</option>
          <option>Boyfriend / Girlfriend</option>
          <option>Parents</option>
          <option>Relative</option>
          <option>Brother / Sister</option>
        </select>
      </div>

      {/* Mode */}
      <div className="mt-4">
        <label className="text-sm text-white/70">
          Mode of communication
        </label>
        <select
          className="w-full mt-2 p-3 rounded bg-[#0f1a35] text-white border border-white/10"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="">Select mode</option>
          <option>Face to face conversation</option>
          <option>Phone call</option>
          <option>WhatsApp</option>
          <option>Email</option>
          <option>Text message</option>
        </select>
      </div>

      {/* Behaviour */}
      <div className="mt-4">
        <label className="text-sm text-white/70">
          Behaviour of the other person
        </label>
        <select
          className="w-full mt-2 p-3 rounded bg-[#0f1a35] text-white border border-white/10"
          value={behaviour}
          onChange={(e) => setBehaviour(e.target.value)}
        >
          <option value="">Select behaviour</option>
          <option>Calm</option>
          <option>Emotional</option>
          <option>Dominating</option>
          <option>Defensive</option>
          <option>Passive-aggressive</option>
          <option>Manipulative</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 mt-4">{error}</p>
      )}

      {/* Generate */}
      <button
        disabled={isDisabled}
        onClick={handleGenerate}
        className={`mt-6 px-6 py-3 rounded font-medium ${
          isDisabled
            ? "bg-white/20 text-white/40"
            : "bg-white text-black hover:bg-white/90"
        }`}
      >
        {loading ? "Generating..." : "Generate Scripts"}
      </button>

      {/* Results */}
      {result?.scripts && (
        <div className="mt-10 space-y-6">
          {result.scripts.map((s: any, idx: number) => (
            <div
              key={idx}
              className="bg-[#0f1a35] p-5 rounded border border-white/10"
            >
              <h3 className="font-semibold text-white">
                {s.type}
              </h3>
              <p className="text-white/80 mt-2 whitespace-pre-line">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
