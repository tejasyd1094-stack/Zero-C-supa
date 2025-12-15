"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type Script = {
  type: string;
  text: string;
};

export default function GeneratorPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scripts, setScripts] = useState<Script[]>([]);

  const [situation, setSituation] = useState("");
  const [role, setRole] = useState("");
  const [communicationMode, setCommunicationMode] = useState("");
  const [personBehavior, setPersonBehavior] = useState("");

  // 🔐 Load logged-in user
  useEffect(() => {
    const supabase = supabaseBrowser();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, []);

  // 🚀 Generate script
  const generateScript = async () => {
    setError("");
    setScripts([]);

    if (!user) {
      setError("Please log in to generate the script.");
      return;
    }

    if (!situation || !role || !communicationMode || !personBehavior) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation,
          role,
          communication_mode: communicationMode,
          person_behavior: personBehavior,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setScripts(data.scripts);
    } catch (err) {
      setError("Failed to generate script. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">
        Generate a Conflict-Free Script
      </h1>

      <p className="text-white/70 mb-8">
        Works for office, friends, partners, family — in simple Hinglish.
      </p>

      {/* FORM */}
      <div className="space-y-4">
        <textarea
          placeholder="Describe the situation..."
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          className="w-full p-3 rounded bg-[#0f1a35] text-white border border-white/10"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 rounded bg-[#0f1a35] text-white border border-white/10"
        >
          <option value="">Select role</option>
          <option>Manager</option>
          <option>Colleague</option>
          <option>Friend</option>
          <option>Partner / BF / GF</option>
          <option>Parent</option>
          <option>Sibling</option>
          <option>Relative</option>
        </select>

        <select
          value={communicationMode}
          onChange={(e) => setCommunicationMode(e.target.value)}
          className="w-full p-3 rounded bg-[#0f1a35] text-white border border-white/10"
        >
          <option value="">Mode of communication</option>
          <option>Face to face conversation</option>
          <option>WhatsApp / Chat</option>
          <option>Email</option>
          <option>Call</option>
        </select>

        <select
          value={personBehavior}
          onChange={(e) => setPersonBehavior(e.target.value)}
          className="w-full p-3 rounded bg-[#0f1a35] text-white border border-white/10"
        >
          <option value="">How is the other person?</option>
          <option>Calm and understanding</option>
          <option>Emotional</option>
          <option>Defensive</option>
          <option>Dominating</option>
          <option>Passive aggressive</option>
        </select>

        <button
          onClick={generateScript}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded font-semibold"
        >
          {loading ? "Generating..." : "Generate Script"}
        </button>

        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}
      </div>

      {/* OUTPUT */}
      {scripts.length > 0 && (
        <div className="mt-10 space-y-6">
          {scripts.map((s, i) => (
            <div
              key={i}
              className="bg-[#0f1a35] border border-white/10 rounded p-4"
            >
              <h3 className="font-semibold text-blue-400 mb-2">
                {s.type}
              </h3>
              <pre className="text-white whitespace-pre-wrap text-sm">
                {s.text}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
