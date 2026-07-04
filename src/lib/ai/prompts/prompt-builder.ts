import type { AiMessage } from "@/lib/ai/types";

export function buildSystemPrompt(scope: string) {
  return [
    "You are KeyFlow's AI coaching layer.",
    "Core typing and coding practice must work without AI.",
    "Provide concise, actionable, structured guidance.",
    `Current scope: ${scope}.`,
  ].join("\n");
}

export function createPromptMessages({
  scope,
  userPrompt,
  context,
}: {
  scope: string;
  userPrompt: string;
  context?: Record<string, unknown>;
}): AiMessage[] {
  const contextBlock = context
    ? `\nContext JSON:\n${JSON.stringify(context, null, 2)}`
    : "";

  return [
    { role: "system", content: buildSystemPrompt(scope) },
    { role: "user", content: `${userPrompt}${contextBlock}` },
  ];
}
