/**
 * Fallback Recommendation Service
 * 
 * Provides rule-based recommendations when AI service is unavailable
 * or rate-limited. Ensures the application remains functional without AI.
 */

import type {
  DailyPracticePlan,
  SmartGoalRecommendation,
  AiInsightData,
  FallbackRecommendation,
  GoalCategory,
  GoalType,
} from "../types";
import type { UserDataAggregate } from "./data-aggregation.service";

export class FallbackRecommendationService {
  /**
   * Generate fallback daily practice plan
   */
  generateDailyPlan(userData: UserDataAggregate): {
    plan: DailyPracticePlan;
    fallback: FallbackRecommendation;
  } {
    const dateStr = new Date().toISOString().split("T")[0];
    const plan: DailyPracticePlan = {
      date: dateStr ?? "",
      typingExercises: this.getFallbackTypingExercises(userData),
      codingExercises: this.getFallbackCodingExercises(userData),
      goals: this.getFallbackDailyGoals(userData),
      motivationalMessage: this.getMotivationalMessage(userData),
    };

    return {
      plan,
      fallback: {
        source: "rule-based",
        confidence: 0.7,
        reasoning:
          "Generated using statistical analysis of your practice history",
      },
    };
  }

  /**
   * Generate fallback goal recommendations
   */
  generateGoalRecommendations(
    userData: UserDataAggregate,
    count: number = 3,
  ): {
    goals: SmartGoalRecommendation[];
    fallback: FallbackRecommendation;
  } {
    const goals: SmartGoalRecommendation[] = [];

    // WPM improvement goal
    if (userData.statistics.averageWpm < 80 && goals.length < count) {
      const targetWpm = Math.ceil(userData.statistics.averageWpm * 1.15);
      goals.push({
        title: `Reach ${targetWpm} WPM`,
        description: `Improve your average typing speed from ${userData.statistics.averageWpm.toFixed(0)} to ${targetWpm} WPM`,
        category: "typing_speed" as GoalCategory,
        type: "monthly" as GoalType,
        targetMetric: "Average WPM",
        targetValue: targetWpm,
        currentValue: userData.statistics.averageWpm,
        estimatedTimeToComplete: 30,
        difficulty: "moderate",
        reasoning:
          "Based on your current progress rate, a 15% improvement is achievable",
        milestones: [
          {
            title: "First milestone",
            value: Math.ceil(userData.statistics.averageWpm * 1.05),
            description: "5% improvement",
          },
          {
            title: "Halfway point",
            value: Math.ceil(userData.statistics.averageWpm * 1.10),
            description: "10% improvement",
          },
        ],
        confidence: 0.75,
      });
    }

    // Accuracy goal
    if (userData.statistics.averageAccuracy < 95 && goals.length < count) {
      const targetAccuracy = Math.min(98, userData.statistics.averageAccuracy + 5);
      goals.push({
        title: `Achieve ${targetAccuracy.toFixed(0)}% Accuracy`,
        description: `Improve typing accuracy from ${userData.statistics.averageAccuracy.toFixed(1)}% to ${targetAccuracy.toFixed(0)}%`,
        category: "typing_accuracy" as GoalCategory,
        type: "weekly" as GoalType,
        targetMetric: "Average Accuracy",
        targetValue: targetAccuracy,
        currentValue: userData.statistics.averageAccuracy,
        estimatedTimeToComplete: 14,
        difficulty: "moderate",
        reasoning:
          "Focus on accuracy will improve overall typing quality",
        milestones: [
          {
            title: "Progress checkpoint",
            value: userData.statistics.averageAccuracy + 2,
            description: "+2% accuracy",
          },
        ],
        confidence: 0.8,
      });
    }

    // Consistency goal
    if (userData.statistics.currentStreak < 7 && goals.length < count) {
      goals.push({
        title: "Build a 7-Day Streak",
        description: "Practice consistently for 7 days in a row",
        category: "practice_consistency" as GoalCategory,
        type: "weekly" as GoalType,
        targetMetric: "Practice Streak",
        targetValue: 7,
        currentValue: userData.statistics.currentStreak,
        estimatedTimeToComplete: 7,
        difficulty: "moderate",
        reasoning:
          "Consistent practice is key to improvement",
        milestones: [
          {
            title: "3-day streak",
            value: 3,
            description: "Build momentum",
          },
          {
            title: "5-day streak",
            value: 5,
            description: "Almost there!",
          },
        ],
        confidence: 0.85,
      });
    }

    return {
      goals: goals.slice(0, count),
      fallback: {
        source: "statistical",
        confidence: 0.75,
        reasoning: "Based on your current statistics and common improvement patterns",
      },
    };
  }

  /**
   * Generate fallback insights
   */
  generateInsights(userData: UserDataAggregate): {
    insights: AiInsightData[];
    fallback: FallbackRecommendation;
  } {
    const insights: AiInsightData[] = [];

    // Streak insight
    if (userData.statistics.currentStreak >= 7) {
      insights.push({
        category: "habits",
        title: "Excellent Practice Consistency",
        description: `You've maintained a ${userData.statistics.currentStreak}-day streak! Consistent practice is the fastest path to improvement.`,
        severity: "success",
        actionable: true,
        actions: ["Keep your streak alive", "Share your progress"],
      });
    } else if (userData.recentActivity.sessionsLast7Days < 3) {
      insights.push({
        category: "habits",
        title: "Practice More Regularly",
        description:
          "You only practiced a few times this week. Regular practice, even 10 minutes daily, yields better results than longer sporadic sessions.",
        severity: "warning",
        actionable: true,
        actions: [
          "Set a daily reminder",
          "Start with shorter sessions",
          "Practice at the same time each day",
        ],
      });
    }

    // Performance insight
    if (
      userData.typingAnalysis &&
      userData.typingAnalysis.wpmTrend === "improving"
    ) {
      insights.push({
        category: "performance",
        title: "Speed Improving",
        description: `Your WPM has been trending upward! Current average: ${userData.statistics.averageWpm.toFixed(0)} WPM.`,
        severity: "success",
        actionable: false,
      });
    } else if (
      userData.typingAnalysis &&
      userData.typingAnalysis.wpmTrend === "declining"
    ) {
      insights.push({
        category: "performance",
        title: "Speed Plateau",
        description:
          "Your WPM has plateaued. This is normal - try varying your practice modes or focusing on accuracy to break through.",
        severity: "info",
        actionable: true,
        actions: [
          "Focus on accuracy for a week",
          "Try different practice modes",
          "Practice with punctuation",
        ],
      });
    }

    // Weak keys insight
    if (
      userData.typingAnalysis &&
      userData.typingAnalysis.weakKeys.length > 0
    ) {
      const topWeakKeys = userData.typingAnalysis.weakKeys
        .slice(0, 3)
        .map((k) => k.key);
      insights.push({
        category: "skills",
        title: "Focus on Specific Keys",
        description: `You frequently mistype: ${topWeakKeys.join(", ")}. Targeted practice on these keys will improve your overall accuracy.`,
        severity: "info",
        actionable: true,
        actions: [
          "Practice these specific keys",
          "Slow down when typing them",
          "Use custom lessons targeting weak keys",
        ],
        metadata: { weakKeys: topWeakKeys },
      });
    }

    // Coding insight
    if (
      userData.codingAnalysis &&
      userData.codingAnalysis.weakAreas.length > 0
    ) {
      insights.push({
        category: "skills",
        title: "Coding Areas to Improve",
        description: `Work on: ${userData.codingAnalysis.weakAreas.join(", ")}`,
        severity: "info",
        actionable: true,
        actions: [
          "Practice specific syntax patterns",
          "Use language-specific drills",
        ],
      });
    }

    return {
      insights: insights.slice(0, 5),
      fallback: {
        source: "rule-based",
        confidence: 0.7,
        reasoning: "Generated from your practice statistics and patterns",
      },
    };
  }

  // ========================================================================
  // Private Helper Methods
  // ========================================================================

  private getFallbackTypingExercises(userData: UserDataAggregate) {
    const exercises = [];
    const experience = userData.preferences.typingExperience;

    // Add weak key exercise if applicable
    if (
      userData.typingAnalysis &&
      userData.typingAnalysis.weakKeys.length > 0
    ) {
      exercises.push({
        title: "Weak Key Practice",
        description: `Focus on your most commonly mistyped keys: ${userData.typingAnalysis.weakKeys.slice(0, 3).map((k) => k.key).join(", ")}`,
        duration: 300,
        difficulty: experience,
        focusArea: "weak keys",
        config: {
          mode: "word",
          timerMode: "countdown",
          duration: 300,
        },
      });
    }

    // Add general practice
    exercises.push({
      title: "Standard Practice",
      description: "Regular typing practice to maintain and improve speed",
      duration: 600,
      difficulty: experience,
      focusArea: "overall improvement",
      config: {
        mode: "word",
        timerMode: "countdown",
        duration: 600,
        includePunctuation: experience !== "beginner",
      },
    });

    return exercises;
  }

  private getFallbackCodingExercises(userData: UserDataAggregate) {
    const exercises = [];
    const progExperience = userData.preferences.programmingExperience;

    if (progExperience === "none") {
      exercises.push({
        title: "Introduction to Code Typing",
        description: "Learn to type basic code syntax",
        language: "javascript",
        difficulty: "beginner",
        estimatedTime: 600,
        focusArea: "basic syntax",
      });
    } else {
      const preferredLang =
        userData.preferences.preferredLanguages[0] ?? "javascript";
      const langDisplay = preferredLang.charAt(0).toUpperCase() + preferredLang.slice(1);
      exercises.push({
        title: `${langDisplay} Practice`,
        description: `Practice typing common ${preferredLang} patterns`,
        language: preferredLang,
        difficulty: progExperience,
        estimatedTime: 600,
        focusArea: "language syntax",
      });
    }

    return exercises;
  }

  private getFallbackDailyGoals(userData: UserDataAggregate) {
    const goals = [];

    // WPM goal
    const targetWpm = Math.ceil(userData.statistics.averageWpm * 1.05);
    goals.push({
      title: "Daily Speed Target",
      target: `Achieve ${targetWpm} WPM in at least one session`,
      progress: 0,
    });

    // Practice goal
    goals.push({
      title: "Practice Session",
      target: "Complete at least one 10-minute practice session",
      progress: 0,
    });

    // Accuracy goal
    if (userData.statistics.averageAccuracy < 95) {
      goals.push({
        title: "Accuracy Focus",
        target: "Maintain 95%+ accuracy in your next session",
        progress: 0,
      });
    }

    return goals;
  }

  private getMotivationalMessage(userData: UserDataAggregate): string {
    const messages = [
      "Every keystroke brings you closer to mastery!",
      "Consistency is the key to improvement. You're on the right track!",
      "Your dedication to practice is inspiring. Keep it up!",
      "Small improvements every day lead to remarkable results!",
      "You're building a valuable skill. Stay focused!",
    ];

    if (userData.statistics.currentStreak >= 7) {
      return `Amazing ${userData.statistics.currentStreak}-day streak! You're unstoppable! 🔥`;
    }

    if (
      userData.typingAnalysis &&
      userData.typingAnalysis.wpmTrend === "improving"
    ) {
      return "Your speed is improving! Keep up the excellent work! 🚀";
    }

    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex] ?? messages[0] ?? "Keep up the great work!";
  }
}
