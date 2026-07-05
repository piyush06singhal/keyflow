import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./use-auth";
import {
  getPracticePreferences,
  savePracticePreferences,
  subscribeToPracticePreferences,
} from "@/lib/supabase/typing-practice";
import { useTypingPracticeStore } from "@/stores/typing-practice-store";
import type { Database } from "@/types/database";

/**
 * Practice Preferences Hook
 *
 * Synchronizes typing practice preferences with Supabase in real-time.
 * Loads preferences on mount and saves changes automatically.
 */

type PracticePreferences = Database["public"]["Tables"]["practice_preferences"]["Row"];

export function usePracticePreferences() {
  const { user } = useAuth();
  const { config, uiSettings, updateConfig, updateUISettings } = useTypingPracticeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load preferences from Supabase on mount
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadPreferences = async () => {
      try {
        const { data, error } = await getPracticePreferences(user.id);

        if (error || !data) {
          setIsLoading(false);
          return;
        }

        // Update local state with saved preferences
        updateConfig({
          mode: data.practice_mode as any,
          timerMode: data.timer_mode as any,
          duration: data.duration,
          includePunctuation: data.include_punctuation,
          includeNumbers: data.include_numbers,
          includeCapitalization: data.include_capitalization,
          wordCount: data.word_count,
          allowBackspace: data.allow_backspace,
          blindMode: data.blind_mode,
          strictMode: data.strict_mode,
        });

        updateUISettings({
          fontSize: data.font_size as any,
          fontFamily: data.font_family as any,
          cursorStyle: data.cursor_style as any,
          showLiveWpm: data.show_live_wpm,
          showKeyboard: data.show_keyboard,
          keyboardLayout: data.keyboard_layout as any,
          soundEnabled: data.sound_enabled,
          reducedMotion: data.reduced_motion,
          highContrast: data.high_contrast,
        });
      } catch (error) {
        console.error("Error loading practice preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user?.id]);

  // Subscribe to real-time preference changes
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToPracticePreferences(user.id, (preferences) => {
      // Update local state when preferences change from another device/tab
      updateConfig({
        mode: preferences.practice_mode as any,
        timerMode: preferences.timer_mode as any,
        duration: preferences.duration,
        includePunctuation: preferences.include_punctuation,
        includeNumbers: preferences.include_numbers,
        includeCapitalization: preferences.include_capitalization,
        wordCount: preferences.word_count,
        allowBackspace: preferences.allow_backspace,
        blindMode: preferences.blind_mode,
        strictMode: preferences.strict_mode,
      });

      updateUISettings({
        fontSize: preferences.font_size as any,
        fontFamily: preferences.font_family as any,
        cursorStyle: preferences.cursor_style as any,
        showLiveWpm: preferences.show_live_wpm,
        showKeyboard: preferences.show_keyboard,
        keyboardLayout: preferences.keyboard_layout as any,
        soundEnabled: preferences.sound_enabled,
        reducedMotion: preferences.reduced_motion,
        highContrast: preferences.high_contrast,
      });
    });

    return unsubscribe;
  }, [user?.id]);

  // Save preferences to Supabase (debounced)
  const syncPreferences = useCallback(async () => {
    if (!user || isSyncing) return;

    setIsSyncing(true);

    try {
      await savePracticePreferences(user.id, {
        practice_mode: config.mode,
        timer_mode: config.timerMode,
        duration: config.duration,
        include_punctuation: config.includePunctuation,
        include_numbers: config.includeNumbers,
        include_capitalization: config.includeCapitalization,
        word_count: config.wordCount,
        allow_backspace: config.allowBackspace,
        blind_mode: config.blindMode,
        strict_mode: config.strictMode,
        font_size: uiSettings.fontSize,
        font_family: uiSettings.fontFamily,
        cursor_style: uiSettings.cursorStyle,
        show_live_wpm: uiSettings.showLiveWpm,
        show_keyboard: uiSettings.showKeyboard,
        keyboard_layout: uiSettings.keyboardLayout,
        sound_enabled: uiSettings.soundEnabled,
        reduced_motion: uiSettings.reducedMotion,
        high_contrast: uiSettings.highContrast,
      });
    } catch (error) {
      console.error("Error syncing practice preferences:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [user?.id, config, uiSettings, isSyncing]);

  // Auto-sync preferences when they change (debounced)
  useEffect(() => {
    if (isLoading || !user) return;

    const timeoutId = setTimeout(() => {
      syncPreferences();
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [config, uiSettings, isLoading, user?.id]);

  return {
    isLoading,
    isSyncing,
    syncPreferences,
  };
}
