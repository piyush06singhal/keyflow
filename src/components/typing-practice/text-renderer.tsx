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

  return (
    <span
      className={cn("relative inline-flex", {
        "opacity-50": !word.isCompleted && !isActiveWord,
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

  // Determine character state
  const getCharacterColor = () => {
    if (!typed) return "text-muted-foreground";
    if (isCorrect) return "text-foreground";
    return "text-destructive";
  };

  const getBgColor = () => {
    if (!typed) return "";
    if (isCorrect) return "";
    return "bg-destructive/10";
  };

  return (
    <span className="relative inline-block">
      {/* Character */}
      <motion.span
        className={cn(
          "relative inline-block min-w-[0.6em] transition-colors",
          getCharacterColor(),
          getBgColor(),
          {
            "rounded px-0.5": !typed || !isCorrect,
          },
        )}
        initial={typed ? { scale: 0.8, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>

      {/* Cursor */}
      <AnimatePresence>
        {showCursor && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn("absolute", {
              // Line cursor
              "bg-primary top-0 left-0 h-full w-0.5": cursorStyle === "line",
              // Block cursor
              "bg-primary/20 ring-primary inset-0 ring-2 ring-inset":
                cursorStyle === "block",
              // Underline cursor
              "bg-primary bottom-0 left-0 h-0.5 w-full": cursorStyle === "underline",
            })}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 0.8,
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </span>
  );
});
