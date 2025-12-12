import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const body = await req.json();

  const { requestId, situation, role, mode, behaviour } = body;

  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = auth.user.id;

  // prevent double charge
  const { data: exists } = await supabase
    .from("generated_scripts")
    .select("id")
    .eq("request_id", requestId)
    .maybeSingle();

  if (exists) {
    return NextResponse.json({ error: "Already processed" });
  }

  const { data: usage } = await supabase
    .from("usage_limits")
    .select("credits")
    .eq("user_id", userId)
    .single();

  if (!usage || usage.credits <= 0)
    return NextResponse.json({ error: "No credits left" }, { status: 403 });

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const prompt = `
Return ONLY JSON.
Three scripts in Hinglish:
1. Empathetic
2. Bold (first-person, assertive, direct, NOT third person)
3. Clever

Situation: ${situation}
Role: ${role}
Mode: ${mode}
Behaviour: ${behaviour}
`;

  const res = await openai.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
    max_output_tokens: 600,
  });

  const parsed = JSON.parse(res.output_text!);

  for (const s of parsed.scripts) {
    await supabase.from("generated_scripts").insert({
      user_id: userId,
      type: s.type === "Bold / Direct" ? "Bold" : s.type,
      text: s.text,
      request_id: requestId,
      credits_used: 1,
    });
  }

  await supabase
    .from("usage_limits")
    .update({ credits: usage.credits - 1 })
    .eq("user_id", userId);

  return NextResponse.json({ scripts: parsed.scripts });
}
