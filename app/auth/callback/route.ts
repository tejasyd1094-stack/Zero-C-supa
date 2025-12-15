import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login", requestUrl.origin)
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    return NextResponse.redirect(
      new URL("/login?error=auth", requestUrl.origin)
    );
  }

  const cookieStore = cookies();

  cookieStore.set("sb-access-token", data.session.access_token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });

  cookieStore.set("sb-refresh-token", data.session.refresh_token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });

  return NextResponse.redirect(
    new URL("/dashboard", requestUrl.origin)
  );
}
