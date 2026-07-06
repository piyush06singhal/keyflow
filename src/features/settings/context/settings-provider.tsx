"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  density: "compact" | "comfortable" | "spacious";
  animationIntensity: "none" | "reduced" | "normal";
  accentColor: string;
  fontFamily: string;
  codeFont: string;
}

export interface TypingSettings {
  defaultDuration: number;
  preferredMode: "time" | "words" | "quote";
  soundsEnabled: boolean;
  caretStyle: "block" | "line" | "underline";
  showVirtualKeyboard: boolean;
}

export interface CodingSettings {
  defaultLanguage: string;
  tabWidth: number;
  lineNumbers: boolean;
  minimap: boolean;
  codeTheme: string;
}

export interface UserPreferences {
  appearance: AppearanceSettings;
  typing: TypingSettings;
  coding: CodingSettings;
}

const defaultPreferences: UserPreferences = {
  appearance: {
    theme: "system",
    density: "comfortable",
    animationIntensity: "normal",
    accentColor: "default",
    fontFamily: "inter",
    codeFont: "fira_code",
  },
  typing: {
    defaultDuration: 60,
    preferredMode: "time",
    soundsEnabled: true,
    caretStyle: "block",
    showVirtualKeyboard: false,
  },
  coding: {
    defaultLanguage: "typescript",
    tabWidth: 2,
    lineNumbers: true,
    minimap: false,
    codeTheme: "vs-dark",
  },
};

interface SettingsContextType {
  preferences: UserPreferences;
  isLoading: boolean;
  updateAppearance: (settings: Partial<AppearanceSettings>) => Promise<void>;
  updateTyping: (settings: Partial<TypingSettings>) => Promise<void>;
  updateCoding: (settings: Partial<CodingSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("keyflow_preferences");
      if (local) return JSON.parse(local);
    }
    return defaultPreferences;
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchPreferences = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data && !error) {
        const serverPrefs: UserPreferences = {
          appearance: { ...defaultPreferences.appearance, ...data.appearance_settings },
          typing: { ...defaultPreferences.typing, ...data.typing_settings },
          coding: { ...defaultPreferences.coding, ...data.coding_settings },
        };
        setPreferences(serverPrefs);
        localStorage.setItem("keyflow_preferences", JSON.stringify(serverPrefs));
      } else {
        // Init preferences if not found
        await supabase.from("user_preferences").insert({ user_id: user.id });
      }
    } catch (e) {
      console.error("Failed to fetch preferences", e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPreferences();
  }, [fetchPreferences]);

  const updateSection = async (section: keyof UserPreferences, payload: any) => {
    setPreferences((prev) => {
      const updated = {
        ...prev,
        [section]: { ...prev[section], ...payload },
      };
      localStorage.setItem("keyflow_preferences", JSON.stringify(updated));
      return updated;
    });

    if (user) {
      const supabase = createSupabaseBrowserClient();
      const columnMap = {
        appearance: "appearance_settings",
        typing: "typing_settings",
        coding: "coding_settings",
      };

      const { data: currentData } = await supabase
        .from("user_preferences")
        .select(columnMap[section])
        .eq("user_id", user.id)
        .single();

      const merged = { ...(currentData?.[columnMap[section]] || {}), ...payload };

      await supabase
        .from("user_preferences")
        .update({ [columnMap[section]]: merged })
        .eq("user_id", user.id);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        preferences,
        isLoading,
        updateAppearance: (s) => updateSection("appearance", s),
        updateTyping: (s) => updateSection("typing", s),
        updateCoding: (s) => updateSection("coding", s),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}
