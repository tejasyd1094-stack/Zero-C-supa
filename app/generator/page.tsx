"use client";

import { useState } from "react";
import GradientButton from "@/components/GradientButton";
import ScriptCarousel from "@/components/ScriptCarousel";

export default function GeneratorPage() {
  const [situation, setSituation] = useState("");
  const [between, setBetween] = useState("Manager");
  const [mode, setMode] = useState("Email");
  const [behaviour, setBehaviour] = useState("");
  const [loading, setLoading] = useState(false);
  const [scripts, setScripts] = useState<any[] | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const roles = [
    "Manager", "Colleague", "Direct Report", "Customer", "Vendor",
    "Friend", "Partner", "Boyfriend/Girlfriend", "Parents",
    "Relatives", "Brother/Sister"
  ];

  const modes = ["Email", "Teams", "WhatsApp", "Slack", "Face-to-Face"];

  async function generateScripts() {
    setLoading(true);
    setScripts(null);
    setErrorMsg("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localStorage.getItem("zc_email") || "",
          situation,
          between,
          mode,
          behaviour
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to generate");
        setLoading(false);
        return;
      }

      setScripts(data.scripts);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
    }

    setLoading(false);
  }

  return (
    <div className="py-12 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Generate a Conversation Script</h1>
      <p className="text-white/60 mt-1">For personal or corporate situations.</p>

      <label className="block mt-5 text-sm text-white/70">Describe the situation</label>
      <textarea
        className="w-full p-4 rounded-xl bg-[#071026] border border-white/5"
        placeholder="Explain what happened…"
        value={situation}
        onChange={e => setSituation(e.target.value)}
      />

      <div className="flex gap-3 mt-4">
        <div className="flex-1">
          <label className="text-sm text-white/70">Role of the other person</label>
          <select
            className="w-full p-3 rounded-lg bg-[#071026]"
            value={between}
            onChange={e => setBetween(e.target.value)}
          >
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm text-white/70">Mode</label>
          <select
            className="p-3 rounded-lg bg-[#071026]"
            value={mode}
            onChange={e => setMode(e.target.value)}
          >
            {modes.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <label className="block mt-5 text-sm text-white/70">
        Describe how the person behaves (free text, Hinglish supported)
      </label>
      <input
        className="w-full p-4 rounded-xl bg-[#071026] border border-white/5"
        placeholder="Example: 'Thoda defensive ho jate hain', 'Gets angry quickly'"
        value={behaviour}
        onChange={e => setBehaviour(e.target.value)}
      />

      <GradientButton className="mt-8" onClick={generateScripts} disabled={loading}>
        {loading ? "Generating…" : "Generate 3 Scripts"}
      </GradientButton>

      {errorMsg && (
        <div className="mt-4 text-red-400 text-sm">{errorMsg}</div>
      )}

      {loading && (
        <div className="mt-8 space-y-4">
          <div className="animate-pulse p-6 bg-[#0c1733] rounded-xl h-40"></div>
          <div className="animate-pulse p-6 bg-[#0c1733] rounded-xl h-40"></div>
          <div className="animate-pulse p-6 bg-[#0c1733] rounded-xl h-40"></div>
        </div>
      )}

      {scripts && <ScriptCarousel scripts={scripts} />}
    </div>
  );
}
