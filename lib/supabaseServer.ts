import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export function supabaseServer() {
  const cookieStore = cookies();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
      auth: {
        persistSession: false,
      },
    }
  );
}
