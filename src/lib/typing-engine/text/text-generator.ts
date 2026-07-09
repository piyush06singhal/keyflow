/**
 * Text Generator
 *
 * Generates text content for typing practice based on configuration.
 * For timed modes, generates enough words to last the full duration.
 * For word modes, generates exactly the requested count.
 */

import type { TypingEngineConfig, Word, Character } from "../types";
import { commonWords } from "./word-lists";

// Curated quotes for quote mode
const QUOTES = [
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.",
  "Innovation distinguishes between a leader and a follower. The people who are crazy enough to think they can change the world are the ones who do.",
  "Stay hungry, stay foolish. Your time is limited, so don't waste it living someone else's life.",
  "In the middle of every difficulty lies opportunity. Imagination is more important than knowledge.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The future belongs to those who believe in the beauty of their dreams. Do not go where the path may lead, go instead where there is no path and leave a trail.",
  "It does not matter how slowly you go as long as you do not stop. Our greatest glory is not in never falling but in rising every time we fall.",
  "Be yourself; everyone else is already taken. You only live once, but if you do it right, once is enough.",
  "Two things are infinite: the universe and human stupidity, and I'm not sure about the universe.",
  "Life is what happens to you while you're busy making other plans. In three words I can sum up everything I've learned about life: it goes on.",
  "You miss one hundred percent of the shots you don't take. Whether you think you can or you think you can't, you're right.",
  "If you want to live a happy life, tie it to a goal, not to people or things. Logic will get you from A to Z; imagination will get you everywhere.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall. The way to get started is to quit talking and begin doing.",
  "When you reach the end of your rope, tie a knot in it and hang on. Always remember that you are absolutely unique. Just like everyone else.",
  "Do not go where the path may lead, go instead where there is no path and leave a trail. You will face many defeats in life, but never let yourself be defeated.",
];

// Curated paragraphs for paragraph mode
const PARAGRAPHS = [
  "The art of programming is the art of organizing complexity. The programmer must be both a craftsman and a scientist, thinking carefully about abstractions and their trade-offs. Every line of code tells a story about the problem being solved and the mind that solved it. Good code is not just correct; it is clear, efficient, and a pleasure to read.",
  "Technology has fundamentally changed the way humans interact with information. From the printing press to the internet, each new medium reshapes society in profound ways. We are now in the midst of another transformation, where artificial intelligence is beginning to augment human capabilities in ways previously thought impossible. The question is not whether this transformation will happen, but how we will guide it.",
  "The universe is under no obligation to make sense to you. Scientists spend their careers building models of reality, testing them against observation, and refining them when they fail. This process of systematic doubt and revision is the most powerful tool humanity has ever developed for understanding the world around us.",
  "Reading is to the mind what exercise is to the body. Through books, we can travel to distant lands, inhabit different bodies, and experience lives we could never live ourselves. The best stories do not just entertain; they expand our capacity for empathy and deepen our understanding of what it means to be human.",
  "Mountains have a way of dealing with overconfidence. No matter how experienced the climber, the mountain remains indifferent to human ambition. The summit does not care about your schedule or your fitness level. This is part of their appeal: in a world where so much can be controlled, mountains remind us of our own smallness.",
  "The ocean covers more than seventy percent of the Earth's surface, yet we have explored only a fraction of its depths. The deep sea remains one of the last great frontiers, home to creatures of extraordinary strangeness that have evolved in isolation from sunlight for millions of years. Every dive to the ocean floor yields new discoveries.",
  "Music is a language that transcends spoken words. A melody can communicate sadness, joy, longing, or triumph with an immediacy that no sentence can match. Throughout human history, music has been present at every major event: celebrations, mourning, worship, and war. It is woven into the fabric of our shared experience.",
  "Cities are engines of human creativity and connection. When people come together in dense, diverse communities, ideas cross-pollinate in unexpected ways. The greatest cities throughout history have been places where different cultures, disciplines, and perspectives collide, sparking innovations that reshape the world.",
];

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
   * Generate random words.
   * For countdown mode, generates enough words to last the full duration
   * (assumes ~70 WPM average → words needed = duration_seconds * 70 / 60 * 2 for safety)
   */
  private static generateWords(config: TypingEngineConfig): string {
    // For countdown mode, generate plenty of words so text never runs out
    let wordCount: number;
    if (config.timerMode === "countdown" && config.duration) {
      // Generate 3× the expected word count at average WPM (80) to be safe
      const avgWpm = 80;
      const expectedWords = Math.ceil((config.duration / 60) * avgWpm);
      wordCount = Math.max(expectedWords * 3, 200);
    } else {
      wordCount = config.wordCount ?? 50;
    }

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
   * Generate a paragraph.
   * Uses curated, well-formed paragraphs for better practice quality.
   */
  private static generateParagraph(config: TypingEngineConfig): string {
    if (config.timerMode === "countdown" && config.duration) {
      // For timed modes, concatenate multiple paragraphs to ensure enough text
      const avgWpm = 60;
      const expectedChars = Math.ceil((config.duration / 60) * avgWpm * 5);
      let result = "";
      const shuffled = [...PARAGRAPHS].sort(() => Math.random() - 0.5);
      let idx = 0;
      while (result.length < expectedChars * 2) {
        result += (result ? " " : "") + shuffled[idx % shuffled.length];
        idx++;
      }
      return result;
    }

    // Word count based: pick a paragraph and extend if needed
    const wordCount = config.wordCount ?? 100;
    let result = this.getRandomElement(PARAGRAPHS);
    while (result.split(" ").length < wordCount) {
      result += " " + this.getRandomElement(PARAGRAPHS);
    }
    return result.split(" ").slice(0, wordCount).join(" ");
  }

  /**
   * Generate a quote — picks from curated, real quotes
   */
  private static generateQuote(_config: TypingEngineConfig): string {
    return this.getRandomElement(QUOTES);
  }

  /**
   * Generate code snippet for the typing engine's built-in mode
   */
  private static generateCode(_config: TypingEngineConfig): string {
    const codeSnippets = [
      `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
      `const quickSort = (arr) => {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), ...middle, ...quickSort(right)];
};`,
      `class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  emit(event, ...args) {
    const callbacks = this.listeners[event] || [];
    callbacks.forEach(cb => cb(...args));
  }
}`,
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
