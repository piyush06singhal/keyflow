"use client";

import { memo, useCallback, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Word, Character, CursorPosition } from "@/lib/typing-engine";
import { cn } from "@/lib/utils";
import { useTypingPracticeStore } from "@/stores/typing-practice-store";

/**
 * Text Renderer Component
 *
 * Renders the typing text with character-level styling and animations.
 * Handles correct/incorrect character states and cursor positioning.
 *
 * The viewport is fixed to a few lines tall — as the active word crosses
 * a line boundary, the word flow is translated up so the current line
 * stays in view, instead of showing the entire (often huge) generated
 * text buffer as one ever-growing block.
 */

const VISIBLE_LINES = 3;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const wordEls = useRef<Map<number, HTMLSpanElement>>(new Map());

  const registerWordRef = useCallback((index: number, el: HTMLSpanElement | null) => {
    if (el) wordEls.current.set(index, el);
    else wordEls.current.delete(index);
  }, []);

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

  const activeWordIndex = cursorPosition?.wordIndex ?? 0;
  const activeCharIndex = cursorPosition?.charIndex ?? null;

  // Keep the active line in view: measure the real line height (accounts
  // for font size + gap) and translate the word flow so the active word
  // never sits below the fixed viewport. Runs before paint so there's no
  // visible jump.
  useLayoutEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const style = window.getComputedStyle(inner);
    const lineHeight = parseFloat(style.lineHeight) || 32;
    const rowGap = parseFloat(style.rowGap) || 0;
    const effectiveLineHeight = lineHeight + rowGap;

    const targetHeight = Math.round(effectiveLineHeight * VISIBLE_LINES);
    if (Math.abs(container.clientHeight - targetHeight) > 1) {
      container.style.height = `${targetHeight}px`;
    }

    const activeEl = wordEls.current.get(activeWordIndex);
    const activeTop = activeEl ? activeEl.offsetTop : 0;
    const activeLine = Math.round(activeTop / effectiveLineHeight);
    const targetLine = Math.max(0, activeLine - 1);
    const translateY = -(targetLine * effectiveLineHeight);

    inner.style.transform = `translateY(${translateY}px)`;
    // `words` deliberately excluded — this only needs to re-run when the
    // active word/line changes (ref lookups are always current), not on
    // every keystroke. Including it would force a synchronous layout read
    // (getComputedStyle) on every character typed.
  }, [activeWordIndex, fontSizeClass, fontFamilyClass]);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <div
        ref={innerRef}
        className={cn(
          "relative flex flex-wrap gap-x-2 gap-y-3 leading-relaxed transition-transform duration-150 ease-out",
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
            isActiveWord={word.index === activeWordIndex}
            activeCharIndex={word.index === activeWordIndex ? activeCharIndex : null}
            cursorStyle={uiSettings.cursorStyle}
            registerRef={registerWordRef}
          />
        ))}
      </div>
    </div>
  );
});

interface WordRendererProps {
  word: Readonly<Word>;
  isActiveWord: boolean;
  activeCharIndex: number | null;
  cursorStyle: "line" | "block" | "underline";
  registerRef: (index: number, el: HTMLSpanElement | null) => void;
}

const WordRenderer = memo(function WordRenderer({
  word,
  isActiveWord,
  activeCharIndex,
  cursorStyle,
  registerRef,
}: WordRendererProps) {
  const isCompleted = word.isCompleted;

  return (
    <span
      ref={(el) => registerRef(word.index, el)}
      className={cn("relative inline-flex", {
        "opacity-40": !isCompleted && !isActiveWord,
        "opacity-100": isCompleted || isActiveWord,
      })}
    >
      {word.characters.map((char, charIdx) => (
        <CharacterRenderer
          key={char.index}
          character={char}
          showCursor={isActiveWord && activeCharIndex === charIdx}
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
        {char === " " ? " " : char}
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
            className={cn("glow-primary pointer-events-none absolute", {
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
