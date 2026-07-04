"use client";

import { createBrowserClient } from "@supabase/ssr";

import { clientEnv } from "@/config/env";
import type { Database } from "@/types/database";

export function createSupabaseBrowserClient() {
  if (!clientEnv.NEXT_PUBLIC_SUPABASE_URL || !clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing public Supabase environment variables.");
  }

  return createBrowserClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
