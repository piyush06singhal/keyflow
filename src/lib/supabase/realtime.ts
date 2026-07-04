import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

export function getUserNotificationChannel(
  supabase: SupabaseClient<Database>,
  userId: string,
) {
  return supabase.channel(`notifications:${userId}`);
}
