"use client";

import React from "react";
import { useSettingsStore } from "@/stores/settings-store";
import { getAccentColor } from "@/lib/accent-colors";
import { Type, Timer, Volume2 } from "lucide-react";

export default function TypingSettingsPage() {
  const typing = useSettingsStore((state) => state.typing);
  const updateTyping = useSettingsStore((state) => state.updateTyping);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 duration-500">
      <div>
        <h2 className="mb-2 text-2xl">Typing Preferences</h2>
        <p className="text-muted-foreground">
          Tailor the typing engine exactly to your practice style.
        </p>
      </div>

      <div className="space-y-8">
        {/* Default Mode */}
        <section className="border-border-subtle space-y-4 border-b-2 pb-8">
          <div className="mb-4 flex items-center gap-3">
            <div
              className={`border-border shadow-pop-sm rounded-xl border-2 p-2 ${getAccentColor(0).bg} ${getAccentColor(0).fg}`}
            >
              <Type className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg">Default Mode</h3>
              <p className="text-muted-foreground text-sm">
                Select your preferred practice configuration on startup.
              </p>
            </div>
          </div>

          <div className="bg-muted flex w-fit rounded-full p-1.5">
            {["time", "words", "quote"].map((mode) => (
              <button
                key={mode}
                onClick={() => updateTyping({ preferredMode: mode as any })}
                className={`rounded-full px-6 py-2 text-sm font-bold capitalize transition-all ${
                  typing.preferredMode === mode
                    ? "border-border bg-primary text-primary-foreground shadow-pop-sm border-2"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        {/* Default Duration */}
        <section className="border-border-subtle space-y-4 border-b-2 pb-8">
          <div className="mb-4 flex items-center gap-3">
            <div
              className={`border-border shadow-pop-sm rounded-xl border-2 p-2 ${getAccentColor(1).bg} ${getAccentColor(1).fg}`}
            >
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg">Time Duration</h3>
              <p className="text-muted-foreground text-sm">
                Default timer for time-based practices.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {[15, 30, 60, 120].map((time) => (
              <button
                key={time}
                onClick={() => updateTyping({ defaultDuration: time })}
                className={`rounded-full border-2 px-4 py-2 font-bold transition-all ${
                  typing.defaultDuration === time
                    ? "border-border bg-primary text-primary-foreground shadow-pop-sm"
                    : "border-border hover:bg-secondary/50 text-muted-foreground"
                }`}
              >
                {time}s
              </button>
            ))}
          </div>
        </section>

        {/* Typing Sounds */}
        <section className="space-y-4">
          <div className="border-border bg-secondary/40 shadow-pop-sm flex items-center justify-between rounded-2xl border-2 p-4">
            <div className="flex items-center gap-3">
              <div
                className={`border-border shadow-pop-sm rounded-xl border-2 p-2 ${getAccentColor(2).bg} ${getAccentColor(2).fg}`}
              >
                <Volume2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base">Keyboard Sounds</h3>
                <p className="text-muted-foreground text-sm">
                  Play a mechanical clicking sound on every keystroke.
                </p>
              </div>
            </div>
            <button
              onClick={() => updateTyping({ soundsEnabled: !typing.soundsEnabled })}
              className={`border-border relative inline-flex h-6 w-11 items-center rounded-full border-2 transition-colors ${
                typing.soundsEnabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  typing.soundsEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
