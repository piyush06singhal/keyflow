/**
 * Configuration Manager
 *
 * Manages typing engine configuration with validation and defaults.
 */

import type { TypingEngineConfig } from "../types";
import { TypingEngineError } from "../types";

export const DEFAULT_CONFIG: TypingEngineConfig = {
  // Mode settings
  mode: "word",
  timerMode: "countdown",
  duration: 60,

  // Content settings
  language: "english",
  includePunctuation: false,
  includeNumbers: false,
  includeCapitalization: false,
  wordCount: 50,

  // Difficulty settings
  difficulty: "intermediate",

  // Feature flags
  allowBackspace: true,
  blindMode: false,
  strictMode: false,

  // Accessibility
  soundEnabled: false,
};

export class ConfigManager {
  private config: TypingEngineConfig;

  constructor(initialConfig?: Partial<TypingEngineConfig>) {
    this.config = this.mergeWithDefaults(initialConfig);
    this.validate();
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<TypingEngineConfig> {
    return { ...this.config };
  }

  /**
   * Update configuration (partial update)
   */
  updateConfig(updates: Partial<TypingEngineConfig>): void {
    this.config = { ...this.config, ...updates };
    this.validate();
  }

  /**
   * Reset to default configuration
   */
  reset(): void {
    this.config = { ...DEFAULT_CONFIG };
  }

  /**
   * Get a specific config value
   */
  get<K extends keyof TypingEngineConfig>(key: K): TypingEngineConfig[K] {
    return this.config[key];
  }

  /**
   * Set a specific config value
   */
  set<K extends keyof TypingEngineConfig>(key: K, value: TypingEngineConfig[K]): void {
    this.config[key] = value;
    this.validate();
  }

  /**
   * Merge user config with defaults
   */
  private mergeWithDefaults(
    userConfig?: Partial<TypingEngineConfig>,
  ): TypingEngineConfig {
    return {
      ...DEFAULT_CONFIG,
      ...userConfig,
    };
  }

  /**
   * Validate configuration
   */
  private validate(): void {
    // Validate duration for countdown mode
    if (this.config.timerMode === "countdown") {
      if (!this.config.duration || this.config.duration <= 0) {
        throw new TypingEngineError(
          "Duration must be positive for countdown mode",
          "INVALID_DURATION",
        );
      }
    }

    // Validate word count
    if (this.config.wordCount !== undefined && this.config.wordCount <= 0) {
      throw new TypingEngineError("Word count must be positive", "INVALID_WORD_COUNT");
    }

    // Validate custom text
    if (this.config.mode === "custom" && !this.config.customText) {
      throw new TypingEngineError(
        "Custom text is required for custom mode",
        "MISSING_CUSTOM_TEXT",
      );
    }

    // Validate custom words
    if (
      this.config.customWords &&
      (!Array.isArray(this.config.customWords) || this.config.customWords.length === 0)
    ) {
      throw new TypingEngineError(
        "Custom words must be a non-empty array",
        "INVALID_CUSTOM_WORDS",
      );
    }

    // Validate multiplayer session ID
    if (this.config.mode === "multiplayer" && !this.config.multiplayerSessionId) {
      throw new TypingEngineError(
        "Multiplayer session ID is required for multiplayer mode",
        "MISSING_MULTIPLAYER_ID",
      );
    }
  }

  /**
   * Create a configuration snapshot
   */
  toJSON(): TypingEngineConfig {
    return { ...this.config };
  }

  /**
   * Restore configuration from a snapshot
   */
  fromJSON(json: TypingEngineConfig): void {
    this.config = { ...json };
    this.validate();
  }
}
