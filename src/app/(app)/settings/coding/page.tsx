"use client";

import React from "react";
import { useCodingPracticeStore } from "@/stores/coding-practice-store";
import { getAccentColor } from "@/lib/accent-colors";
import { Hash, FileCode2 } from "lucide-react";
import type { ProgrammingLanguage } from "@/lib/coding-practice/types";

export default function CodingSettingsPage() {
  const config = useCodingPracticeStore((state) => state.config);
  const updateConfig = useCodingPracticeStore((state) => state.updateConfig);

  const languages: ProgrammingLanguage[] = [
    "typescript",
    "javascript",
    "python",
    "rust",
    "go",
    "cpp",
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 duration-500">
      <div>
        <h2 className="mb-2 text-2xl">Coding Preferences</h2>
        <p className="text-muted-foreground">
          Configure the code editor layout, themes, and snippet defaults.
        </p>
      </div>

      <div className="space-y-6">
        {/* Default Language */}
        <section className="border-border-subtle space-y-4 border-b-2 pb-8">
          <div className="mb-4 flex items-center gap-3">
            <div
              className={`border-border shadow-pop-sm rounded-xl border-2 p-2 ${getAccentColor(0).bg} ${getAccentColor(0).fg}`}
            >
              <FileCode2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg">Default Language</h3>
              <p className="text-muted-foreground text-sm">
                Select the primary language for coding practices.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => updateConfig({ language: lang })}
                className={`rounded-full border-2 px-4 py-2 font-bold capitalize transition-all ${
                  config.language === lang
                    ? "border-border bg-primary text-primary-foreground shadow-pop-sm"
                    : "border-border hover:bg-secondary/50 text-muted-foreground"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </section>

        {/* Tab Width */}
        <section className="border-border-subtle space-y-4 border-b-2 pb-8">
          <div className="mb-4 flex items-center gap-3">
            <div
              className={`border-border shadow-pop-sm rounded-xl border-2 p-2 ${getAccentColor(1).bg} ${getAccentColor(1).fg}`}
            >
              <Hash className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg">Tab Width</h3>
              <p className="text-muted-foreground text-sm">
                Number of spaces for indentation.
              </p>
            </div>
          </div>

          <div className="bg-muted flex w-fit rounded-full p-1.5">
            {[2, 4, 8].map((spaces) => (
              <button
                key={spaces}
                onClick={() => updateConfig({ tabSize: spaces })}
                className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                  config.tabSize === spaces
                    ? "border-border bg-primary text-primary-foreground shadow-pop-sm border-2"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {spaces} Spaces
              </button>
            ))}
          </div>
        </section>

        {/* Editor Toggles */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Line Numbers Toggle */}
            <div className="border-border bg-secondary/40 shadow-pop-sm flex items-center justify-between rounded-2xl border-2 p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`border-border shadow-pop-sm rounded-xl border-2 p-2 ${getAccentColor(2).bg} ${getAccentColor(2).fg}`}
                >
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base">Line Numbers</h3>
                  <p className="text-muted-foreground text-xs">Show gutters</p>
                </div>
              </div>
              <button
                onClick={() =>
                  updateConfig({ showLineNumbers: !config.showLineNumbers })
                }
                className={`border-border relative inline-flex h-6 w-11 items-center rounded-full border-2 transition-colors ${
                  config.showLineNumbers ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.showLineNumbers ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
