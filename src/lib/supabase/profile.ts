"use server";

import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { OnboardingInput } from "@/lib/validations/auth";

export type ProfileResult =
  { success: true; data?: unknown } | { success: false; error: string };

/**
 * Initialize user profile after registration
 */
export async function initializeUserProfile(user: User): Promise<ProfileResult> {
  try {
    const supabase = await createSupabaseServerClient();

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (existingProfile) {
      return { success: true, data: existingProfile };
    }

    // Create new profile with default values
    const { data: profile, error } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email ?? null,
        display_name: user.user_metadata?.display_name ?? null,
        username: user.user_metadata?.username ?? null,
        avatar_url: user.user_metadata?.avatar_url ?? null,
        preferred_language: "en",
        onboarding_completed: false,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: profile };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to initialize profile",
    };
  }
}

/**
 * Complete onboarding and update profile
 */
export async function completeOnboarding(
  userId: string,
  data: OnboardingInput,
): Promise<ProfileResult> {
  try {
    const supabase = await createSupabaseServerClient();

    // Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      // @ts-ignore - Supabase type inference issue with Database generic
      .update({
        display_name: data.displayName,
        username: data.username ?? null,
        country: data.country ?? null,
        preferred_language: data.preferredLanguage,
        onboarding_completed: true,
      })
      .eq("id", userId);

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // Initialize user preferences
    const { error: preferencesError } = await supabase.from("user_preferences").upsert({
      user_id: userId,
      theme: data.preferredTheme,
      keyboard_layout: data.keyboardLayout,
      daily_goal_minutes: data.dailyGoal,
      ai_enabled: data.aiEnabled,
      typing_experience: data.typingExperience,
      programming_experience: data.programmingExperience,
    });

    if (preferencesError) {
      return { success: false, error: preferencesError.message };
    }

    // Initialize user statistics
    const { error: statsError } = await supabase.from("user_statistics").upsert({
      user_id: userId,
      total_practice_time: 0,
      total_sessions: 0,
      current_streak: 0,
      longest_streak: 0,
      last_practice_date: null,
      total_words_typed: 0,
      total_errors: 0,
    });

    if (statsError) {
      return { success: false, error: statsError.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to complete onboarding",
    };
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", userId)
      .single();

    return data?.onboarding_completed ?? false;
  } catch {
    return false;
  }
}

/**
 * Update user avatar
 */
export async function updateUserAvatar(
  userId: string,
  avatarUrl: string,
): Promise<ProfileResult> {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("profiles")
      // @ts-ignore - Supabase type inference issue with Database generic
      .update({
        avatar_url: avatarUrl,
      })
      .eq("id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update avatar",
    };
  }
}

/**
 * Upload avatar to Supabase Storage
 */
export async function uploadAvatar(userId: string, file: File): Promise<ProfileResult> {
  try {
    const supabase = await createSupabaseServerClient();

    // Create unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from("user-uploads")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("user-uploads").getPublicUrl(filePath);

    // Update profile with new avatar URL
    const result = await updateUserAvatar(userId, publicUrl);

    if (!result.success) {
      return result;
    }

    return { success: true, data: publicUrl };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload avatar",
    };
  }
}

/**
 * Delete user avatar
 */
export async function deleteUserAvatar(userId: string): Promise<ProfileResult> {
  try {
    const supabase = await createSupabaseServerClient();

    // Get current avatar URL
    const profile = await getUserProfile(userId);

    if (!profile?.avatar_url) {
      return { success: true };
    }

    // Extract file path from URL
    const url = new URL(profile.avatar_url);
    const filePath = url.pathname.split("/").slice(-2).join("/");

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from("user-uploads")
      .remove([filePath]);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // Update profile to remove avatar URL
    const result = await updateUserAvatar(userId, "");

    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete avatar",
    };
  }
}
