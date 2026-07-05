/**
 * Heatmap Updater Service
 * 
 * Updates practice heatmap data after session completion.
 */

import { createSupabaseBrowserClient } from "./client";
import type { Database } from "@/types/database";

type HeatmapRow = Database["public"]["Tables"]["practice_heatmap"]["Row"];
type HeatmapInsert = Database["public"]["Tables"]["practice_heatmap"]["Insert"];
type HeatmapUpdate = Database["public"]["Tables"]["practice_heatmap"]["Update"];

/**
 * Update heatmap for today's practice
 */
export async function updateHeatmapForSession(
  userId: string,
  durationMs: number
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const supabase = createSupabaseBrowserClient();
    const today = new Date().toISOString().split("T")[0]!;
    const minutes = Math.floor(durationMs / 1000 / 60);

    // Check if entry exists for today
    const { data: existing, error: fetchError } = await supabase
      .from("practice_heatmap")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existing) {
      // Update existing entry
      const typedExisting = existing as HeatmapRow;
      const updateData = {
        sessions: typedExisting.sessions + 1,
        minutes: typedExisting.minutes + minutes,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await (supabase
        .from("practice_heatmap") as any)
        .update(updateData)
        .eq("user_id", userId)
        .eq("date", today);

      if (updateError) throw updateError;
    } else {
      // Create new entry
      const insertData = {
        user_id: userId,
        date: today,
        sessions: 1,
        minutes,
      };

      const { error: insertError } = await (supabase
        .from("practice_heatmap") as any)
        .insert(insertData);

      if (insertError) throw insertError;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating heatmap:", error);
    return { success: false, error: error as Error };
  }
}

/**
 * Get heatmap data for a date range
 */
export async function getHeatmapData(
  userId: string,
  dateFrom: string,
  dateTo: string
) {
  try {
    const supabase = createSupabaseBrowserClient();

    const { data, error } = await supabase
      .from("practice_heatmap")
      .select("*")
      .eq("user_id", userId)
      .gte("date", dateFrom)
      .lte("date", dateTo)
      .order("date", { ascending: true });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    return { data: [], error: error as Error };
  }
}

/**
 * Get heatmap data for the last year
 */
export async function getYearHeatmapData(userId: string) {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const dateFrom = oneYearAgo.toISOString().split("T")[0]!;
  const dateTo = today.toISOString().split("T")[0]!;

  return getHeatmapData(userId, dateFrom, dateTo);
}
