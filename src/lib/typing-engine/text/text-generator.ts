/**
 * Text Generator
 * 
 * Generates text content for typing practice based on configuration.
 */

import type { TypingEngineConfig, Word, Character } from "../types";
import { commonWords } from "./word-lists";

export class TextGenerator {
  /**
   * Generate text content based on configuration
   */
  static generate(config: TypingEngineConfig): string {
    switch (config.mode) {
      case "word":
        return this.generateWords(config);
      case "paragraph":
        return this.generateParagraph(config);
      case "quote":
        return this.generateQuote(config);
      case "custom":
        return config.customText ?? "";
      case "coding":
        return this.generateCode(config);
      default:
        return this.generateWords(config);
    }
  }

  /**
   * Generate random words
   */
  private static generateWords(config: TypingEngineConfig): string {
    const wordCount = config.wordCount ?? 50;
    const words: string[] = [];

    const sourceWords = config.customWords ?? commonWords;

    for (let i = 0; i < wordCount; i++) {
      let word = this.getRandomWord(sourceWords);

      // Apply capitalization
      if (config.includeCapitalization && Math.random() < 0.15) {
        word = this.capitalizeWord(word);
      }

      words.push(word);
    }

    // Add punctuation
    if (config.includePunctuation) {
      this.addPunctuation(words);
    }

    // Add numbers
    if (config.includeNumbers) {
      this.addNumbers(words);
    }

    return words.join(" ");
  }

  /**
   * Generate a paragraph
   */
  private static generateParagraph(config: TypingEngineConfig): string {
    const wordCount = config.wordCount ?? 100;
    const words: string[] = [];
    const sourceWords = config.customWords ?? commonWords;

    let sentenceLength = 0;
    const targetSentenceLength = this.getRandomInt(8, 15);

    for (let i = 0; i < wordCount; i++) {
      let word = this.getRandomWord(sourceWords);

      // Capitalize first word of sentence
      if (sentenceLength === 0) {
        word = this.capitalizeWord(word);
      }

      words.push(word);
      sentenceLength++;

      // End sentence
      if (sentenceLength >= targetSentenceLength || i === wordCount - 1) {
        words[words.length - 1] = words[words.length - 1] + ".";
        sentenceLength = 0;
      }
    }

    return words.join(" ");
  }

  /**
   * Generate a quote (placeholder - would fetch from API)
   */
  private static generateQuote(config: TypingEngineConfig): string {
    // Placeholder quotes
    const quotes = [
      "The only way to do great work is to love what you do.",
      "Innovation distinguishes between a leader and a follower.",
      "Stay hungry, stay foolish.",
      "The future belongs to those who believe in the beauty of their dreams.",
    ];

    return this.getRandomElement(quotes);
  }

  /**
   * Generate code snippet
   */
  private static generateCode(config: TypingEngineConfig): string {
    // Placeholder code snippets
    const codeSnippets = [
      'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}',
      'const sum = (a, b) => a + b;\nconst multiply = (a, b) => a * b;',
      'class Person {\n  constructor(name) {\n    this.name = name;\n  }\n}',
    ];

    return this.getRandomElement(codeSnippets);
  }

  /**
   * Parse text into structured words and characters
   */
  static parseText(text: string): Word[] {
    const words: Word[] = [];
    const wordStrings = text.split(/\s+/).filter((w) => w.length > 0);

    wordStrings.forEach((wordText, wordIndex) => {
      const characters: Character[] = [];

      for (let charIndex = 0; charIndex < wordText.length; charIndex++) {
        characters.push({
          char: wordText[charIndex] ?? "",
          index: charIndex,
          wordIndex,
          isSpace: false,
          isCorrect: null,
          typed: false,
          skipped: false,
          timestamp: null,
        });
      }

      words.push({
        text: wordText,
        index: wordIndex,
        characters,
        isCompleted: false,
        isCorrect: null,
        startTime: null,
        endTime: null,
      });
    });

    return words;
  }

  /**
   * Add punctuation to words
   */
  private static addPunctuation(words: string[]): void {
    const punctuation = [",", ".", "!", "?", ";"];

    for (let i = 0; i < words.length; i++) {
      if (Math.random() < 0.1) {
        words[i] = words[i] + this.getRandomElement(punctuation);
      }
    }
  }

  /**
   * Add numbers to words
   */
  private static addNumbers(words: string[]): void {
    for (let i = 0; i < words.length; i++) {
      if (Math.random() < 0.05) {
        words[i] = String(this.getRandomInt(0, 1000));
      }
    }
  }

  /**
   * Capitalize a word
   */
  private static capitalizeWord(word: string): string {
    if (word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  /**
   * Get random word from array
   */
  private static getRandomWord(words: string[]): string {
    return this.getRandomElement(words);
  }

  /**
   * Get random element from array
   */
  private static getRandomElement<T>(array: T[]): T {
    const index = Math.floor(Math.random() * array.length);
    return array[index] ?? array[0]!;
  }

  /**
   * Get random integer between min and max (inclusive)
   */
  private static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
