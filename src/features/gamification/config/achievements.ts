export type AchievementRarity =
  "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
export type AchievementCategory =
  | "speed"
  | "accuracy"
  | "consistency"
  | "practice"
  | "streaks"
  | "coding"
  | "community";

export interface AchievementDefinition {
  id: string;
  category: AchievementCategory;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  targetValue: number;
  metric:
    | "wpm"
    | "accuracy"
    | "consistency"
    | "sessions"
    | "words"
    | "streak"
    | "coding_sessions"
    | "languages"
    | "challenges";
  xpReward: number;
}

export interface RarityStyle {
  label: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  glowClass: string;
  celebrationEffect: string;
}

export const RARITY_STYLES: Record<AchievementRarity, RarityStyle> = {
  common: {
    label: "Common",
    textColor: "text-muted-foreground",
    bgColor: "bg-muted/40",
    borderColor: "border-border/40",
    glowClass: "",
    celebrationEffect: "",
  },
  uncommon: {
    label: "Uncommon",
    textColor: "text-emerald-500 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    glowClass: "",
    celebrationEffect: "",
  },
  rare: {
    label: "Rare",
    textColor: "text-blue-500 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    glowClass: "shadow-[0_0_12px_rgba(59,130,246,0.15)]",
    celebrationEffect: "shadow-blue-500/20",
  },
  epic: {
    label: "Epic",
    textColor: "text-purple-500 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    glowClass: "shadow-[0_0_15px_rgba(168,85,247,0.25)] border-purple-500/30",
    celebrationEffect: "shadow-purple-500/30",
  },
  legendary: {
    label: "Legendary",
    textColor: "text-amber-500 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    glowClass:
      "shadow-[0_0_20px_rgba(245,158,11,0.35)] border-amber-500/40 animate-pulse",
    celebrationEffect: "shadow-amber-500/40",
  },
  mythic: {
    label: "Mythic",
    textColor: "text-rose-500 dark:text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    glowClass:
      "shadow-[0_0_25px_rgba(244,63,94,0.45)] border-rose-500/50 animate-bounce-slow",
    celebrationEffect: "shadow-rose-500/50",
  },
};

export const ACHIEVEMENTS_REGISTRY: AchievementDefinition[] = [
  {
    id: "achievement_first_session",
    category: "practice",
    title: "First Steps",
    description: "Complete your first typing or coding session",
    icon: "👶",
    rarity: "common",
    targetValue: 1,
    metric: "sessions",
    xpReward: 50,
  },
  {
    id: "achievement_accuracy_95",
    category: "accuracy",
    title: "Precision Typer",
    description: "Achieve 95% or higher accuracy in a session",
    icon: "🎯",
    rarity: "rare",
    targetValue: 95,
    metric: "accuracy",
    xpReward: 200,
  },
  {
    id: "achievement_consistency_95",
    category: "consistency",
    title: "Steady as a Rock",
    description: "Maintain 95% or higher consistency in a typing session",
    icon: "🗿",
    rarity: "rare",
    targetValue: 95,
    metric: "consistency",
    xpReward: 250,
  },
  {
    id: "achievement_streak_7",
    category: "streaks",
    title: "Week Warrior",
    description: "Maintain a 7-day consecutive practice streak",
    icon: "📅",
    rarity: "rare",
    targetValue: 7,
    metric: "streak",
    xpReward: 200,
  },
  {
    id: "achievement_streak_30",
    category: "streaks",
    title: "Month-Long Dedication",
    description: "Maintain a 30-day consecutive practice streak",
    icon: "🔥",
    rarity: "epic",
    targetValue: 30,
    metric: "streak",
    xpReward: 500,
  },
  {
    id: "achievement_speed_80",
    category: "speed",
    title: "Lightning Fingers",
    description: "Reach a typing speed of 80 WPM in a session",
    icon: "🚀",
    rarity: "rare",
    targetValue: 80,
    metric: "wpm",
    xpReward: 300,
  },
  {
    id: "achievement_speed_100",
    category: "speed",
    title: "Speed Demon",
    description: "Reach a typing speed of 100 WPM in a session",
    icon: "⚡",
    rarity: "epic",
    targetValue: 100,
    metric: "wpm",
    xpReward: 500,
  },
  {
    id: "achievement_100_sessions",
    category: "practice",
    title: "Century Club",
    description: "Complete 100 total practice sessions",
    icon: "💯",
    rarity: "epic",
    targetValue: 100,
    metric: "sessions",
    xpReward: 800,
  },
  {
    id: "achievement_10k_words",
    category: "practice",
    title: "Prolific Writer",
    description: "Type 10,000 words in total",
    icon: "📖",
    rarity: "epic",
    targetValue: 10000,
    metric: "words",
    xpReward: 600,
  },
  {
    id: "achievement_100k_words",
    category: "practice",
    title: "Word Master",
    description: "Type 100,000 words in total",
    icon: "📚",
    rarity: "legendary",
    targetValue: 100000,
    metric: "words",
    xpReward: 1500,
  },
  {
    id: "achievement_coding_50",
    category: "coding",
    title: "Code Ninja",
    description: "Complete 50 coding syntax sessions",
    icon: "🥷",
    rarity: "epic",
    targetValue: 50,
    metric: "coding_sessions",
    xpReward: 600,
  },
  {
    id: "achievement_polyglot_5",
    category: "coding",
    title: "Polyglot Master",
    description: "Practice coding snippets in 5 different programming languages",
    icon: "👑",
    rarity: "mythic",
    targetValue: 5,
    metric: "languages",
    xpReward: 2000,
  },
];
