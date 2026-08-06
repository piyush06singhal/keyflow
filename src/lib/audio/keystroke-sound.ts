/**
 * Keystroke Sound
 *
 * Synthesizes a short mechanical "click" via the Web Audio API on demand —
 * no audio asset to fetch or bundle. A single AudioContext is created lazily
 * on first use (browsers block audio before a user gesture, and the first
 * keystroke of a session is that gesture).
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
    if (!Ctor) return null;
    audioContext = new Ctor();
  }
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  return audioContext;
}

export function playKeystrokeSound(isCorrect: boolean): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "square";
  oscillator.frequency.value = isCorrect ? 1400 : 220;

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.04);
}
