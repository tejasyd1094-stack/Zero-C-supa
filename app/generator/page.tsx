"use client";

import { useState } from "react";
import GradientButton from "@/components/GradientButton";

type ScriptResult = { type: string; text: string };

export default function GeneratorPage() {
  const [situation, setSituation] = useState("");
  const [between, setBetween] = useState("Manager");
  const [mode, setMode] = useState("Email");
  const [behaviour, setBehaviour] = useState("Neutral");
  const [hinglish, setHinglish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScriptResult[] | null>(null);
  const [openaiStatus, setOpenaiStatus] = useState<string | null>(null);

  const roles = [
    "Manager", "Colleague", "Direct Report", "Customer", "Vendor",
    "Friend", "Partner", "Boyfriend/Girlfriend", "Parents", "Relatives",
    "Brother/Sister"
  ];

  const modes = ["Email", "Teams", "WhatsApp", "Slack", "Face-to-Face"];

  const behaviours = ["Calm", "Defensive", "Aggressive", "Passive", "Polite", "Neutral"];

  async function testOpenAI() {
    setOpenaiStatus("Testing…");
    try {
      const res = await fetch("/api/openai/test");
      const j = await res.json();
      setOpenaiStatus(j.ok ? "OpenAI key valid" : `Error: ${j.error || 'invalid'}`);
    } catch (e:any) {
      setOpenaiStatus("Test failed: " + (e?.message || String(e)));
    }
  }

  async function generate() {
    if (!situation.trim()) return alert("Please describe the situation.");
    setLoading(true);
    setResults(null);

    const payload = { email: localStorage.getItem("zc_email") || "", situation, between, mode, behaviour, hinglish };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Generation failed");
      setResults(j.scripts || null);
    } catch (err:any) {
      alert(err.message || "Generate failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-12 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generate Script</h1>

      <label className="block text-sm text-white/70 mb-1">Describe the situation</label>
      <textarea
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        placeholder="I need to talk about…"
        className="w-full p-4 rounded-xl bg-[#071026] border border-white/5"
      />

      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          <label className="text-sm text-white/70">Role</label>
          <select value={between} onChange={(e)=>setBetween(e.target.value)} className="w-full p-3 rounded-lg bg-[#071026]">
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm text-white/70">Mode</label>
          <select value={mode} onChange={(e)=>setMode(e.target.value)} className="p-3 rounded-lg bg-[#071026]">
            {modes.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          <label className="text-sm text-white/70">Person's behaviour</label>
          <select value={behaviour} onChange={(e)=>setBehaviour(e.target.value)} className="w-full p-3 rounded-lg bg-[#071026]">
            {behaviours.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>

        <div className="flex items-end">
          <label className="text-sm text-white/70 mr-2">Hinglish</label>
          <input type="checkbox" checked={hinglish} onChange={(e)=>setHinglish(e.target.checked)} />
        </div>
      </div>

      <div className="mt-4 flex gap-3 items-center">
        <GradientButton onClick={generate} disabled={loading}>
          {loading ? "Generating…" : "Generate 3 Scripts"}
        </GradientButton>

        <button onClick={testOpenAI} className="px-3 py-2 bg-white/10 rounded-lg text-sm">
          Test OpenAI Key
        </button>

        {openaiStatus && <div className="text-sm ml-2 text-white/60">{openaiStatus}</div>}
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">Generated scripts</h2>
          {results.map((s) => (
            <div key={s.type} className="p-4 rounded-lg bg-[#071026] border border-white/5">
              <div className="font-semibold mb-2">{s.type}</div>
              <div className="whitespace-pre-wrap">{s.text}</div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-white/60 text-sm">
        Tip: choose Hinglish to get a version with Hindi-English mix suitable for Indian conversation style.
      </p>
    </div>
  );
}