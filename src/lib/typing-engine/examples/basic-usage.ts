/**
 * Basic Usage Example
 * 
 * Demonstrates how to use the Typing Engine in a simple scenario.
 */

import { TypingEngine } from "../typing-engine";
import type { LiveStatistics, SessionResult } from "../types";

/**
 * Example: Basic typing session
 */
export function basicTypingSession() {
  // Create engine with configuration
  const engine = new TypingEngine({
    mode: "word",
    timerMode: "countdown",
    duration: 60, // 60 seconds
    language: "english",
    wordCount: 50,
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
  });

  // Initialize the session
  engine.initialize();

  // Subscribe to events
  const unsubscribeStarted = engine.on("session:started", (event) => {
    console.log("✓ Session started at:", new Date(event.timestamp));
  });

  const unsubscribeStats = engine.on("statistics:updated", (event) => {
    const stats = event.data as LiveStatistics;
    console.log(`📊 WPM: ${stats.wpm} | Accuracy: ${stats.accuracy}% | Progress: ${stats.progress}%`);
  });

  const unsubscribeCompleted = engine.on("session:completed", (event) => {
    const result = event.data as SessionResult;
    console.log("✅ Session completed!");
    console.log(`   Final WPM: ${result.finalWpm}`);
    console.log(`   Accuracy: ${result.finalAccuracy}%`);
    console.log(`   Mistakes: ${result.mistakes.length}`);
    console.log(`   Consistency: ${result.consistency}`);
  });

  // Start the session
  engine.start();

  // Simulate keyboard input (in real usage, attach to DOM events)
  // document.addEventListener("keydown", (event) => {
  //   engine.processInput(event);
  // });

  // Get current state
  const textContent = engine.getTextContent();
  const words = engine.getWords();
  const cursor = engine.getCursorPosition();
  const stats = engine.getStatistics();

  console.log("Text to type:", textContent);
  console.log("Total words:", words.length);
  console.log("Current cursor:", cursor);
  console.log("Current stats:", stats);

  // Cleanup function
  return () => {
    unsubscribeStarted();
    unsubscribeStats();
    unsubscribeCompleted();
    engine.destroy();
  };
}

/**
 * Example: Session with pause/resume
 */
export function sessionWithPauseResume() {
  const engine = new TypingEngine({
    mode: "word",
    timerMode: "elapsed",
    wordCount: 30,
    allowBackspace: true,
  });

  engine.initialize();
  engine.start();

  // Pause after some time
  setTimeout(() => {
    console.log("⏸️  Pausing session...");
    engine.pause();

    // Resume after a delay
    setTimeout(() => {
      console.log("▶️  Resuming session...");
      engine.resume();
    }, 2000);
  }, 5000);

  return () => engine.destroy();
}

/**
 * Example: Custom text typing
 */
export function customTextTyping() {
  const customText = "The quick brown fox jumps over the lazy dog";

  const engine = new TypingEngine({
    mode: "custom",
    timerMode: "untimed",
    customText,
    allowBackspace: true,
    strictMode: true,
  });

  engine.initialize();
  console.log("Type this text:", engine.getTextContent());
  engine.start();

  return () => engine.destroy();
}

/**
 * Example: Coding practice mode
 */
export function codingPractice() {
  const engine = new TypingEngine({
    mode: "coding",
    timerMode: "untimed",
    language: "english",
    allowBackspace: true,
    strictMode: true,
  });

  engine.initialize();
  engine.start();

  // Coding mode includes special characters and syntax
  const textContent = engine.getTextContent();
  console.log("Code to type:", textContent);

  return () => engine.destroy();
}

/**
 * Example: Session persistence
 */
export function sessionPersistence() {
  const engine = new TypingEngine({
    mode: "word",
    timerMode: "countdown",
    duration: 120,
    wordCount: 100,
  });

  engine.initialize();
  engine.start();

  // Save snapshot every 5 seconds
  const saveInterval = setInterval(() => {
    const snapshot = engine.createSnapshot();
    // Save to localStorage
    localStorage.setItem("typing-session", JSON.stringify(snapshot));
    console.log("💾 Session saved");
  }, 5000);

  // Restore session on page load
  const savedSession = localStorage.getItem("typing-session");
  if (savedSession) {
    try {
      const snapshot = JSON.parse(savedSession);
      engine.restoreFromSnapshot(snapshot);
      console.log("♻️  Session restored");
    } catch (error) {
      console.error("Failed to restore session:", error);
    }
  }

  return () => {
    clearInterval(saveInterval);
    engine.destroy();
  };
}

/**
 * Example: Real-time statistics tracking
 */
export function realTimeStatistics() {
  const engine = new TypingEngine({
    mode: "word",
    timerMode: "countdown",
    duration: 60,
    wordCount: 50,
  });

  engine.initialize();

  // Track statistics in real-time
  const statsHistory: LiveStatistics[] = [];

  engine.on("statistics:updated", (event) => {
    const stats = event.data as LiveStatistics;
    statsHistory.push(stats);

    // Calculate trends
    if (statsHistory.length > 10) {
      const recentStats = statsHistory.slice(-10);
      const avgWpm =
        recentStats.reduce((sum, s) => sum + s.wpm, 0) / recentStats.length;
      console.log(`📈 Recent average WPM: ${avgWpm.toFixed(1)}`);
    }
  });

  engine.on("session:completed", (event) => {
    const result = event.data as SessionResult;
    console.log("📊 Final Statistics:");
    console.log(`   Peak WPM: ${result.peakWpm}`);
    console.log(`   Consistency: ${result.consistency}%`);
    console.log(`   Total segments: ${result.segments.length}`);
  });

  engine.start();

  return () => engine.destroy();
}

/**
 * Example: Mistake analysis
 */
export function mistakeAnalysis() {
  const engine = new TypingEngine({
    mode: "word",
    timerMode: "untimed",
    wordCount: 30,
    allowBackspace: true,
  });

  engine.initialize();
  engine.start();

  // Track mistakes
  engine.on("mistake:recorded", (event) => {
    const mistake = event.data as any;
    console.log(`❌ Mistake: Expected '${mistake.expected}', got '${mistake.typed}'`);
  });

  engine.on("mistake:corrected", (event) => {
    const mistake = event.data as any;
    console.log(`✓ Corrected in ${mistake.correctionTime}ms`);
  });

  engine.on("session:completed", (event) => {
    const result = event.data as SessionResult;
    console.log("\n📊 Mistake Analysis:");
    console.log(`   Total mistakes: ${result.mistakes.length}`);
    console.log(`   Uncorrected: ${result.mistakes.filter((m: any) => !m.corrected).length}`);

    // Character-specific accuracy
    result.characterStats.forEach((stats, char) => {
      if (stats.accuracy < 100) {
        console.log(`   '${char}': ${stats.accuracy.toFixed(1)}% accuracy (${stats.incorrect} errors)`);
      }
    });
  });

  return () => engine.destroy();
}
