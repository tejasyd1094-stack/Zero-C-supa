"use client";

import { useState } from "react";
import GradientButton from "@/components/GradientButton";

export default function GeneratorPage() {
  const [situation, setSituation] = useState("");
  const [between, setBetween] = useState("Manager");
  const [mode, setMode] = useState("Email");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setScript("");

    const email = localStorage.getItem("zc_email") || "";
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, situation, between, mode, extra: "" })
    });

    const j = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(j.error || "Error generating script");
      return;
    }

    setScript(j.script || "");
  }

  return (
    <div className="py-12 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generate Script</h1>

      <textarea
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        placeholder="Describe your situation..."
        className="w-full p-4 rounded-xl bg-[#071026] border border-white/5"
      />

      <div className="flex gap-3 mt-3">
        <select
          value={between}
          onChange={(e) => setBetween(e.target.value)}
          className="p-3 rounded-lg bg-[#071026] border border-white/5"
        >
          <option>Manager</option>
          <option>Colleague</option>
          <option>Direct Report</option>
        </select>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="p-3 rounded-lg bg-[#071026] border border-white/5"
        >
          <option>Email</option>
          <option>Teams</option>
          <option>WhatsApp</option>
        </select>
      </div>

      <div className="mt-4">
        <GradientButton onClick={generate} disabled={loading}>
          {loading ? "Generating…" : "Generate Script"}
        </GradientButton>
      </div>

      {script && (
        <div className="mt-6 p-4 rounded-lg bg-[#071026] border border-white/5 whitespace-pre-wrap">
          {script}
        </div>
      )}
    </div>
  );
}