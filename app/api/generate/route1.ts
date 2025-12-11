import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const OPENAI_KEY = process.env.OPENAI_API_KEY || "";
const MODEL = "gpt-4o-mini"; // ultra-cheap + fast

// Retry helper for 429 errors
async function safeAI(client: any, payload: any) {
  try {
    return await client.chat.completions.create(payload);
  } catch (err: any) {
    if (String(err.message || "").includes("429")) {
      await new Promise((res) => setTimeout(res, 700));
      return await client.chat.completions.create(payload);
    }
    throw err;
  }
}

// Fallback (if OpenAI fails)
function fallback(type: string, situation: string, between: string, behaviour: string) {
  return `(${type})\n\n${between}, regarding "${situation}" — considering their behaviour ("${behaviour}"), here is a simple message:\n\nLet's talk about this openly and find a clear next step together.`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email = "",
      situation = "",
      between = "",
      mode = "",
      behaviour = "", // NOW free-text input
    } = body;

    if (!situation.trim())
      return NextResponse.json({ error: "Situation is required." }, { status: 400 });

    // ---------------------------
    // Supabase client
    // ---------------------------
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // ---------------------------
    // User + usage tracking
    // ---------------------------
    let userId: string | null = null;

    if (email) {
      let user = await supabase.from("users").select("id").eq("email", email).maybeSingle();
      if (user.error) throw user.error;

      if (user.data?.id) userId = user.data.id;
      else {
        let created = await supabase
          .from("users")
          .insert({ email })
          .select("id")
          .maybeSingle();
        if (created.error) throw created.error;

        userId = created.data.id;
        await supabase.from("usage_limits").insert({ user_id: userId, used_count: 0 });
      }
    }

    // Check trial
    let used = 0;
    let premium = false;

    if (userId) {
      const usage = await supabase
        .from("usage_limits")
        .select("used_count, premium")
        .eq("user_id", userId)
        .maybeSingle();

      if (usage.error) throw usage.error;

      used = usage.data?.used_count ?? 0;
      premium = usage.data?.premium ?? false;

      if (!premium && used >= 3) {
        return NextResponse.json(
          { error: "Your free 3-script trial is over. Please upgrade your plan." },
          { status: 403 }
        );
      }
    }

    // ---------------------------
    // Build models prompts
    // Auto-detect Hinglish based on user input
    // ---------------------------
    const detectLanguageHint = `
Important rule:
- If user input contains Hindi or Hinglish words, respond in clear Hinglish.
- If the input is mostly English, respond in polished English.
- Never switch languages unless user text suggests it.
`;

    const base = `
SITUATION: ${situation}
PERSON: ${between}
MODE OF COMMUNICATION: ${mode}
BEHAVIOUR (user typed): ${behaviour}

${detectLanguageHint}

Write messages that sound natural for Indian communication style.
Keep them short, clear, human, and ready to send.
`;

    const tones = [
      { type: "Empathetic", tone: "warm, understanding, emotionally mature" },
      { type: "Bold / Direct", tone: "confident, clear, boundary-setting" },
      { type: "Clever", tone: "smart, witty, smooth but respectful" },
    ];

    let scripts: any[] = [];

    // ---------------------------
    // OPENAI CALL
    // ---------------------------
    if (OPENAI_KEY) {
      try {
        const OpenAI = (await import("openai")).default;
        const ai = new OpenAI({ apiKey: OPENAI_KEY });

        for (const t of tones) {
          const response = await safeAI(ai, {
            model: MODEL,
            messages: [
              {
                role: "user",
                content: base + `\n\nTONE: ${t.tone}\nGenerate a message.`,
              },
            ],
            max_tokens: 240,
          });

          const txt = response.choices?.[0]?.message?.content?.trim();

          scripts.push({
            type: t.type,
            text: txt || fallback(t.type, situation, between, behaviour),
          });
        }
      } catch (err) {
        scripts = tones.map((t) => ({
          type: t.type,
          text: fallback(t.type, situation, between, behaviour),
        }));
      }
    } else {
      // No key
      scripts = tones.map((t) => ({
        type: t.type,
        text: fallback(t.type, situation, between, behaviour),
      }));
    }

    // ---------------------------
    // Update trial count
    // ---------------------------
    if (userId) {
      await supabase
        .from("usage_limits")
        .update({ used_count: used + 1 })
        .eq("user_id", userId);
    }

    return NextResponse.json({ scripts });
  } catch (err: any) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
