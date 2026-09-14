import { InputManager } from "./input-manager";
import { EventDispatcher } from "../core/event-dispatcher";
import type { CursorPosition, TypingEngineConfig, Word } from "../types";

const baseConfig: TypingEngineConfig = {
  mode: "word",
  timerMode: "countdown",
  duration: 60,
  language: "english",
  includePunctuation: false,
  includeNumbers: false,
  includeCapitalization: false,
  allowBackspace: true,
  blindMode: false,
  strictMode: false,
  soundEnabled: false,
};

function makeWords(...texts: string[]): Word[] {
  return texts.map((text, index) => ({
    text,
    index,
    characters: text.split("").map((char, i) => ({
      char,
      index: i,
      wordIndex: index,
      isSpace: false,
      isCorrect: null,
      typed: false,
      skipped: false,
      timestamp: null,
    })),
    isCompleted: false,
    isCorrect: null,
    startTime: null,
    endTime: null,
  }));
}

function keyEvent(
  key: string,
  overrides: Partial<{ ctrlKey: boolean; metaKey: boolean; altKey: boolean }> = {},
): KeyboardEvent {
  return new KeyboardEvent("keydown", { key, ...overrides });
}

function makeManager(config: TypingEngineConfig = baseConfig) {
  return new InputManager(config, new EventDispatcher());
}

describe("InputManager.processKeyEvent — character input", () => {
  it("advances the cursor by one character index for a regular letter", () => {
    const manager = makeManager();
    const cursor: CursorPosition = { wordIndex: 0, charIndex: 0, absoluteIndex: 0 };
    const words = makeWords("hello");

    const { action, shouldPreventDefault } = manager.processKeyEvent(
      keyEvent("h"),
      cursor,
      words,
    );

    expect(shouldPreventDefault).toBe(true);
    expect(action).not.toBeNull();
    expect(action!.type).toBe("character");
    expect(action!.value).toBe("h");
    expect(action!.cursorAfter).toEqual({
      wordIndex: 0,
      charIndex: 1,
      absoluteIndex: 1,
    });
  });

  it("ignores modifier keys pressed alone", () => {
    const manager = makeManager();
    const cursor: CursorPosition = { wordIndex: 0, charIndex: 0, absoluteIndex: 0 };
    const { action, shouldPreventDefault } = manager.processKeyEvent(
      keyEvent("Shift"),
      cursor,
      makeWords("hi"),
    );

    expect(action).toBeNull();
    expect(shouldPreventDefault).toBe(false);
  });

  it("always prevents default for Tab so focus never leaves the practice area", () => {
    const manager = makeManager();
    const cursor: CursorPosition = { wordIndex: 0, charIndex: 0, absoluteIndex: 0 };
    const { action, shouldPreventDefault } = manager.processKeyEvent(
      keyEvent("Tab"),
      cursor,
      makeWords("hi"),
    );

    expect(action).toBeNull();
    expect(shouldPreventDefault).toBe(true);
  });

  it("blocks paste (Ctrl/Cmd+V) instead of producing a character action", () => {
    const manager = makeManager();
    const cursor: CursorPosition = { wordIndex: 0, charIndex: 0, absoluteIndex: 0 };
    const { action, shouldPreventDefault } = manager.processKeyEvent(
      keyEvent("v", { ctrlKey: true }),
      cursor,
      makeWords("hi"),
    );

    expect(action).toBeNull();
    expect(shouldPreventDefault).toBe(true);
  });
});

describe("InputManager.processKeyEvent — space", () => {
  it("moves the cursor to the start of the next word", () => {
    const manager = makeManager();
    const cursor: CursorPosition = { wordIndex: 0, charIndex: 5, absoluteIndex: 5 };
    const { action } = manager.processKeyEvent(
      keyEvent(" "),
      cursor,
      makeWords("hello", "world"),
    );

    expect(action!.type).toBe("character");
    expect(action!.value).toBe(" ");
    expect(action!.cursorAfter).toEqual({
      wordIndex: 1,
      charIndex: 0,
      absoluteIndex: 6,
    });
  });
});

describe("InputManager.processKeyEvent — backspace", () => {
  it("is a no-op at the very start of the text", () => {
    const manager = makeManager();
    const cursor: CursorPosition = { wordIndex: 0, charIndex: 0, absoluteIndex: 0 };
    const { action, shouldPreventDefault } = manager.processKeyEvent(
      keyEvent("Backspace"),
      cursor,
      makeWords("hi"),
    );

    expect(action).toBeNull();
    expect(shouldPreventDefault).toBe(true);
  });

  it("is disabled entirely when the config forbids backspace", () => {
    const manager = makeManager({ ...baseConfig, allowBackspace: false });
    const cursor: CursorPosition = { wordIndex: 0, charIndex: 2, absoluteIndex: 2 };
    const { action, shouldPreventDefault } = manager.processKeyEvent(
      keyEvent("Backspace"),
      cursor,
      makeWords("hi"),
    );

    expect(action).toBeNull();
    expect(shouldPreventDefault).toBe(true);
  });

  it("moves back one character within the current word", () => {
    const manager = makeManager();
    const cursor: CursorPosition = { wordIndex: 0, charIndex: 3, absoluteIndex: 3 };
    const { action } = manager.processKeyEvent(
      keyEvent("Backspace"),
      cursor,
      makeWords("hello"),
    );

    expect(action!.type).toBe("backspace");
    expect(action!.cursorAfter).toEqual({
      wordIndex: 0,
      charIndex: 2,
      absoluteIndex: 2,
    });
  });

  it("crosses back into the end of the previous word at a word boundary", () => {
    const manager = makeManager();
    // cursor sits at the very start of word 1 ("world"), absoluteIndex accounts
    // for "hello" (5) + the space (1) = 6
    const cursor: CursorPosition = { wordIndex: 1, charIndex: 0, absoluteIndex: 6 };
    const { action } = manager.processKeyEvent(
      keyEvent("Backspace"),
      cursor,
      makeWords("hello", "world"),
    );

    expect(action!.type).toBe("backspace");
    expect(action!.cursorAfter).toEqual({
      wordIndex: 0,
      charIndex: 5, // end of "hello"
      absoluteIndex: 5,
    });
  });
});

describe("InputManager.processKeyEvent — coding mode", () => {
  const codingConfig: TypingEngineConfig = { ...baseConfig, mode: "coding" };

  it("treats space as a literal character instead of a word boundary", () => {
    const manager = makeManager(codingConfig);
    const cursor: CursorPosition = { wordIndex: 0, charIndex: 3, absoluteIndex: 3 };
    const { action } = manager.processKeyEvent(
      keyEvent(" "),
      cursor,
      makeWords("let x = 1;"),
    );

    expect(action!.value).toBe(" ");
    // stays on the same word/line — only charIndex/absoluteIndex advance
    expect(action!.cursorAfter).toEqual({
      wordIndex: 0,
      charIndex: 4,
      absoluteIndex: 4,
    });
  });

  it("treats Enter as the line boundary, advancing to the next line", () => {
    const manager = makeManager(codingConfig);
    const cursor: CursorPosition = { wordIndex: 0, charIndex: 10, absoluteIndex: 10 };
    const { action, shouldPreventDefault } = manager.processKeyEvent(
      keyEvent("Enter"),
      cursor,
      makeWords("let x = 1;", "let y = 2;"),
    );

    expect(shouldPreventDefault).toBe(true);
    expect(action!.value).toBe("\n");
    expect(action!.cursorAfter).toEqual({
      wordIndex: 1,
      charIndex: 0,
      absoluteIndex: 11,
    });
  });

  it("ignores Enter outside of coding mode", () => {
    const manager = makeManager();
    const cursor: CursorPosition = { wordIndex: 0, charIndex: 5, absoluteIndex: 5 };
    const { action, shouldPreventDefault } = manager.processKeyEvent(
      keyEvent("Enter"),
      cursor,
      makeWords("hello", "world"),
    );

    expect(action).toBeNull();
    expect(shouldPreventDefault).toBe(false);
  });
});
