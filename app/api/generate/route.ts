import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const OPENAI_KEY = process.env.OPENAI_API_KEY || "";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email = "", situation = "", between = "", mode = "", behaviour = "Neutral", hinglish = false } = body;

    if (!email) {
      // Allow anonymous generation but usage tracking requires email for trials.
      // We'll proceed but won't update usage.
    }

    // Ensure supabase client for server operations
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Find or create user if email provided
    let userId: string | null = null;
    if (email) {
      const u = await supabase.from("users").select("id").eq("email", email).limit(1).maybeSingle();
      if (u.error) throw u.error;
      if (u.data?.id) userId = u.data.id;
      else {
        const inserted = await supabase.from("users").insert({ email }).select("id").maybeSingle();
        if (inserted.error) throw inserted.error;
        userId = inserted.data.id;
        await supabase.from("usage_limits").insert({ user_id: userId, used_count: 0 });
      }
    }

    // check usage if user exists
    let used = 0;
    let isPremium = false;
    if (userId) {
      const usage = await supabase.from("usage_limits").select("used_count,premium").eq("user_id", userId).limit(1).maybeSingle();
      if (usage.error) throw usage.error;
      used = usage.data?.used_count ?? 0;
      isPremium = usage.data?.premium ?? false;
      if (!isPremium && used >= 3) {
        return NextResponse.json({ error: "Trial limit reached. Purchase Premium at KryptonPath.com" }, { status: 403 });
      }
    }

    // Build three prompts for different tones
    const baseContext = `Situation: ${situation}
Between: ${between}
Mode: ${mode}
Behaviour: ${behaviour}
Language preference: ${hinglish ? "Hinglish (mix Hindi+English), informal where useful" : "Formal English"}
Instructions: Provide a ready-to-send ${mode} message. Keep concise (around 40-120 words). Do not blame.`;

    const prompts = [
      { type: "Empathetic", prompt: baseContext + "\nTone: Empathetic, understanding, de-escalating." },
      { type: "Bold / Direct", prompt: baseContext + "\nTone: Bold, direct, clear boundaries, assertive." },
      { type: "Clever", prompt: baseContext + "\nTone: Witty, clever, yet polite, suggest a practical next step." },
    ];

    let scripts: { type: string; text: string }[] = [];

    if (OPENAI_KEY) {
      try {
        const OpenAI = (await import("openai")).default;
        const client = new OpenAI({ apiKey: OPENAI_KEY });

        // Call OpenAI for each prompt (sequential to avoid rate issues)
        for (const p of prompts) {
          const resp = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: p.prompt }],
            max_tokens: 400
          });
          const text = resp.choices?.[0]?.message?.content?.trim() || "";
          scripts.push({ type: p.type, text: text || fallbackScript(p.type, situation, between, mode, hinglish) });
        }
      } catch (err) {
        // If OpenAI fails, use fallback templates
        scripts = prompts.map(p => ({ type: p.type, text: fallbackScript(p.type, situation, between, mode, hinglish) }));
      }
    } else {
      // No key: use fallbacks
      scripts = prompts.map(p => ({ type: p.type, text: fallbackScript(p.type, situation, between, mode, hinglish) }));
    }

    // Update usage if user exists (increment)
    if (userId) {
      await supabase.from("usage_limits").update({ used_count: used + 1, last_used: new Date().toISOString() }).eq('user_id', userId);
    }

    return NextResponse.json({ scripts });
  } catch (err:any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

function fallbackScript(type: string, situation: string, between: string, mode: string, hinglish: boolean) {
  // Simple fallback templates — include Hinglish if requested
  const h = (s: string) => hinglish ? s + " (Hinglish tone ok)" : s;
  if (type === "Empathetic") {
    return h(`Hi ${between},\n\nI hope you’re doing well. I wanted to share something I’ve been feeling about ${situation}. I value our relationship and wanted to discuss this so we can find a solution together. Would you be open to a quick ${mode}-style conversation?`);
  }
  if (type === "Bold / Direct") {
    return h(`Hi ${between},\n\nI need to be direct about ${situation}. This is important to me and I’d like it to change. Can we schedule a ${mode}-style conversation to resolve it?`);
  }
  return h(`Hi ${between},\n\nAbout ${situation}: here’s a short suggestion — propose a time to talk and a clear next step. Thanks.`);
}