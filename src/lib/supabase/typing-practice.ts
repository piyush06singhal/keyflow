import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { SessionResult } from "@/lib/typing-engine";
import type { Database, Json } from "@/types/database";

/**
 * Typing Practice Supabase Service
 *
 * Handles database operations for typing practice sessions and preferences.
 * Provides real-time synchronization and persistence.
 */

type TypingSession = Database["public"]["Tables"]["typing_sessions"]["Insert"];
type TypingSessionRow = Database["public"]["Tables"]["typing_sessions"]["Row"];
type UserStatisticsRow = Database["public"]["Tables"]["user_statistics"]["Row"];
type UserStatisticsUpdate = Database["public"]["Tables"]["user_statistics"]["Update"];
type PracticePreferencesRow =
  Database["public"]["Tables"]["practice_preferences"]["Row"];
type PracticePreferencesUpdate =
  Database["public"]["Tables"]["practice_preferences"]["Update"];
type PracticePreferencesInsert =
  Database["public"]["Tables"]["practice_preferences"]["Insert"];

/**
 * Save a completed typing session to the database
 */
export async function saveTypingSession(
  userId: string,
  sessionResult: SessionResult,
  practiceMode: string,
): Promise<{ data: TypingSessionRow | null; error: Error | null }> {
  try {
    const supabase = createSupabaseBrowserClient();

    const sessionData: TypingSession = {
      user_id: userId,
      practice_mode: practiceMode,
      duration: sessionResult.duration,
      final_wpm: sessionResult.finalWpm,
      final_accuracy: sessionResult.finalAccuracy,
      consistency: sessionResult.consistency,
      peak_wpm: sessionResult.peakWpm,
      average_wpm: sessionResult.averageWpm,
      raw_wpm: sessionResult.averageWpm, // Use averageWpm as raw_wpm fallback
      correct_chars: sessionResult.finalStats.correctChars,
      incorrect_chars: sessionResult.finalStats.incorrectChars,
      total_chars: sessionResult.finalStats.totalChars,
      mistakes: sessionResult.mistakes as unknown as Json,
      character_stats: Object.fromEntries(
        sessionResult.characterStats,
      ) as unknown as Json,
      word_stats: sessionResult.wordStats as unknown as Json,
      completed_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("typing_sessions")
      .insert(sessionData)
      .select()
      .single();

    if (error) throw error;

    // Update user statistics
    await updateUserStatistics(userId, sessionResult);

    return { data, error: null };
  } catch (error) {
    console.error("Error saving typing session:", error);
    return { data: null, error: error as Error };
  }
}

/**
 * Update user statistics after a session
 */
async function updateUserStatistics(
  userId: string,
  sessionResult: SessionResult,
): Promise<void> {
  try {
    const supabase = createSupabaseBrowserClient();

    // Get current statistics
    const { data: currentStats, error: fetchError } = await supabase
      .from("user_statistics")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError || !currentStats) {
      console.error("User statistics not found:", fetchError);
      return;
    }

    const stats = currentStats as UserStatisticsRow;

    // Calculate new statistics
    const totalSessions = (stats.total_sessions || 0) + 1;
    const newTotalTime = (stats.total_practice_time || 0) + sessionResult.duration;

    // Calculate new averages
    const newAvgWpm =
      ((stats.average_wpm || 0) * (totalSessions - 1)) / totalSessions +
      sessionResult.finalWpm / totalSessions;

    const newAvgAccuracy =
      ((stats.average_accuracy || 0) * (totalSessions - 1)) / totalSessions +
      sessionResult.finalAccuracy / totalSessions;

    // Check for personal bests
    const bestWpm = Math.max(stats.best_wpm || 0, sessionResult.finalWpm);

    const bestAccuracy = Math.max(
      stats.best_accuracy || 0,
      sessionResult.finalAccuracy,
    );

    // Calculate streak
    const today = new Date().toISOString().split("T")[0];
    const lastPracticeDate = stats.last_practice_date?.toString().split("T")[0];

    let currentStreak = stats.current_streak || 0;
    if (lastPracticeDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastPracticeDate === yesterdayStr) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    }

    const longestStreak = Math.max(stats.longest_streak || 0, currentStreak);

    // Update statistics
    const updateData: UserStatisticsUpdate = {
      total_practice_time: newTotalTime,
      total_sessions: totalSessions,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_practice_date: new Date().toISOString(),
      average_wpm: newAvgWpm,
      average_accuracy: newAvgAccuracy,
      best_wpm: bestWpm,
      best_accuracy: bestAccuracy,
      total_words_typed:
        (stats.total_words_typed || 0) + sessionResult.finalStats.completedWords,
      total_errors: (stats.total_errors || 0) + sessionResult.finalStats.incorrectChars,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from("user_statistics")
      .update(updateData)
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error updating user statistics:", updateError);
    }
  } catch (error) {
    console.error("Error updating user statistics:", error);
  }
}

/**
 * Get user's typing sessions with pagination
 */
export async function getTypingSessions(
  userId: string,
  options: { limit?: number; offset?: number } = {},
): Promise<{ data: TypingSessionRow[] | null; error: Error | null }> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { limit = 50, offset = 0 } = options;

    const { data, error } = await supabase
      .from("typing_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching typing sessions:", error);
    return { data: null, error: error as Error };
  }
}

/**
 * Get user's practice preferences
 */
export async function getPracticePreferences(
  userId: string,
): Promise<{ data: PracticePreferencesRow | null; error: Error | null }> {
  try {
    const supabase = createSupabaseBrowserClient();

    const { data, error } = await supabase
      .from("practice_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching practice preferences:", error);
    return { data: null, error: error as Error };
  }
}

/**
 * Save user's practice preferences
 */
export async function savePracticePreferences(
  userId: string,
  preferences: Partial<PracticePreferencesUpdate>,
): Promise<{ data: PracticePreferencesRow | null; error: Error | null }> {
  try {
    const supabase = createSupabaseBrowserClient();

    // Try to update first
    const { data: existing } = await supabase
      .from("practice_preferences")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (existing) {
      // Update existing preferences
      const updateData: PracticePreferencesUpdate = {
        ...preferences,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("practice_preferences")
        .update(updateData)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } else {
      // Insert new preferences
      const insertData: PracticePreferencesInsert = {
        user_id: userId,
        ...preferences,
      };

      const { data, error } = await supabase
        .from("practice_preferences")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    }
  } catch (error) {
    console.error("Error saving practice preferences:", error);
    return { data: null, error: error as Error };
  }
}

/**
 * Subscribe to practice preference changes (real-time)
 */
export function subscribeToPracticePreferences(
  userId: string,
  callback: (preferences: PracticePreferencesRow) => void,
) {
  const supabase = createSupabaseBrowserClient();

  const channel = supabase
    .channel(`practice_preferences:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "practice_preferences",
        filter: `user_id=eq.${userId}`,
      },
      (payload: any) => {
        if (payload.new) {
          callback(payload.new as PracticePreferencesRow);
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Get recent session statistics
 */
export async function getRecentSessionStats(
  userId: string,
  days: number = 7,
): Promise<{
  data: {
    avgWpm: number;
    avgAccuracy: number;
    totalSessions: number;
    totalTime: number;
    improvement: number;
  } | null;
  error: Error | null;
}> {
  try {
    const supabase = createSupabaseBrowserClient();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("typing_sessions")
      .select("final_wpm, final_accuracy, duration, completed_at")
      .eq("user_id", userId)
      .gte("completed_at", startDate.toISOString())
      .order("completed_at", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        data: {
          avgWpm: 0,
          avgAccuracy: 0,
          totalSessions: 0,
          totalTime: 0,
          improvement: 0,
        },
        error: null,
      };
    }

    const avgWpm =
      data.reduce(
        (sum: number, session: TypingSessionRow) => sum + session.final_wpm,
        0,
      ) / data.length;
    const avgAccuracy =
      data.reduce(
        (sum: number, session: TypingSessionRow) => sum + session.final_accuracy,
        0,
      ) / data.length;
    const totalTime = data.reduce(
      (sum: number, session: TypingSessionRow) => sum + session.duration,
      0,
    );

    // Calculate improvement (compare first half vs second half)
    const halfPoint = Math.floor(data.length / 2);
    const recentAvg =
      data
        .slice(0, halfPoint)
        .reduce((sum: number, s: TypingSessionRow) => sum + s.final_wpm, 0) / halfPoint;
    const olderAvg =
      data
        .slice(halfPoint)
        .reduce((sum: number, s: TypingSessionRow) => sum + s.final_wpm, 0) /
      (data.length - halfPoint);
    const improvement = recentAvg - olderAvg;

    return {
      data: {
        avgWpm,
        avgAccuracy,
        totalSessions: data.length,
        totalTime,
        improvement,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching recent session stats:", error);
    return { data: null, error: error as Error };
  }
}
