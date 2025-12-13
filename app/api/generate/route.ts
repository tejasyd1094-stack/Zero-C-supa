import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // REQUIRED for server updates
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      situation,
      role,
      communicationMode,
      tone,
      behaviour,
    } = body;

    /* -------------------------------
       1. AUTH: Get user from header
    -------------------------------- */
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* -------------------------------
       2. CHECK CREDITS
    -------------------------------- */
    const { data: usage, error: usageError } = await supabase
      .from("usage_limits")
      .select("used_count, max_credits")
      .eq("user_id", user.id)
      .single();

    if (usageError || !usage) {
      return NextResponse.json(
        { error: "Usage data not found" },
        { status: 400 }
      );
    }

    if (usage.used_count >= usage.max_credits) {
      return NextResponse.json(
        { error: "No credits remaining" },
        { status: 403 }
      );
    }

    /* -------------------------------
       3. BUILD PROMPT (HINGLISH SAFE)
    -------------------------------- */
    const prompt = `
You are Zero Conflict AI.

Generate 3 scripts:
1. Empathetic
2. Bold
3. Clever

Situation: ${situation}
Relationship: ${role}
Mode: ${communicationMode}
Person behaviour: ${behaviour}

Rules:
- Speak in first person
- Natural English or Hinglish
- No third-person narration
- Polite but clear
`;

    /* -------------------------------
       4. CALL OPENAI
    -------------------------------- */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      throw new Error("Empty response from OpenAI");
    }

    /* -------------------------------
       5. SAVE SCRIPT HISTORY
    -------------------------------- */
    await supabase.from("generated_scripts").insert({
      user_id: user.id,
      content: text,
    });

    /* -------------------------------
       6. INCREMENT CREDIT USAGE
       🔥 THIS FIXES YOUR DASHBOARD
    -------------------------------- */
    await supabase
      .from("usage_limits")
      .update({
        used_count: usage.used_count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    /* -------------------------------
       7. RETURN RESPONSE
    -------------------------------- */
    return NextResponse.json({
      success: true,
      scripts: text,
      remainingCredits: usage.max_credits - (usage.used_count + 1),
    });
  } catch (error: any) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}
