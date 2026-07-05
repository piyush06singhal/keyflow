/**
 * AI Coach Service
 * 
 * Main service orchestrating AI-powered coaching features including
 * practice recommendations, performance analysis, lesson generation,
 * and goal recommendations.
 */

import { generateAiText } from "@/lib/ai/ai-service";
import type {
  AiGenerateTextInput,
  AiRequestKind,
} from "@/lib/ai/types";
import type {
  SessionAnalysisResult,
  DailyPracticePlan,
  WeeklyProgressReport,
  SmartGoalRecommendation,
  AiInsightData,
  LessonGenerationRequest,
  GeneratedLessonContent,
  AiGenerationOptions,
} from "../types";
import type { UserDataAggregate } from "./data-aggregation.service";

export class AiCoachService {
  /**
   * Analyze a completed practice session
   */
  async analyzeSession(
    sessionData: {
      sessionId: string;
      wpm: number;
      accuracy: number;
      consistency: number;
      mistakes: unknown[];
      duration: number;
      mode: string;
    },
    userData: UserDataAggregate,
    options?: AiGenerationOptions,
  ): Promise<SessionAnalysisResult> {
    const prompt = this.buildSessionAnalysisPrompt(sessionData, userData);

    const input: AiGenerateTextInput = {
      kind: "typing_session_analysis" as AiRequestKind,
      messages: [
        {
          role: "system",
          content: `You are an expert typing coach analyzing a practice session. Provide actionable, encouraging feedback focused on improvement. Always be specific and constructive.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 1000,
    };

    const result = await generateAiText(input, {
      provider: options?.provider,
      retry: true,
    });

    return this.parseSessionAnalysis(result.text, sessionData);
  }

  /**
   * Generate daily practice recommendations
   */
  async generateDailyPracticePlan(
    userData: UserDataAggregate,
    options?: AiGenerationOptions,
  ): Promise<DailyPracticePlan> {
    const prompt = this.buildDailyPlanPrompt(userData);

    const input: AiGenerateTextInput = {
      kind: "practice_plan" as AiRequestKind,
      messages: [
        {
          role: "system",
          content: `You are a personalized typing and coding coach creating a daily practice plan. Focus on the user's weak areas while building on their strengths. Be specific, practical, and motivating.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options?.temperature ?? 0.8,
      maxOutputTokens: options?.maxTokens ?? 1500,
    };

    const result = await generateAiText(input, {
      provider: options?.provider,
      retry: true,
    });

    return this.parseDailyPracticePlan(result.text);
  }

  /**
   * Generate weekly progress report
   */
  async generateWeeklyReport(
    userData: UserDataAggregate,
    weekData: {
      weekStart: Date;
      weekEnd: Date;
    },
    options?: AiGenerationOptions,
  ): Promise<WeeklyProgressReport> {
    const prompt = this.buildWeeklyReportPrompt(userData, weekData);

    const input: AiGenerateTextInput = {
      kind: "progress_summary" as AiRequestKind,
      messages: [
        {
          role: "system",
          content: `You are an insightful typing coach creating a weekly progress summary. Celebrate achievements, identify patterns, and provide actionable advice for the coming week. Be encouraging but honest.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 2000,
    };

    const result = await generateAiText(input, {
      provider: options?.provider,
      retry: true,
    });

    return this.parseWeeklyReport(result.text, weekData);
  }

  /**
   * Generate smart goal recommendations
   */
  async generateGoalRecommendations(
    userData: UserDataAggregate,
    count: number = 3,
    options?: AiGenerationOptions,
  ): Promise<SmartGoalRecommendation[]> {
    const prompt = this.buildGoalRecommendationsPrompt(userData, count);

    const input: AiGenerateTextInput = {
      kind: "practice_plan" as AiRequestKind,
      messages: [
        {
          role: "system",
          content: `You are an expert coach recommending achievable, motivating goals. Goals should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound) and personalized to the user's current skill level.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 1500,
    };

    const result = await generateAiText(input, {
      provider: options?.provider,
      retry: true,
    });

    return this.parseGoalRecommendations(result.text);
  }

  /**
   * Generate personalized coding lesson
   */
  async generateLesson(
    request: LessonGenerationRequest,
    userData: UserDataAggregate,
    options?: AiGenerationOptions,
  ): Promise<GeneratedLessonContent> {
    const prompt = this.buildLessonGenerationPrompt(request, userData);

    const input: AiGenerateTextInput = {
      kind: "lesson_generation" as AiRequestKind,
      messages: [
        {
          role: "system",
          content: `You are an expert programming instructor creating practice exercises. Generate clean, well-structured code that targets specific learning objectives. Include clear instructions and expected outcomes.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options?.temperature ?? 0.8,
      maxOutputTokens: options?.maxTokens ?? 2000,
    };

    const result = await generateAiText(input, {
      provider: options?.provider,
      retry: true,
    });

    return this.parseLessonContent(result.text, request);
  }

  /**
   * Generate AI insights
   */
  async generateInsights(
    userData: UserDataAggregate,
    options?: AiGenerationOptions,
  ): Promise<AiInsightData[]> {
    const prompt = this.buildInsightsPrompt(userData);

    const input: AiGenerateTextInput = {
      kind: "typing_session_analysis" as AiRequestKind,
      messages: [
        {
          role: "system",
          content: `You are an analytical coach identifying patterns and opportunities. Provide 3-5 specific, actionable insights based on the user's practice data.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 1000,
    };

    const result = await generateAiText(input, {
      provider: options?.provider,
      retry: true,
    });

    return this.parseInsights(result.text);
  }

  // ========================================================================
  // Prompt Builders
  // ========================================================================

  private buildSessionAnalysisPrompt(
    sessionData: {
      wpm: number;
      accuracy: number;
      consistency: number;
      mistakes: unknown[];
      duration: number;
      mode: string;
    },
    userData: UserDataAggregate,
  ): string {
    return `Analyze this typing session and provide personalized feedback:

SESSION DATA:
- WPM: ${sessionData.wpm}
- Accuracy: ${sessionData.accuracy}%
- Consistency: ${sessionData.consistency}%
- Duration: ${sessionData.duration}s
- Mode: ${sessionData.mode}
- Mistakes: ${sessionData.mistakes.length}

USER CONTEXT:
- Average WPM: ${userData.statistics.averageWpm}
- Average Accuracy: ${userData.statistics.averageAccuracy}%
- Total Sessions: ${userData.statistics.totalSessions}
- Experience Level: ${userData.preferences.typingExperience}

${userData.typingAnalysis ? `HISTORICAL TRENDS:
- WPM Trend: ${userData.typingAnalysis.wpmTrend}
- Accuracy Trend: ${userData.typingAnalysis.accuracyTrend}
- Weak Keys: ${userData.typingAnalysis.weakKeys.slice(0, 5).map((k) => k.key).join(", ")}
` : ""}

Provide:
1. 2-3 specific strengths from this session
2. 1-2 areas for improvement
3. Comparison to previous performance
4. 2-3 actionable suggestions for next session

Format your response as JSON with this structure:
{
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1"],
  "improvements": ["improvement1"],
  "suggestions": ["suggestion1", "suggestion2"],
  "comparisonToPrevious": {
    "wpmChange": number,
    "accuracyChange": number,
    "consistencyChange": number
  },
  "nextSteps": ["step1", "step2"]
}`;
  }

  private buildDailyPlanPrompt(userData: UserDataAggregate): string {
    return `Create a personalized daily practice plan:

USER PROFILE:
- Typing Experience: ${userData.preferences.typingExperience}
- Programming Experience: ${userData.preferences.programmingExperience}
- Average WPM: ${userData.statistics.averageWpm}
- Average Accuracy: ${userData.statistics.averageAccuracy}%
- Current Streak: ${userData.statistics.currentStreak} days
- Focus Areas: ${userData.preferences.focusAreas.join(", ") || "None specified"}

${userData.typingAnalysis ? `WEAK AREAS:
${userData.typingAnalysis.weakKeys.slice(0, 5).map((k) => `- ${k.key}: ${k.errorRate.toFixed(1)}% error rate`).join("\n")}
` : ""}

${userData.codingAnalysis ? `CODING STATS:
- Languages: ${Object.keys(userData.codingAnalysis.languageStats).join(", ")}
- Weak Areas: ${userData.codingAnalysis.weakAreas.join(", ")}
` : ""}

RECENT ACTIVITY:
- Sessions last 7 days: ${userData.recentActivity.sessionsLast7Days}
- Sessions last 30 days: ${userData.recentActivity.sessionsLast30Days}

Create a balanced daily plan with:
1. 1-2 typing exercises targeting weak areas
2. 1-2 coding exercises based on their experience level
3. Specific goals for the day
4. A motivational message

Format as JSON:
{
  "date": "YYYY-MM-DD",
  "typingExercises": [
    {
      "title": "Exercise name",
      "description": "What this exercise focuses on",
      "duration": 300,
      "difficulty": "intermediate",
      "focusArea": "weak keys",
      "config": {}
    }
  ],
  "codingExercises": [
    {
      "title": "Exercise name",
      "description": "What this exercise teaches",
      "language": "javascript",
      "difficulty": "intermediate",
      "estimatedTime": 600,
      "focusArea": "syntax"
    }
  ],
  "goals": [
    {
      "title": "Goal name",
      "target": "Target description",
      "progress": 0
    }
  ],
  "motivationalMessage": "Encouraging message"
}`;
  }

  private buildWeeklyReportPrompt(
    userData: UserDataAggregate,
    weekData: { weekStart: Date; weekEnd: Date },
  ): string {
    return `Generate a comprehensive weekly progress report:

WEEK PERIOD: ${weekData.weekStart.toLocaleDateString()} - ${weekData.weekEnd.toLocaleDateString()}

USER STATISTICS:
- Total Sessions This Week: ${userData.recentActivity.sessionsLast7Days}
- Current Average WPM: ${userData.statistics.averageWpm}
- Current Average Accuracy: ${userData.statistics.averageAccuracy}%
- Current Streak: ${userData.statistics.currentStreak} days

${userData.typingAnalysis ? `TYPING ANALYSIS:
- WPM Trend: ${userData.typingAnalysis.wpmTrend}
- Accuracy Trend: ${userData.typingAnalysis.accuracyTrend}
- Peak WPM: ${userData.typingAnalysis.peakWpm}
- Practice Frequency: ${userData.typingAnalysis.practiceFrequency.weekly} sessions/week
` : ""}

${userData.codingAnalysis ? `CODING ANALYSIS:
- Languages Practiced: ${Object.keys(userData.codingAnalysis.languageStats).join(", ")}
- Strong Areas: ${userData.codingAnalysis.strongAreas.join(", ")}
- Areas Needing Work: ${userData.codingAnalysis.weakAreas.join(", ")}
` : ""}

Generate a comprehensive report with JSON structure:
{
  "weekStart": "YYYY-MM-DD",
  "weekEnd": "YYYY-MM-DD",
  "summary": "Overall summary of the week",
  "typingProgress": {
    "averageWpm": number,
    "averageAccuracy": number,
    "wpmChange": number,
    "accuracyChange": number,
    "totalSessions": number,
    "totalTime": number,
    "bestSession": {
      "wpm": number,
      "accuracy": number,
      "date": "YYYY-MM-DD"
    }
  },
  "codingProgress": {
    "totalSessions": number,
    "totalTime": number,
    "languagesPracticed": ["lang1", "lang2"],
    "averageScore": number,
    "scoreChange": number
  },
  "achievements": ["achievement1", "achievement2"],
  "challenges": ["challenge1", "challenge2"],
  "nextWeekGoals": ["goal1", "goal2", "goal3"],
  "insights": ["insight1", "insight2"]
}`;
  }

  private buildGoalRecommendationsPrompt(
    userData: UserDataAggregate,
    count: number,
  ): string {
    return `Recommend ${count} achievable SMART goals:

USER CONTEXT:
- Typing Experience: ${userData.preferences.typingExperience}
- Current WPM: ${userData.statistics.averageWpm}
- Current Accuracy: ${userData.statistics.averageAccuracy}%
- Streak: ${userData.statistics.currentStreak} days
- Total Practice Time: ${Math.round(userData.statistics.totalPracticeTime / 60)} minutes

${userData.typingAnalysis ? `IMPROVEMENT OPPORTUNITIES:
- WPM Trend: ${userData.typingAnalysis.wpmTrend}
- Accuracy Trend: ${userData.typingAnalysis.accuracyTrend}
` : ""}

Create realistic, motivating goals that:
1. Build on current skill level
2. Target specific improvements
3. Are achievable within the timeframe
4. Include clear metrics

Format as JSON array:
[
  {
    "title": "Goal title",
    "description": "Detailed description",
    "category": "typing_speed | typing_accuracy | coding_proficiency | practice_consistency | skill_mastery",
    "type": "daily | weekly | monthly",
    "targetMetric": "Metric name",
    "targetValue": number,
    "currentValue": number,
    "estimatedTimeToComplete": days,
    "difficulty": "easy | moderate | challenging | ambitious",
    "reasoning": "Why this goal makes sense",
    "milestones": [
      {
        "title": "Milestone name",
        "value": number,
        "description": "What this milestone represents"
      }
    ],
    "confidence": 0.85
  }
]`;
  }

  private buildLessonGenerationPrompt(
    request: LessonGenerationRequest,
    userData: UserDataAggregate,
  ): string {
    return `Generate a ${request.difficulty} coding practice lesson:

REQUIREMENTS:
- Lesson Type: ${request.lessonType}
- Difficulty: ${request.difficulty}
- Target Skills: ${request.targetSkills.join(", ")}
${request.targetWeaknesses ? `- Address Weaknesses: ${request.targetWeaknesses.join(", ")}` : ""}
${request.language ? `- Language: ${request.language}` : ""}
${request.framework ? `- Framework: ${request.framework}` : ""}
${request.duration ? `- Target Duration: ${request.duration} seconds` : ""}
${request.customPrompt ? `- Custom Instructions: ${request.customPrompt}` : ""}

USER CONTEXT:
- Programming Experience: ${userData.preferences.programmingExperience}
${userData.codingAnalysis ? `- Familiar Languages: ${Object.keys(userData.codingAnalysis.languageStats).join(", ")}` : ""}

Generate a focused, practical lesson with:
1. Clear title and description
2. Clean, well-commented code
3. Step-by-step instructions
4. Expected learning outcomes

Format as JSON:
{
  "title": "Lesson title",
  "description": "What this lesson teaches",
  "content": "Complete code content here",
  "instructions": ["step1", "step2", "step3"],
  "expectedOutcomes": ["outcome1", "outcome2"],
  "practiceConfig": {
    "showLineNumbers": true,
    "strictMode": false
  },
  "estimatedDuration": 600
}`;
  }

  private buildInsightsPrompt(userData: UserDataAggregate): string {
    return `Analyze user data and generate 3-5 actionable insights:

USER PROFILE:
- Total Sessions: ${userData.statistics.totalSessions}
- Practice Time: ${Math.round(userData.statistics.totalPracticeTime / 60)} minutes
- Current Streak: ${userData.statistics.currentStreak} days
- Average WPM: ${userData.statistics.averageWpm}
- Average Accuracy: ${userData.statistics.averageAccuracy}%

${userData.typingAnalysis ? `TYPING PATTERNS:
- WPM Trend: ${userData.typingAnalysis.wpmTrend}
- Accuracy Trend: ${userData.typingAnalysis.accuracyTrend}
- Consistency: ${userData.typingAnalysis.consistency}%
- Practice Frequency: ${userData.typingAnalysis.practiceFrequency.weekly} sessions/week
` : ""}

${userData.codingAnalysis ? `CODING PATTERNS:
- Strong Areas: ${userData.codingAnalysis.strongAreas.join(", ")}
- Weak Areas: ${userData.codingAnalysis.weakAreas.join(", ")}
` : ""}

Generate insights as JSON array:
[
  {
    "category": "performance | consistency | habits | skills",
    "title": "Insight title",
    "description": "Detailed observation",
    "severity": "info | warning | success | critical",
    "actionable": true,
    "actions": ["action1", "action2"],
    "metadata": {}
  }
]`;
  }

  // ========================================================================
  // Response Parsers
  // ========================================================================

  private parseSessionAnalysis(
    text: string,
    sessionData: { sessionId: string; wpm: number; accuracy: number },
  ): SessionAnalysisResult {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch?.[0]) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          sessionId: sessionData.sessionId,
          score: (sessionData.wpm + sessionData.accuracy) / 2,
          ...parsed,
        };
      }
    } catch {
      // Fallback parsing
    }

    return {
      sessionId: sessionData.sessionId,
      score: (sessionData.wpm + sessionData.accuracy) / 2,
      strengths: ["Session completed successfully"],
      weaknesses: [],
      improvements: [],
      suggestions: ["Keep practicing regularly"],
      comparisonToPrevious: {
        wpmChange: 0,
        accuracyChange: 0,
        consistencyChange: 0,
      },
      nextSteps: ["Continue with daily practice"],
    };
  }

  private parseDailyPracticePlan(text: string): DailyPracticePlan {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch?.[0]) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Fallback
    }

    const fallbackDate = new Date().toISOString().split("T")[0];
    return {
      date: fallbackDate ?? "",
      typingExercises: [],
      codingExercises: [],
      goals: [],
      motivationalMessage: "Keep up the great work!",
    };
  }

  private parseWeeklyReport(
    text: string,
    weekData: { weekStart: Date; weekEnd: Date },
  ): WeeklyProgressReport {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch?.[0]) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Fallback
    }

    const weekStartStr = weekData.weekStart.toISOString().split("T")[0];
    const weekEndStr = weekData.weekEnd.toISOString().split("T")[0];
    
    return {
      weekStart: weekStartStr ?? "",
      weekEnd: weekEndStr ?? "",
      summary: "You practiced consistently this week!",
      typingProgress: {
        averageWpm: 0,
        averageAccuracy: 0,
        wpmChange: 0,
        accuracyChange: 0,
        totalSessions: 0,
        totalTime: 0,
        bestSession: { wpm: 0, accuracy: 0, date: "" },
      },
      codingProgress: {
        totalSessions: 0,
        totalTime: 0,
        languagesPracticed: [],
        averageScore: 0,
        scoreChange: 0,
      },
      achievements: [],
      challenges: [],
      nextWeekGoals: [],
      insights: [],
    };
  }

  private parseGoalRecommendations(text: string): SmartGoalRecommendation[] {
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch?.[0]) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Fallback
    }

    return [];
  }

  private parseLessonContent(
    text: string,
    request: LessonGenerationRequest,
  ): GeneratedLessonContent {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch?.[0]) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Fallback
    }

    return {
      title: "Practice Lesson",
      description: "Custom generated lesson",
      content: "// Practice code here",
      instructions: ["Type the code carefully"],
      expectedOutcomes: ["Improved coding skills"],
      practiceConfig: {},
      estimatedDuration: request.duration ?? 600,
    };
  }

  private parseInsights(text: string): AiInsightData[] {
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch?.[0]) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Fallback
    }

    return [];
  }
}
