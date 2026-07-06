"use client";

import React from "react";
import { useSettings } from "@/features/settings/context/settings-provider";
import { Code, Hash, Sidebar, FileCode2 } from "lucide-react";

export default function CodingSettingsPage() {
  const { preferences, updateCoding, isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="bg-secondary h-8 w-48 rounded" />
        <div className="bg-secondary/50 h-32 rounded-lg" />
      </div>
    );
  }

  const { coding } = preferences;

  const languages = ["typescript", "javascript", "python", "rust", "go", "cpp"];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 duration-500">
      <div>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight">
          Coding Preferences
        </h2>
        <p className="text-muted-foreground">
          Configure the code editor layout, themes, and snippet defaults.
        </p>
      </div>

      <div className="space-y-6">
        {/* Default Language */}
        <section className="border-border/50 space-y-4 border-b pb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-md p-2">
              <FileCode2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Default Language</h3>
              <p className="text-muted-foreground text-sm">
                Select the primary language for coding practices.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => updateCoding({ defaultLanguage: lang })}
                className={`rounded-lg border px-4 py-2 capitalize transition-all ${
                  coding.defaultLanguage === lang
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border hover:bg-secondary/50 text-muted-foreground"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </section>

        {/* Tab Width */}
        <section className="border-border/50 space-y-4 border-b pb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-md p-2">
              <Hash className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Tab Width</h3>
              <p className="text-muted-foreground text-sm">
                Number of spaces for indentation.
              </p>
            </div>
          </div>

          <div className="bg-secondary flex w-fit rounded-lg p-1">
            {[2, 4, 8].map((spaces) => (
              <button
                key={spaces}
                onClick={() => updateCoding({ tabWidth: spaces })}
                className={`rounded-md px-6 py-2 text-sm font-medium transition-all ${
                  coding.tabWidth === spaces
                    ? "bg-background text-foreground shadow-sm"
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Line Numbers Toggle */}
            <div className="border-border/50 bg-secondary/20 flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary rounded-md p-2">
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-medium">Line Numbers</h3>
                  <p className="text-muted-foreground text-xs">Show gutters</p>
                </div>
              </div>
              <button
                onClick={() => updateCoding({ lineNumbers: !coding.lineNumbers })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  coding.lineNumbers ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    coding.lineNumbers ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Minimap Toggle */}
            <div className="border-border/50 bg-secondary/20 flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary rounded-md p-2">
                  <Sidebar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-medium">Editor Minimap</h3>
                  <p className="text-muted-foreground text-xs">Show overview</p>
                </div>
              </div>
              <button
                onClick={() => updateCoding({ minimap: !coding.minimap })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  coding.minimap ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    coding.minimap ? "translate-x-6" : "translate-x-1"
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
