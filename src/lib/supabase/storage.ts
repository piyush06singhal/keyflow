import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

export const storageBuckets = {
  avatars: "avatars",
  profileBanners: "profile-banners",
  generatedReports: "generated-reports",
  analyticsExports: "analytics-exports",
  aiGeneratedAssets: "ai-generated-assets",
  feedbackAttachments: "feedback-attachments",
} as const;

export function getUserScopedStoragePath(userId: string, fileName: string) {
  return `${userId}/${crypto.randomUUID()}-${fileName}`;
}

export function getPublicUrl(
  supabase: SupabaseClient<Database>,
  bucket: string,
  path: string,
) {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
