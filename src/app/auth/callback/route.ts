import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { initializeUserProfile } from "@/lib/supabase/profile";
import { routes } from "@/lib/constants/routes";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirectTo") ?? routes.dashboard;

  if (code) {
    const supabase = await createSupabaseServerClient();

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Initialize profile if new user
      await initializeUserProfile(data.user);

      // Redirect to onboarding or intended destination
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  // If error or no code, redirect to login
  return NextResponse.redirect(new URL(routes.login, request.url));
}
