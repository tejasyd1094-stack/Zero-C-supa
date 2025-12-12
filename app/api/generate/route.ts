import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      situation,
      role,
      mode,
      behaviour,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1️⃣ Check credits
    const { data: usage } = await supabase
      .from("usage_limits")
      .select("credits")
      .eq("user_id", userId)
      .single();

    if (!usage || usage.credits <= 0) {
      return NextResponse.json(
        { error: "No credits left" },
        { status: 403 }
      );
    }

    // 2️⃣ Prompt (first-person, Hinglish friendly)
    const prompt = `
You are Zero Conflict AI.

Generate 3 FIRST-PERSON conversation scripts (I / me / my).
Do NOT speak in third person.

Tone must feel natural for Indians (Hinglish allowed).

Context:
- Situation: ${situation}
- Role of other person: ${role}
- Mode of communication: ${mode}
- Behaviour of other person: ${behaviour}

Return JSON strictly in this format:

{
  "scripts": [
    { "type": "Empathetic", "text": "..." },
    { "type": "Bold", "text": "..." },
    { "type": "Clever", "text": "..." }
  ]
}
`;

    // 3️⃣ OpenAI call (CORRECT METHOD)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
    });

    const rawText = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(rawText);

    // 4️⃣ Save script history
    await supabase.from("generated_scripts").insert({
      user_id: userId,
      request_id: crypto.randomUUID(),
      payload: parsed,
    });

    // 5️⃣ Deduct credit
    await supabase
      .from("usage_limits")
      .update({ credits: usage.credits - 1 })
      .eq("user_id", userId);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}
