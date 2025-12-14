import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // 1️⃣ AUTH CHECK (THIS WAS FAILING BEFORE)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ CHECK CREDITS
    const { data: usage, error: usageError } = await supabase
      .from("usage_limits")
      .select("used_count, max_credits")
      .eq("user_id", user.id)
      .single();

    if (usageError || !usage) {
      return NextResponse.json(
        { error: "Usage record not found" },
        { status: 400 }
      );
    }

    if (usage.used_count >= usage.max_credits) {
      return NextResponse.json(
        { error: "No credits left" },
        { status: 403 }
      );
    }

    // 3️⃣ READ REQUEST BODY
    const body = await req.json();
    const {
      situation,
      role,
      mode,
      behaviour,
      language,
    } = body;

    // 4️⃣ OPENAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const prompt = `
You are Zero Conflict AI.

Generate 3 versions of a script:
1. Empathetic
2. Bold
3. Clever

Context:
Situation: ${situation}
Talking to: ${role}
Mode: ${mode}
Person behaviour: ${behaviour}

Language style:
- Hinglish allowed naturally
- Sound human, not robotic
- First-person tone (I / me)

Return JSON strictly.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content;

    // 5️⃣ SAVE SCRIPT
    await supabase.from("generated_scripts").insert({
      user_id: user.id,
      content: responseText,
    });

    // 6️⃣ DEDUCT CREDIT (THIS TRIGGERS REALTIME UPDATE)
    await supabase
      .from("usage_limits")
      .update({ used_count: usage.used_count + 1 })
      .eq("user_id", user.id);

    return NextResponse.json({
      success: true,
      scripts: responseText,
    });
  } catch (err: any) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
