import { NextResponse } from "next/server";
import { generateAiCodeSnippet } from "@/lib/coding-practice/ai-snippet-generator";
import type {
  ProgrammingLanguage,
  CodingDifficulty,
  CodingCategory,
  Framework,
} from "@/lib/coding-practice/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { language, difficulty, category, framework } = body;

    const snippet = await generateAiCodeSnippet({
      language: (language || "javascript") as ProgrammingLanguage,
      difficulty: (difficulty || "beginner") as CodingDifficulty,
      category: category as CodingCategory | undefined,
      framework: framework as Framework | undefined,
    });

    return NextResponse.json({ success: true, data: snippet });
  } catch (error) {
    console.error("Error generating code snippet:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate snippet",
      },
      { status: 500 },
    );
  }
}
