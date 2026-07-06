"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface DashboardStats {
  avgWpm: number;
  bestWpm: number;
  avgAccuracy: number;
  typingTime: number;
  totalWords: number;
  totalCharacters: number;
  codingSessions: number;
  currentLevel: number;
  currentXp: number;
  currentRank: number;
  currentStreak: number;
  longestStreak: number;
  dailyGoalCompletion: number;
  weeklyImprovement: number;
  monthlyImprovement: number;
}

export interface Activity {
  id: string;
  type: "typing" | "coding" | "achievement" | "challenge" | "profile" | "ai_report";
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, string>;
}

export interface HeatmapDay {
  date: string;
  count: number;
  minutes: number;
}

export interface GoalProgress {
  current: number;
  target: number;
}

export interface DashboardData {
  displayName: string;
  email: string | null;
  level: number;
  streak: number;
  todayGoal: GoalProgress;
  xp: number;
  rank: number;
  stats: DashboardStats;
  activities: Activity[];
  heatmapData: HeatmapDay[];
  dailyGoal: GoalProgress;
  weeklyGoal: GoalProgress;
  monthlyGoal: GoalProgress;
  xpProgress: GoalProgress;
}

/**
 * Get comprehensive dashboard data for a user
 */
export async function getDashboardData(userId: string): Promise<DashboardData | null> {
  try {
    const supabase = await createSupabaseServerClient();

    // Fetch user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    // Fetch user preferences
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    // Fetch user statistics
    const { data: statistics } = await supabase
      .from("user_statistics")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!profile) return null;

    // Calculate level and XP based on total practice time
    const totalMinutes =
      ((statistics as unknown as Record<string, unknown>)
        ?.total_practice_time as number) || 0;
    const level = Math.floor(totalMinutes / 60) + 1; // 1 level per hour
    const xp = totalMinutes * 10; // 10 XP per minute

    // Calculate today's practice time
    // TODO: Query sessions for today when sessions table is created
    const todayMinutes = 0;

    // Calculate weekly and monthly practice time
    // TODO: Query sessions for last 7 and 30 days
    const weeklyMinutes = 0;
    const monthlyMinutes = 0;

    const dailyGoalMinutes =
      ((preferences as unknown as Record<string, unknown>)
        ?.daily_goal_minutes as number) || 30;
    const weeklyGoalMinutes = dailyGoalMinutes * 7;
    const monthlyGoalMinutes = dailyGoalMinutes * 30;

    // Mock rank - will be calculated from leaderboard later
    const rank = 1234;

    const profileData = profile as unknown as Record<string, string | null>;
    const statsData = statistics as unknown as Record<string, string | number | null>;

    const dashboardData: DashboardData = {
      displayName:
        (profileData.display_name as string) ||
        (typeof profileData.email === "string"
          ? profileData.email.split("@")[0]
          : null) ||
        "User",
      email: profileData.email as string | null,
      level,
      streak:
        typeof statsData?.current_streak === "number" ? statsData.current_streak : 0,
      todayGoal: {
        current: todayMinutes,
        target: dailyGoalMinutes,
      },
      xp,
      rank,
      stats: {
        avgWpm:
          typeof statsData?.average_wpm === "number"
            ? statsData.average_wpm
            : typeof statsData?.average_wpm === "string"
              ? Number(statsData.average_wpm)
              : 0,
        bestWpm:
          typeof statsData?.best_wpm === "number"
            ? statsData.best_wpm
            : typeof statsData?.best_wpm === "string"
              ? Number(statsData.best_wpm)
              : 0,
        avgAccuracy:
          typeof statsData?.average_accuracy === "number"
            ? statsData.average_accuracy
            : typeof statsData?.average_accuracy === "string"
              ? Number(statsData.average_accuracy)
              : 0,
        typingTime:
          typeof statsData?.total_practice_time === "number"
            ? statsData.total_practice_time
            : 0,
        totalWords:
          typeof statsData?.total_words_typed === "number"
            ? statsData.total_words_typed
            : 0,
        totalCharacters:
          typeof statsData?.total_words_typed === "number"
            ? statsData.total_words_typed * 5
            : 0,
        codingSessions: 0, // TODO: Count from sessions table
        currentLevel: level,
        currentXp: xp,
        currentRank: rank,
        currentStreak:
          typeof statsData?.current_streak === "number" ? statsData.current_streak : 0,
        longestStreak:
          typeof statsData?.longest_streak === "number" ? statsData.longest_streak : 0,
        dailyGoalCompletion:
          dailyGoalMinutes > 0 ? (todayMinutes / dailyGoalMinutes) * 100 : 0,
        weeklyImprovement: 0, // TODO: Calculate from historical data
        monthlyImprovement: 0, // TODO: Calculate from historical data
      },
      activities: [], // TODO: Fetch from sessions/achievements
      heatmapData: generateEmptyHeatmap(), // TODO: Generate from sessions
      dailyGoal: {
        current: todayMinutes,
        target: dailyGoalMinutes,
      },
      weeklyGoal: {
        current: weeklyMinutes,
        target: weeklyGoalMinutes,
      },
      monthlyGoal: {
        current: monthlyMinutes,
        target: monthlyGoalMinutes,
      },
      xpProgress: {
        current: xp % 600, // XP in current level
        target: 600, // XP needed for next level
      },
    };

    return dashboardData;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}

/**
 * Get user statistics
 */
export async function getUserStatistics(userId: string) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("user_statistics")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user statistics:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return null;
  }
}

/**
 * Get user preferences
 */
export async function getUserPreferences(userId: string) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user preferences:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return null;
  }
}

/**
 * Generate empty heatmap for the past year
 */
function generateEmptyHeatmap(): HeatmapDay[] {
  const data: HeatmapDay[] = [];
  const today = new Date();

  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split("T")[0]!,
      count: 0,
      minutes: 0,
    });
  }

  return data;
}

/**
 * Update user statistics after a practice session
 */
export async function updateUserStatistics(
  userId: string,
  updates: Partial<{
    total_practice_time: number;
    total_sessions: number;
    average_wpm: number;
    average_accuracy: number;
    best_wpm: number;
    best_accuracy: number;
    total_words_typed: number;
    total_errors: number;
    current_streak: number;
    longest_streak: number;
    last_practice_date: string;
  }>,
) {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("user_statistics")
      // @ts-ignore - Supabase type inference issue with generic table updates
      .update(updates)
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating user statistics:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating user statistics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update statistics",
    };
  }
}
