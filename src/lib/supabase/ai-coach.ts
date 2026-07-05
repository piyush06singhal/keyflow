"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AiGeneratedLessonInsert,
  AiPerformanceReportInsert,
  AiRecommendationInsert,
  AiRecommendationUpdate,
  AiUserGoalInsert,
  AiUserPreferences,
  AiUserPreferencesUpdate,
  ReportType,
  RecommendationStatus,
} from "@/features/ai-coach/types";

const DEFAULT_PREFERENCES: Omit<AiUserPreferences, "user_id" | "created_at" | "updated_at"> = {
  ai_enabled: true,
  auto_recommendations: true,
  weekly_reports: true,
  daily_practice_planner: true,
  notification_recommendations: true,
  notification_reports: true,
  notification_goals: true,
  notification_insights: true,
  preferred_learning_style: "balanced",
  focus_areas: [],
  avoid_topics: [],
  preferred_practice_times: [],
  preferred_languages: [],
  preferred_difficulty: "intermediate",
  allow_performance_analysis: true,
  allow_habit_tracking: true,
  share_insights_anonymous: false,
  preferred_ai_provider: "groq",
};

export async function getAiUserPreferences(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ai_user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return { user_id: userId, ...DEFAULT_PREFERENCES } as AiUserPreferences;
  }

  return data;
}

export async function upsertAiUserPreferences(
  userId: string,
  updates: AiUserPreferencesUpdate,
) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ai_user_preferences")
    // @ts-expect-error - Table types not properly generated
    .upsert([{ user_id: userId, ...updates }])
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getActiveRecommendations(userId: string, limit = 10) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ai_practice_recommendations")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["pending", "accepted"])
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function saveRecommendation(
  userId: string,
  recommendation: Omit<AiRecommendationInsert, "user_id">,
) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ai_practice_recommendations")
    // @ts-expect-error - Table types not properly generated
    .insert([{ user_id: userId, ...recommendation }])
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateRecommendationStatus(
  userId: string,
  recommendationId: string,
  status: RecommendationStatus,
) {
  const supabase = await createSupabaseServerClient();

  const updates: AiRecommendationUpdate = { status };
  if (status === "accepted") updates.accepted_at = new Date().toISOString();
  if (status === "completed") updates.completed_at = new Date().toISOString();
  if (status === "dismissed") updates.viewed_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("ai_practice_recommendations")
    // @ts-expect-error - Table types not properly generated
    .update(updates)
    .eq("user_id", userId)
    .eq("id", recommendationId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getPerformanceReports(
  userId: string,
  reportType?: ReportType,
  limit = 10,
) {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("ai_performance_reports")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (reportType) {
    query = query.eq("report_type", reportType);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function savePerformanceReport(
  userId: string,
  report: Omit<AiPerformanceReportInsert, "user_id">,
) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ai_performance_reports")
    // @ts-expect-error - Table types not properly generated
    .insert([{ user_id: userId, ...report }])
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getGeneratedLessons(userId: string, limit = 20) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ai_generated_lessons")
    .select("*")
    .eq("user_id", userId)
    .eq("is_archived", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function saveGeneratedLesson(
  userId: string,
  lesson: Omit<AiGeneratedLessonInsert, "user_id">,
) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ai_generated_lessons")
    // @ts-expect-error - Table types not properly generated
    .insert([{ user_id: userId, ...lesson }])
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getActiveGoals(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ai_user_goals")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("target_date", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function saveAiGoal(userId: string, goal: Omit<AiUserGoalInsert, "user_id">) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ai_user_goals")
    // @ts-expect-error - Table types not properly generated
    .insert([{ user_id: userId, ...goal }])
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function isAiEnabledForUser(userId: string) {
  const prefs = await getAiUserPreferences(userId);
  return prefs.ai_enabled;
}
