import { TextGenerator } from "./text-generator";

describe("TextGenerator.parseCodeText", () => {
  it("keeps each line as its own word, preserving leading indentation as literal characters", () => {
    const code = "function add(a, b) {\n  return a + b;\n}";
    const words = TextGenerator.parseCodeText(code);

    expect(words).toHaveLength(3);
    expect(words[0]!.text).toBe("function add(a, b) {");
    expect(words[1]!.text).toBe("  return a + b;");
    expect(words[1]!.characters[0]!.char).toBe(" ");
    expect(words[1]!.characters[1]!.char).toBe(" ");
    expect(words[1]!.characters[2]!.char).toBe("r");
    expect(words[2]!.text).toBe("}");
  });

  it("represents a blank line as a zero-character word", () => {
    const code = "let a = 1;\n\nlet b = 2;";
    const words = TextGenerator.parseCodeText(code);

    expect(words).toHaveLength(3);
    expect(words[1]!.text).toBe("");
    expect(words[1]!.characters).toHaveLength(0);
  });

  it("marks inline space characters with isSpace", () => {
    const words = TextGenerator.parseCodeText("if (x) {");
    const spaceIndices = words[0]!.characters
      .filter((c) => c.isSpace)
      .map((c) => c.index);

    expect(spaceIndices).toEqual([2, 6]);
  });
});

describe("TextGenerator.generate — coding mode", () => {
  it("uses the provided customText instead of a random built-in snippet", () => {
    const customText = "const answer = 42;";
    const result = TextGenerator.generate({
      mode: "coding",
      timerMode: "untimed",
      language: "english",
      includePunctuation: false,
      includeNumbers: false,
      includeCapitalization: false,
      allowBackspace: true,
      allowSkip: false,
      blindMode: false,
      instantDeath: false,
      strictMode: false,
      soundEnabled: false,
      hapticEnabled: false,
      customText,
    });

    expect(result).toBe(customText);
  });
});
