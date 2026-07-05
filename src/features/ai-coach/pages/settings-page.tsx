"use client";

import { useEffect, useState } from "react";
import { PageContainer, PageHeader } from "@/components/app-shell";
import { useAiCoach } from "@/features/ai-coach/hooks/use-ai-coach";
import {
  AiCoachNav,
  AISettingsPanel,
  AiLoadingSkeleton,
} from "@/features/ai-coach/components";
import type { AiUserPreferences } from "@/features/ai-coach/types";
import { toast } from "sonner";

export function AiCoachSettingsPage() {
  const { getPreferences, updatePreferences, isLoading } = useAiCoach();
  const [preferences, setPreferences] = useState<AiUserPreferences | null>(null);
  const [draft, setDraft] = useState<Partial<AiUserPreferences>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getPreferences().then((prefs) => {
      if (prefs) {
        setPreferences(prefs);
        setDraft(prefs);
      }
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updatePreferences(draft);
    setIsSaving(false);
    if (result) {
      setPreferences(result as AiUserPreferences);
      toast.success("AI Coach settings saved");
    } else {
      toast.error("Failed to save settings");
    }
  };

  return (
    <PageContainer maxWidth="md">
      <PageHeader title="AI Settings" description="Configure your AI coaching experience." />
      <AiCoachNav />

      <div className="mt-6">
        {isLoading && !preferences ? (
          <AiLoadingSkeleton />
        ) : preferences ? (
          <AISettingsPanel
            preferences={{ ...preferences, ...draft } as AiUserPreferences}
            onChange={(updates) => setDraft((prev) => ({ ...prev, ...updates }))}
            onSave={handleSave}
            isSaving={isSaving}
          />
        ) : null}
      </div>
    </PageContainer>
  );
}
