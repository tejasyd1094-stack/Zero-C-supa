import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseServer } from "@/lib/supabaseServer";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const supabase = supabaseServer();

  // 1️⃣ AUTH CHECK
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Please log in to generate scripts." },
      { status: 401 }
    );
  }

  // 2️⃣ CREDIT CHECK
  const { data: usage } = await supabase
    .from("usage_limits")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!usage || usage.used_count >= usage.max_credits) {
    return NextResponse.json(
      { error: "No credits left. Please buy more." },
      { status: 403 }
    );
  }

  // 3️⃣ READ INPUT
  const body = await req.json();
  const {
    situation,
    role,
    communication_mode,
    person_behavior,
  } = body;

  // 4️⃣ PROMPT
  const prompt = `
You are Zero Conflict AI.
Generate 3 scripts in Hinglish (Indian friendly tone):

1. Empathetic
2. Bold
3. Clever

Situation: ${situation}
Role: ${role}
Communication mode: ${communication_mode}
Person behavior: ${person_behavior}

Return JSON only:
{
  "scripts": [
    { "type": "Empathetic", "text": "" },
    { "type": "Bold", "text": "" },
    { "type": "Clever", "text": "" }
  ]
}
`;

  // 5️⃣ OPENAI CALL
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const result = completion.choices[0].message.content;

  // 6️⃣ SAVE SCRIPT
  await supabase.from("generated_scripts").insert({
    user_id: user.id,
    content: result,
  });

  // 7️⃣ DEDUCT CREDIT
  await supabase
    .from("usage_limits")
    .update({ used_count: usage.used_count + 1 })
    .eq("user_id", user.id);

  return NextResponse.json(JSON.parse(result));
}
