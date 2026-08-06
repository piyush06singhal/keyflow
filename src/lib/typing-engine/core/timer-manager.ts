/**
 * Timer Manager
 *
 * Manages precise timing for typing sessions with support for
 * countdown, elapsed, and untimed modes.
 */

import type { TimerMode } from "../types";
import { EventDispatcher } from "./event-dispatcher";

export interface TimerState {
  elapsedTime: number; // milliseconds
  remainingTime: number | null; // milliseconds, null for untimed
  isPaused: boolean;
  isExpired: boolean;
}

export class TimerManager {
  private mode: TimerMode;
  private duration: number | null; // milliseconds, null for untimed
  private startTime: number | null;
  private pausedTime: number; // Total time spent paused
  private pauseStartTime: number | null;
  private intervalId: number | null;
  private eventDispatcher: EventDispatcher;

  constructor(mode: TimerMode, duration?: number, eventDispatcher?: EventDispatcher) {
    this.mode = mode;
    this.duration = duration ? duration * 1000 : null; // Convert to milliseconds
    this.startTime = null;
    this.pausedTime = 0;
    this.pauseStartTime = null;
    this.intervalId = null;
    this.eventDispatcher = eventDispatcher ?? new EventDispatcher();

    this.validate();
  }

  /**
   * Start the timer
   */
  start(): void {
    if (this.startTime !== null) {
      throw new Error("Timer already started");
    }

    this.startTime = Date.now();
    this.startTicking();
  }

  /**
   * Pause the timer
   */
  pause(): void {
    if (this.pauseStartTime !== null) {
      throw new Error("Timer already paused");
    }

    if (this.startTime === null) {
      throw new Error("Timer not started");
    }

    this.pauseStartTime = Date.now();
    this.stopTicking();
  }

  /**
   * Resume the timer
   */
  resume(): void {
    if (this.pauseStartTime === null) {
      throw new Error("Timer not paused");
    }

    const pauseDuration = Date.now() - this.pauseStartTime;
    this.pausedTime += pauseDuration;
    this.pauseStartTime = null;
    this.startTicking();
  }

  /**
   * Stop the timer completely
   */
  stop(): void {
    this.stopTicking();
    this.startTime = null;
    this.pausedTime = 0;
    this.pauseStartTime = null;
  }

  /**
   * Reset the timer
   */
  reset(): void {
    this.stop();
  }

  /**
   * Get current timer state
   */
  getState(): TimerState {
    const elapsedTime = this.getElapsedTime();
    const remainingTime = this.getRemainingTime();

    return {
      elapsedTime,
      remainingTime,
      isPaused: this.pauseStartTime !== null,
      isExpired: remainingTime !== null && remainingTime <= 0,
    };
  }

  /**
   * Get elapsed time in milliseconds
   */
  getElapsedTime(): number {
    if (this.startTime === null) return 0;

    const now = Date.now();
    const totalElapsed = now - this.startTime;

    // Subtract paused time
    let adjustedPausedTime = this.pausedTime;
    if (this.pauseStartTime !== null) {
      adjustedPausedTime += now - this.pauseStartTime;
    }

    return Math.max(0, totalElapsed - adjustedPausedTime);
  }

  /**
   * Get remaining time in milliseconds (null for untimed/elapsed modes)
   */
  getRemainingTime(): number | null {
    if (this.mode !== "countdown" || this.duration === null) {
      return null;
    }

    const elapsed = this.getElapsedTime();
    return Math.max(0, this.duration - elapsed);
  }

  /**
   * Get elapsed time in seconds
   */
  getElapsedSeconds(): number {
    return Math.floor(this.getElapsedTime() / 1000);
  }

  /**
   * Get remaining time in seconds (null for untimed/elapsed modes)
   */
  getRemainingSeconds(): number | null {
    const remaining = this.getRemainingTime();
    return remaining !== null ? Math.floor(remaining / 1000) : null;
  }

  /**
   * Check if timer has expired (only for countdown mode)
   */
  isExpired(): boolean {
    if (this.mode !== "countdown") return false;

    const remaining = this.getRemainingTime();
    return remaining !== null && remaining <= 0;
  }

  /**
   * Check if timer is running
   */
  isRunning(): boolean {
    return this.startTime !== null && this.pauseStartTime === null;
  }

  /**
   * Check if timer is paused
   */
  isPaused(): boolean {
    return this.pauseStartTime !== null;
  }

  /**
   * Get timer mode
   */
  getMode(): TimerMode {
    return this.mode;
  }

  /**
   * Get duration (null for untimed)
   */
  getDuration(): number | null {
    return this.duration;
  }

  /**
   * Start the tick interval
   */
  private startTicking(): void {
    if (this.intervalId !== null) return;

    // Emit initial tick
    this.emitTick();

    // Start interval (100ms for smooth updates)
    this.intervalId = window.setInterval(() => {
      this.emitTick();

      // Check for expiration
      if (this.isExpired()) {
        this.stopTicking();
        // Defer past this macrotask so the "0s" tick above actually paints
        // before the (synchronous, and non-trivial) session-completion work
        // runs — otherwise the countdown visibly freezes on the last second
        // while completion/stat-generation/persistence blocks the thread.
        window.setTimeout(() => {
          this.eventDispatcher.emit("timer:expired", this.getState());
        }, 0);
      }
    }, 100);
  }

  /**
   * Stop the tick interval
   */
  private stopTicking(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Emit timer tick event
   */
  private emitTick(): void {
    this.eventDispatcher.emit("timer:tick", this.getState());
  }

  /**
   * Validate timer configuration
   */
  private validate(): void {
    if (this.mode === "countdown" && this.duration === null) {
      throw new Error("Duration is required for countdown mode");
    }

    if (this.duration !== null && this.duration <= 0) {
      throw new Error("Duration must be positive");
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stopTicking();
  }
}
