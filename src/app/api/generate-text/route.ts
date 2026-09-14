import { NextResponse } from "next/server";
import { generateAiText } from "@/lib/ai/ai-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mode, topic, difficulty, duration, wordCount } = body;

    const systemPrompt =
      "You are a professional typing practice instructor. Generate highly engaging, realistic, and clean text for typing practice.";
    let userPrompt = "";

    if (mode === "quote") {
      userPrompt = `Generate a single inspiring, profound, or educational quote about ${topic || "life, technology, or success"}.
The quote should be 1 to 3 sentences long (about 20-50 words), suitable for a ${difficulty || "intermediate"} level typist.
Do NOT include any introduction, explanations, or quotes around the response. Return ONLY the text of the quote itself.`;
    } else if (mode === "word") {
      // Enough words that a countdown session never runs out, capped to keep the prompt/response reasonable
      const targetCount = duration
        ? Math.min(Math.max(Math.ceil((duration / 60) * 80 * 2), 150), 300)
        : Math.min(Math.max(Number(wordCount) || 50, 20), 300);
      userPrompt = `Generate a list of exactly ${targetCount} individual English words for a ${difficulty || "intermediate"} level typing test, drawn from the topic of ${topic || "general everyday vocabulary"}.
Return ONLY the words separated by single spaces, all lowercase, no punctuation, no numbering, no line breaks, and avoid repeating the same word too often.`;
    } else {
      // paragraph mode
      const targetLength = duration ? Math.ceil((duration / 60) * 80) : 100; // Average 80 WPM
      userPrompt = `Generate a professional, cohesive paragraph about ${topic || "science, nature, software design, philosophy, or literature"}.
It should be suitable for a ${difficulty || "intermediate"} level typist.
Target length: approximately ${targetLength} words.
Do NOT include any title, introduction, or formatting. Return ONLY the raw paragraph text.`;
    }

    const result = await generateAiText(
      {
        kind: "lesson_generation",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        // Kept under the free tier's ~1000 output-tokens-per-minute cap for
        // on-demand models — 1000 made typing generation rate-limit (429) the
        // moment quota was tight, same as coding snippet generation did.
        maxOutputTokens: 700,
      },
      {
        provider: "groq",
      },
    );

    const text = result.text.trim();
    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error("Error generating typing text:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate text",
      },
      { status: 500 },
    );
  }
}
