"use client";

import React from "react";
import { useSettings } from "@/features/settings/context/settings-provider";
import { Keyboard, Type, Timer, Volume2 } from "lucide-react";

export default function TypingSettingsPage() {
  const { preferences, updateTyping, isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="bg-secondary h-8 w-48 rounded" />
        <div className="bg-secondary/50 h-32 rounded-lg" />
      </div>
    );
  }

  const { typing } = preferences;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 duration-500">
      <div>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight">
          Typing Preferences
        </h2>
        <p className="text-muted-foreground">
          Tailor the typing engine exactly to your practice style.
        </p>
      </div>

      <div className="space-y-8">
        {/* Default Mode */}
        <section className="border-border/50 space-y-4 border-b pb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-md p-2">
              <Type className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Default Mode</h3>
              <p className="text-muted-foreground text-sm">
                Select your preferred practice configuration on startup.
              </p>
            </div>
          </div>

          <div className="bg-secondary flex w-fit rounded-lg p-1">
            {["time", "words", "quote"].map((mode) => (
              <button
                key={mode}
                onClick={() => updateTyping({ preferredMode: mode as any })}
                className={`rounded-md px-6 py-2 text-sm font-medium capitalize transition-all ${
                  typing.preferredMode === mode
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        {/* Default Duration */}
        <section className="border-border/50 space-y-4 border-b pb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-md p-2">
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Time Duration</h3>
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
                className={`rounded-lg border px-4 py-2 transition-all ${
                  typing.defaultDuration === time
                    ? "border-primary bg-primary/10 text-primary font-medium"
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
          <div className="border-border/50 bg-secondary/20 flex items-center justify-between rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-md p-2">
                <Volume2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-medium">Keyboard Sounds</h3>
                <p className="text-muted-foreground text-sm">
                  Play a mechanical clicking sound on every keystroke.
                </p>
              </div>
            </div>
            <button
              onClick={() => updateTyping({ soundsEnabled: !typing.soundsEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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
