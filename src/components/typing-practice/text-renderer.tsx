"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Word, Character, CursorPosition } from "@/lib/typing-engine";
import { cn } from "@/lib/utils";
import { useTypingPracticeStore } from "@/stores/typing-practice-store";

/**
 * Text Renderer Component
 *
 * Renders the typing text with character-level styling and animations.
 * Handles correct/incorrect character states and cursor positioning.
 */

export interface TextRendererProps {
  words: ReadonlyArray<Readonly<Word>>;
  cursorPosition: CursorPosition | null;
  className?: string;
}

export const TextRenderer = memo(function TextRenderer({
  words,
  cursorPosition,
  className,
}: TextRendererProps) {
  const { uiSettings } = useTypingPracticeStore();

  const fontSizeClass = {
    sm: "text-lg",
    base: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  }[uiSettings.fontSize];

  const fontFamilyClass = {
    mono: "font-mono",
    sans: "font-sans",
    serif: "font-serif",
  }[uiSettings.fontFamily];

  return (
    <div
      className={cn(
        "relative flex flex-wrap gap-x-2 gap-y-3 leading-relaxed",
        fontSizeClass,
        fontFamilyClass,
        className,
      )}
      role="textbox"
      aria-label="Typing practice text"
    >
      {words.map((word) => (
        <WordRenderer
          key={word.index}
          word={word}
          cursorPosition={cursorPosition}
          cursorStyle={uiSettings.cursorStyle}
        />
      ))}
    </div>
  );
});

interface WordRendererProps {
  word: Readonly<Word>;
  cursorPosition: CursorPosition | null;
  cursorStyle: "line" | "block" | "underline";
}

const WordRenderer = memo(function WordRenderer({
  word,
  cursorPosition,
  cursorStyle,
}: WordRendererProps) {
  const isActiveWord = cursorPosition?.wordIndex === word.index;
  const isCompleted = word.isCompleted;

  return (
    <span
      className={cn("relative inline-flex", {
        "opacity-40": !isCompleted && !isActiveWord,
        "opacity-100": isCompleted || isActiveWord,
      })}
    >
      {word.characters.map((char, charIdx) => (
        <CharacterRenderer
          key={char.index}
          character={char}
          showCursor={isActiveWord && cursorPosition?.charIndex === charIdx}
          cursorStyle={cursorStyle}
        />
      ))}
    </span>
  );
});

interface CharacterRendererProps {
  character: Readonly<Character>;
  showCursor: boolean;
  cursorStyle: "line" | "block" | "underline";
}

const CharacterRenderer = memo(function CharacterRenderer({
  character,
  showCursor,
  cursorStyle,
}: CharacterRendererProps) {
  const { char, isCorrect, typed } = character;

  const getCharacterColor = () => {
    if (!typed) return "text-muted-foreground/70";
    if (isCorrect === true) return "text-foreground";
    return "text-destructive";
  };

  const getBgColor = () => {
    if (!typed) return "";
    if (isCorrect === false) return "bg-destructive/15";
    return "";
  };

  return (
    <span className="relative inline-block">
      {/* Character */}
      <span
        className={cn(
          "relative inline-block min-w-[0.5em] transition-colors duration-75",
          getCharacterColor(),
          getBgColor(),
        )}
      >
        {char === " " ? "\u00A0" : char}
      </span>

      {/* Cursor — blinking */}
      <AnimatePresence>
        {showCursor && (
          <motion.span
            key="cursor"
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              times: [0, 0.5, 0.5, 1],
            }}
            className={cn("pointer-events-none absolute", {
              "bg-primary top-0 left-[-1px] h-full w-[2px]": cursorStyle === "line",
              "bg-primary/25 ring-primary inset-0 rounded-sm ring-1 ring-inset":
                cursorStyle === "block",
              "bg-primary bottom-0 left-0 h-[2px] w-full": cursorStyle === "underline",
            })}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </span>
  );
});
