/**
 * Coding Practice Supabase Integration
 * 
 * Database operations for coding practice sessions and snippets.
 */

import { createSupabaseBrowserClient } from "./client";
import type { Database } from "@/types/database";
import type { 
  CodeSnippet, 
  CodingSessionResult,
  ProgrammingLanguage,
  CodingDifficulty,
  CodingCategory,
  Framework,
} from "@/lib/coding-practice/types";

// ============================================================================
// Session Management
// ============================================================================

/**
 * Save coding practice session to database
 */
export async function saveCodingSession(
  userId: string,
  session: CodingSessionResult
): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  try {
    const supabase = createSupabaseBrowserClient();

    const sessionData = {
      user_id: userId,
      
      // Session metadata
      session_id: session.sessionId,
      session_timestamp: new Date(session.timestamp).toISOString(),
      duration: session.duration,
      mode: session.mode,
      completed: session.completed,
      
      // Coding-specific
      language: session.language,
      framework: session.framework,
      category: session.category,
      snippet_id: session.snippetId,
      difficulty: session.codingStats?.accuracy ? 
        (session.codingStats.accuracy > 95 ? "expert" :
         session.codingStats.accuracy > 85 ? "advanced" :
         session.codingStats.accuracy > 70 ? "intermediate" : "beginner") : "beginner",
      
      // Performance metrics
      wpm: session.finalStats.wpm,
      raw_wpm: session.finalStats.rawWpm,
      accuracy: session.finalStats.accuracy,
      consistency: session.consistency,
      
      // Coding statistics
      correct_lines: session.codingStats?.correctLines || 0,
      incorrect_lines: session.codingStats?.incorrectLines || 0,
      total_lines: session.codingStats?.totalLines || 0,
      line_accuracy: session.codingStats?.lineAccuracy || 0,
      bracket_accuracy: session.codingStats?.bracketAccuracy || 0,
      indentation_accuracy: session.codingStats?.indentationAccuracy || 0,
      symbol_accuracy: session.codingStats?.symbolAccuracy || 0,
      
      // Additional data
      mistakes_count: session.mistakes.length,
      text_content: session.textContent,
    };

    const { data, error} = await supabase
      .from("coding_sessions")
      // @ts-expect-error - Table types not properly generated
      .insert([sessionData])
      .select()
      .single() as { data: Database['public']['Tables']['coding_sessions']['Row'] | null; error: any };

    if (error) {
      console.error("Failed to save coding session:", error);
      return { success: false, error: error.message };
    }

    return { success: true, sessionId: data?.id };
  } catch (error) {
    console.error("Error saving coding session:", error);
    return { success: false, error: "Failed to save session" };
  }
}

/**
 * Get user's coding session history
 */
export async function getCodingSessionHistory(
  userId: string,
  options?: {
    language?: ProgrammingLanguage;
    limit?: number;
    offset?: number;
  }
) {
  try {
    const supabase = createSupabaseBrowserClient();

    let query = supabase
      .from("coding_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("session_timestamp", { ascending: false });

    if (options?.language) {
      query = query.eq("language", options.language);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch coding sessions:", error);
      return { success: false, data: [], error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error fetching coding sessions:", error);
    return { success: false, data: [], error: "Failed to fetch sessions" };
  }
}

/**
 * Get coding statistics for a user
 */
export async function getCodingStatistics(userId: string) {
  try {
    const supabase = createSupabaseBrowserClient();

    const { data, error } = await supabase
      .from("coding_sessions")
      .select("*")
      .eq("user_id", userId) as { data: Array<Database['public']['Tables']['coding_sessions']['Row']> | null; error: any };

    if (error || !data) {
      return { success: false, data: null, error: error?.message };
    }

    // Calculate aggregate statistics
    const stats = {
      totalSessions: data.length,
      totalDuration: data.reduce((acc, s) => acc + (s.duration || 0), 0),
      averageWpm: data.reduce((acc, s) => acc + (s.wpm || 0), 0) / data.length,
      averageAccuracy: data.reduce((acc, s) => acc + (s.accuracy || 0), 0) / data.length,
      bestWpm: Math.max(...data.map(s => s.wpm || 0)),
      bestAccuracy: Math.max(...data.map(s => s.accuracy || 0)),
      
      // Language breakdown
      languageStats: data.reduce((acc, s) => {
        const lang = s.language || "unknown";
        if (!acc[lang]) {
          acc[lang] = { count: 0, totalWpm: 0, totalAccuracy: 0 };
        }
        acc[lang].count++;
        acc[lang].totalWpm += s.wpm || 0;
        acc[lang].totalAccuracy += s.accuracy || 0;
        return acc;
      }, {} as Record<string, any>),
      
      // Recent improvement
      recentSessions: data.slice(0, 10),
      oldSessions: data.slice(-10),
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error calculating coding statistics:", error);
    return { success: false, data: null, error: "Failed to calculate statistics" };
  }
}

// ============================================================================
// Snippet Management
// ============================================================================

/**
 * Save custom snippet to database
 */
export async function saveCustomSnippet(
  userId: string,
  snippet: Omit<CodeSnippet, "id">
): Promise<{ success: boolean; snippetId?: string; error?: string }> {
  try {
    const supabase = createSupabaseBrowserClient();

    const snippetData = {
      user_id: userId,
      title: snippet.title,
      description: snippet.description,
      language: snippet.language,
      framework: snippet.framework,
      category: snippet.category,
      difficulty: snippet.difficulty,
      type: snippet.type,
      code: snippet.code,
      tags: snippet.tags,
      metadata: snippet.metadata,
      is_public: false, // Private by default
    };

    const { data, error } = await supabase
      .from("code_snippets")
      // @ts-expect-error - Table types not properly generated
      .insert([snippetData])
      .select()
      .single() as { data: Database['public']['Tables']['code_snippets']['Row'] | null; error: any };

    if (error) {
      console.error("Failed to save snippet:", error);
      return { success: false, error: error.message };
    }

    return { success: true, snippetId: data?.id };
  } catch (error) {
    console.error("Error saving snippet:", error);
    return { success: false, error: "Failed to save snippet" };
  }
}

/**
 * Get user's custom snippets
 */
export async function getUserSnippets(
  userId: string,
  filters?: {
    language?: ProgrammingLanguage;
    difficulty?: CodingDifficulty;
    category?: CodingCategory;
  }
) {
  try {
    const supabase = createSupabaseBrowserClient();

    let query = supabase
      .from("code_snippets")
      .select("*")
      .eq("user_id", userId);

    if (filters?.language) {
      query = query.eq("language", filters.language);
    }

    if (filters?.difficulty) {
      query = query.eq("difficulty", filters.difficulty);
    }

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    const { data, error } = await query as { data: Array<Database['public']['Tables']['code_snippets']['Row']> | null; error: any };

    if (error) {
      console.error("Failed to fetch snippets:", error);
      return { success: false, data: [], error: error.message };
    }

    // Convert to CodeSnippet format
    const snippets: CodeSnippet[] = (data || []).map(s => ({
      id: s.id,
      title: s.title,
      description: s.description || undefined,
      language: s.language as ProgrammingLanguage,
      framework: s.framework as Framework | undefined,
      category: s.category as CodingCategory,
      difficulty: s.difficulty as CodingDifficulty,
      type: s.type as any,
      code: s.code,
      tags: s.tags || [],
      metadata: s.metadata as any,
    }));

    return { success: true, data: snippets };
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return { success: false, data: [], error: "Failed to fetch snippets" };
  }
}

/**
 * Get public/community snippets
 */
export async function getCommunitySnippets(filters?: {
  language?: ProgrammingLanguage;
  difficulty?: CodingDifficulty;
  limit?: number;
}) {
  try {
    const supabase = createSupabaseBrowserClient();

    let query = supabase
      .from("code_snippets")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (filters?.language) {
      query = query.eq("language", filters.language);
    }

    if (filters?.difficulty) {
      query = query.eq("difficulty", filters.difficulty);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query as { data: Array<Database['public']['Tables']['code_snippets']['Row']> | null; error: any };

    if (error) {
      return { success: false, data: [], error: error.message };
    }

    const snippets: CodeSnippet[] = (data || []).map(s => ({
      id: s.id,
      title: s.title,
      description: s.description || undefined,
      language: s.language as ProgrammingLanguage,
      framework: s.framework as Framework | undefined,
      category: s.category as CodingCategory,
      difficulty: s.difficulty as CodingDifficulty,
      type: s.type as any,
      code: s.code,
      tags: s.tags || [],
      metadata: s.metadata as any,
    }));

    return { success: true, data: snippets };
  } catch (error) {
    return { success: false, data: [], error: "Failed to fetch community snippets" };
  }
}

/**
 * Save AI-generated snippet for reuse
 */
export async function saveAiSnippet(
  userId: string,
  snippet: CodeSnippet,
  aiMetadata?: {
    model: string;
    prompt: string;
    generationTime: number;
  }
) {
  try {
    const supabase = createSupabaseBrowserClient();

    const snippetData = {
      user_id: userId,
      title: snippet.title,
      description: snippet.description,
      language: snippet.language,
      framework: snippet.framework,
      category: snippet.category,
      difficulty: snippet.difficulty,
      type: snippet.type,
      code: snippet.code,
      tags: snippet.tags,
      metadata: {
        ...snippet.metadata,
        aiGenerated: true,
        aiModel: aiMetadata?.model,
        aiPrompt: aiMetadata?.prompt,
        generationTime: aiMetadata?.generationTime,
      },
      is_public: false,
      is_ai_generated: true,
    };

    const { data, error } = await supabase
      .from("code_snippets")
      // @ts-expect-error - Table types not properly generated
      .insert([snippetData])
      .select()
      .single() as { data: Database['public']['Tables']['code_snippets']['Row'] | null; error: any };

    if (error) {
      console.error("Failed to save AI snippet:", error);
      return { success: false, error: error.message };
    }

    return { success: true, snippetId: data?.id };
  } catch (error) {
    console.error("Error saving AI snippet:", error);
    return { success: false, error: "Failed to save snippet" };
  }
}
