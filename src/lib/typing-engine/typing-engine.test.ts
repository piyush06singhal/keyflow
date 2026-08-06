import { TypingEngine } from "./typing-engine";

function type(engine: TypingEngine, text: string) {
  for (const char of text) {
    const key = char === "\n" ? "Enter" : char;
    engine.processInput(new KeyboardEvent("keydown", { key }));
  }
}

describe("TypingEngine — coding mode uses the real snippet", () => {
  it("scores against the exact customText, including indentation", () => {
    const engine = new TypingEngine({
      mode: "coding",
      customText: "if (x) {\n  y();\n}",
      timerMode: "untimed",
      allowBackspace: true,
    });
    engine.initialize();
    engine.start();

    type(engine, "if (x) {\n  y();\n}");

    const stats = engine.getStatistics()!;
    expect(stats.incorrectChars).toBe(0);
    expect(stats.accuracy).toBe(100);
    expect(engine.getStatus()).toBe("completed");
  });
});

describe("TypingEngine — content extension for countdown sessions", () => {
  it("generates more content instead of ending early when the buffer runs out with time left", () => {
    const engine = new TypingEngine({
      mode: "coding",
      customText: "a();\nb();",
      timerMode: "countdown",
      duration: 3600, // effectively won't expire mid-test
      allowBackspace: true,
    });
    engine.initialize();
    engine.start();

    const originalWordCount = engine.getWords().length;
    expect(originalWordCount).toBe(2);

    type(engine, "a();\nb();");

    // Session should still be active — more content should have been
    // appended rather than ending early with 3600s still on the clock.
    expect(engine.getStatus()).toBe("active");
    expect(engine.getWords().length).toBeGreaterThan(originalWordCount);

    engine.destroy();
  });

  it("completes normally once the buffer runs out with no timer (word-count mode)", () => {
    const engine = new TypingEngine({
      mode: "coding",
      customText: "a();\nb();",
      timerMode: "untimed",
      allowBackspace: true,
    });
    engine.initialize();
    engine.start();

    type(engine, "a();\nb();");

    expect(engine.getStatus()).toBe("completed");
  });
});
