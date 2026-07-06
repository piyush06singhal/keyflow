/**
 * Data Aggregation Service
 *
 * Aggregates user data from typing sessions, coding sessions, statistics,
 * goals, and preferences for AI analysis.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { TypingAnalysis, CodingAnalysis } from "../types";

export interface UserDataAggregate {
  userId: string;
  typingAnalysis: TypingAnalysis | null;
  codingAnalysis: CodingAnalysis | null;
  statistics: {
    totalSessions: number;
    totalPracticeTime: number;
    currentStreak: number;
    longestStreak: number;
    averageWpm: number;
    averageAccuracy: number;
    bestWpm: number;
    bestAccuracy: number;
  };
  recentActivity: {
    lastPracticeDate: string | null;
    sessionsLast7Days: number;
    sessionsLast30Days: number;
    averageSessionDuration: number;
  };
  preferences: {
    typingExperience: string;
    programmingExperience: string;
    aiEnabled: boolean;
    preferredLanguages: string[];
    focusAreas: string[];
  };
}

export class DataAggregationService {
  constructor(private supabase: SupabaseClient<any>) {}

  /**
   * Aggregate all user data for AI analysis
   */
  async aggregateUserData(
    userId: string,
    timeframe?: { start: Date; end: Date },
  ): Promise<UserDataAggregate> {
    const [typingAnalysis, codingAnalysis, statistics, recentActivity, preferences] =
      await Promise.all([
        this.analyzeTypingSessions(userId, timeframe),
        this.analyzeCodingSessions(userId, timeframe),
        this.getUserStatistics(userId),
        this.getRecentActivity(userId),
        this.getUserPreferences(userId),
      ]);

    return {
      userId,
      typingAnalysis,
      codingAnalysis,
      statistics,
      recentActivity,
      preferences,
    };
  }

  /**
   * Analyze typing sessions
   */
  private async analyzeTypingSessions(
    userId: string,
    timeframe?: { start: Date; end: Date },
  ): Promise<TypingAnalysis | null> {
    let query = this.supabase
      .from("typing_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (timeframe) {
      query = query
        .gte("completed_at", timeframe.start.toISOString())
        .lte("completed_at", timeframe.end.toISOString());
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query = query.gte("completed_at", thirtyDaysAgo.toISOString());
    }

    const { data: sessions, error } = (await query.limit(100)) as {
      data: Array<Database["public"]["Tables"]["typing_sessions"]["Row"]> | null;
      error: Error | null;
    };

    if (error || !sessions || sessions.length === 0) {
      return null;
    }

    // Calculate metrics
    const totalSessions = sessions.length;
    const averageWpm =
      sessions.reduce((sum, s) => sum + s.final_wpm, 0) / totalSessions;
    const averageAccuracy =
      sessions.reduce((sum, s) => sum + s.final_accuracy, 0) / totalSessions;
    const consistency =
      sessions.reduce((sum, s) => sum + s.consistency, 0) / totalSessions;
    const peakWpm = Math.max(...sessions.map((s) => s.peak_wpm));
    const totalPracticeTime = sessions.reduce((sum, s) => sum + s.duration, 0);

    // Calculate trends (comparing first half to second half)
    const midpoint = Math.floor(sessions.length / 2);
    const recentSessions = sessions.slice(0, midpoint);
    const olderSessions = sessions.slice(midpoint);

    const recentAvgWpm =
      recentSessions.reduce((sum, s) => sum + s.final_wpm, 0) / recentSessions.length;
    const olderAvgWpm =
      olderSessions.reduce((sum, s) => sum + s.final_wpm, 0) / olderSessions.length;
    const wpmTrend =
      recentAvgWpm > olderAvgWpm * 1.05
        ? ("improving" as const)
        : recentAvgWpm < olderAvgWpm * 0.95
          ? ("declining" as const)
          : ("stable" as const);

    const recentAvgAccuracy =
      recentSessions.reduce((sum, s) => sum + s.final_accuracy, 0) /
      recentSessions.length;
    const olderAvgAccuracy =
      olderSessions.reduce((sum, s) => sum + s.final_accuracy, 0) /
      olderSessions.length;
    const accuracyTrend =
      recentAvgAccuracy > olderAvgAccuracy + 2
        ? ("improving" as const)
        : recentAvgAccuracy < olderAvgAccuracy - 2
          ? ("declining" as const)
          : ("stable" as const);

    // Analyze mistakes for weak keys
    const keyErrors: Record<string, { count: number; total: number }> = {};
    sessions.forEach((session) => {
      if (session.mistakes && Array.isArray(session.mistakes)) {
        (session.mistakes as Array<{ char?: string }>).forEach((mistake) => {
          const char = mistake.char ?? "unknown";
          if (!keyErrors[char]) {
            keyErrors[char] = { count: 0, total: 0 };
          }
          keyErrors[char]!.count++;
        });
      }
      if (session.character_stats && typeof session.character_stats === "object") {
        const charStats = session.character_stats as Record<string, { count: number }>;
        Object.entries(charStats).forEach(([char, stats]) => {
          if (!keyErrors[char]) {
            keyErrors[char] = { count: 0, total: 0 };
          }
          keyErrors[char]!.total += stats.count;
        });
      }
    });

    const weakKeys = Object.entries(keyErrors)
      .filter(([_, stats]) => stats.total > 0)
      .map(([key, stats]) => ({
        key,
        errorCount: stats.count,
        errorRate: (stats.count / stats.total) * 100,
      }))
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, 10);

    const strongKeys = Object.entries(keyErrors)
      .filter(([_, stats]) => stats.total > 0)
      .map(([key, stats]) => ({
        key,
        accuracy: ((stats.total - stats.count) / stats.total) * 100,
      }))
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 10);

    // Time distribution
    const timeDistribution: Record<string, number> = {};
    sessions.forEach((session) => {
      const hour = new Date(session.completed_at).getHours();
      const timeSlot = `${hour}:00`;
      timeDistribution[timeSlot] = (timeDistribution[timeSlot] ?? 0) + 1;
    });

    // Practice frequency
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const sessionsLastDay = sessions.filter(
      (s) => new Date(s.completed_at) >= oneDayAgo,
    ).length;
    const sessionsLastWeek = sessions.filter(
      (s) => new Date(s.completed_at) >= sevenDaysAgo,
    ).length;
    const sessionsLastMonth = sessions.filter(
      (s) => new Date(s.completed_at) >= thirtyDaysAgo,
    ).length;

    return {
      averageWpm,
      averageAccuracy,
      consistency,
      peakWpm,
      totalSessions,
      totalPracticeTime,
      wpmTrend,
      accuracyTrend,
      weakKeys,
      strongKeys,
      timeDistribution,
      practiceFrequency: {
        daily: sessionsLastDay,
        weekly: sessionsLastWeek,
        monthly: sessionsLastMonth,
      },
    };
  }

  /**
   * Analyze coding sessions
   */
  private async analyzeCodingSessions(
    userId: string,
    timeframe?: { start: Date; end: Date },
  ): Promise<CodingAnalysis | null> {
    let query = this.supabase
      .from("coding_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("session_timestamp", { ascending: false });

    if (timeframe) {
      query = query
        .gte("session_timestamp", timeframe.start.toISOString())
        .lte("session_timestamp", timeframe.end.toISOString());
    } else {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query = query.gte("session_timestamp", thirtyDaysAgo.toISOString());
    }

    const { data: sessions, error } = (await query.limit(100)) as {
      data: Array<Database["public"]["Tables"]["coding_sessions"]["Row"]> | null;
      error: Error | null;
    };

    if (error || !sessions || sessions.length === 0) {
      return null;
    }

    // Language statistics
    const languageStats: Record<
      string,
      {
        sessionsCount: number;
        averageWpm: number;
        averageAccuracy: number;
        averageLineAccuracy: number;
        totalTime: number;
      }
    > = {};

    sessions.forEach((session) => {
      const lang = session.language;
      if (!languageStats[lang]) {
        languageStats[lang] = {
          sessionsCount: 0,
          averageWpm: 0,
          averageAccuracy: 0,
          averageLineAccuracy: 0,
          totalTime: 0,
        };
      }
      const stats = languageStats[lang]!;
      stats.sessionsCount++;
      stats.averageWpm += session.wpm;
      stats.averageAccuracy += session.accuracy;
      stats.averageLineAccuracy += session.line_accuracy;
      stats.totalTime += session.duration;
    });

    Object.keys(languageStats).forEach((lang) => {
      const stats = languageStats[lang];
      if (stats) {
        const count = stats.sessionsCount;
        stats.averageWpm /= count;
        stats.averageAccuracy /= count;
        stats.averageLineAccuracy /= count;
      }
    });

    // Framework statistics
    const frameworkStats: Record<
      string,
      { sessionsCount: number; averageScore: number }
    > = {};

    sessions.forEach((session) => {
      if (session.framework) {
        const fw = session.framework;
        if (!frameworkStats[fw]) {
          frameworkStats[fw] = { sessionsCount: 0, averageScore: 0 };
        }
        const stats = frameworkStats[fw]!;
        stats.sessionsCount++;
        stats.averageScore += session.accuracy;
      }
    });

    Object.keys(frameworkStats).forEach((fw) => {
      const stats = frameworkStats[fw];
      if (stats) {
        stats.averageScore /= stats.sessionsCount;
      }
    });

    // Analyze weak areas based on accuracy metrics
    const weakAreas: string[] = [];
    const strongAreas: string[] = [];

    const avgBracketAccuracy =
      sessions.reduce((sum, s) => sum + (s.bracket_accuracy ?? 0), 0) / sessions.length;
    const avgIndentationAccuracy =
      sessions.reduce((sum, s) => sum + (s.indentation_accuracy ?? 0), 0) /
      sessions.length;
    const avgSymbolAccuracy =
      sessions.reduce((sum, s) => sum + (s.symbol_accuracy ?? 0), 0) / sessions.length;

    if (avgBracketAccuracy < 80) weakAreas.push("Bracket typing");
    else if (avgBracketAccuracy > 90) strongAreas.push("Bracket typing");

    if (avgIndentationAccuracy < 85) weakAreas.push("Code indentation");
    else if (avgIndentationAccuracy > 95) strongAreas.push("Code indentation");

    if (avgSymbolAccuracy < 75) weakAreas.push("Symbol typing");
    else if (avgSymbolAccuracy > 90) strongAreas.push("Symbol typing");

    // Syntax mistakes (placeholder - would need actual mistake data)
    const syntaxMistakes = [
      {
        type: "bracket_mismatch",
        count: sessions.filter((s) => (s.bracket_accuracy ?? 100) < 90).length,
        examples: ["Missing closing bracket", "Incorrect bracket type"],
      },
    ];

    // Difficulty progression
    const difficultyProgression: Record<string, number> = {};
    sessions.forEach((session) => {
      const diff = session.difficulty;
      difficultyProgression[diff] = (difficultyProgression[diff] ?? 0) + 1;
    });

    return {
      languageStats,
      frameworkStats,
      syntaxMistakes,
      weakAreas,
      strongAreas,
      difficultyProgression,
    };
  }

  /**
   * Get user statistics
   */
  private async getUserStatistics(userId: string) {
    const { data, error } = (await this.supabase
      .from("user_statistics")
      .select("*")
      .eq("user_id", userId)
      .single()) as {
      data: Database["public"]["Tables"]["user_statistics"]["Row"] | null;
      error: Error | null;
    };

    if (error || !data) {
      return {
        totalSessions: 0,
        totalPracticeTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageWpm: 0,
        averageAccuracy: 0,
        bestWpm: 0,
        bestAccuracy: 0,
      };
    }

    return {
      totalSessions: data.total_sessions,
      totalPracticeTime: data.total_practice_time,
      currentStreak: data.current_streak,
      longestStreak: data.longest_streak,
      averageWpm: data.average_wpm ?? 0,
      averageAccuracy: data.average_accuracy ?? 0,
      bestWpm: data.best_wpm ?? 0,
      bestAccuracy: data.best_accuracy ?? 0,
    };
  }

  /**
   * Get recent activity metrics
   */
  private async getRecentActivity(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const typingSessions7dPromise = this.supabase
      .from("typing_sessions")
      .select("duration")
      .eq("user_id", userId)
      .gte("completed_at", sevenDaysAgo.toISOString());

    const typingSessions30dPromise = this.supabase
      .from("typing_sessions")
      .select("duration")
      .eq("user_id", userId)
      .gte("completed_at", thirtyDaysAgo.toISOString());

    const statsPromise = this.supabase
      .from("user_statistics")
      .select("last_practice_date")
      .eq("user_id", userId)
      .single();

    const [typingSessions7d, typingSessions30d, stats] = await Promise.all([
      typingSessions7dPromise,
      typingSessions30dPromise,
      statsPromise,
    ]);

    const sessions7d = typingSessions7d.data?.length ?? 0;
    const sessions30d = typingSessions30d.data?.length ?? 0;
    const totalDuration30d =
      typingSessions30d.data?.reduce((sum: number, s: any) => sum + s.duration, 0) ?? 0;
    const averageSessionDuration = sessions30d > 0 ? totalDuration30d / sessions30d : 0;

    return {
      lastPracticeDate: stats.data?.last_practice_date ?? null,
      sessionsLast7Days: sessions7d,
      sessionsLast30Days: sessions30d,
      averageSessionDuration,
    };
  }

  /**
   * Get user preferences
   */
  private async getUserPreferences(userId: string) {
    const userPrefsPromise = this.supabase
      .from("user_preferences")
      .select("typing_experience, programming_experience, ai_enabled")
      .eq("user_id", userId)
      .single();

    const aiPrefsPromise = this.supabase
      .from("ai_user_preferences")
      .select("preferred_languages, focus_areas")
      .eq("user_id", userId)
      .single();

    const [userPrefs, aiPrefs] = (await Promise.all([
      userPrefsPromise,
      aiPrefsPromise,
    ])) as [
      {
        data: {
          typing_experience: string | null;
          programming_experience: string | null;
          ai_enabled: boolean | null;
        } | null;
        error: Error | null;
      },
      {
        data: {
          preferred_languages: string[] | null;
          focus_areas: string[] | null;
        } | null;
        error: Error | null;
      },
    ];

    return {
      typingExperience: userPrefs.data?.typing_experience ?? "beginner",
      programmingExperience: userPrefs.data?.programming_experience ?? "none",
      aiEnabled: userPrefs.data?.ai_enabled ?? true,
      preferredLanguages: aiPrefs.data?.preferred_languages ?? [],
      focusAreas: aiPrefs.data?.focus_areas ?? [],
    };
  }
}
