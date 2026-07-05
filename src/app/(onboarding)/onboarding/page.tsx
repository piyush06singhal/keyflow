"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { onboardingSchema, type OnboardingInput } from "@/lib/validations/auth";
import { completeOnboarding } from "@/lib/supabase/profile";
import { routes } from "@/lib/constants/routes";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export default function OnboardingPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingInput>({
    // @ts-ignore - Zod schema inference issue with optional fields
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      displayName: "",
      preferredLanguage: "en",
      typingExperience: "beginner",
      programmingExperience: "none",
      dailyGoal: 30,
      preferredTheme: "system",
      keyboardLayout: "qwerty",
      aiEnabled: false,
    },
  });

  const onSubmit = (data: OnboardingInput) => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    startTransition(async () => {
      const result = await completeOnboarding(user.id, data);

      if (result.success) {
        toast.success("Welcome to KeyFlow!");
        router.push(routes.dashboard);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="surface-card w-full max-w-2xl space-y-6 rounded-2xl p-8"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to KeyFlow</h1>
          <p className="text-muted-foreground text-sm">
            Let's personalize your experience to help you reach your goals
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>

            <div className="space-y-2">
              <Label htmlFor="displayName">
                Display Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="displayName"
                placeholder="How should we call you?"
                disabled={isPending}
                {...register("displayName")}
                aria-invalid={!!errors.displayName}
              />
              {errors.displayName && (
                <p className="text-destructive text-sm" role="alert">
                  {errors.displayName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username (optional)</Label>
              <Input
                id="username"
                placeholder="yourusername"
                disabled={isPending}
                {...register("username")}
                aria-invalid={!!errors.username}
              />
              {errors.username && (
                <p className="text-destructive text-sm" role="alert">
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Your Experience</h2>

            <div className="space-y-2">
              <Label htmlFor="typingExperience">Typing Experience</Label>
              <Select
                value={watch("typingExperience")}
                onValueChange={(value) =>
                  setValue(
                    "typingExperience",
                    value as "beginner" | "intermediate" | "advanced",
                  )
                }
                disabled={isPending}
              >
                <SelectTrigger id="typingExperience">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="programmingExperience">Programming Experience</Label>
              <Select
                value={watch("programmingExperience")}
                onValueChange={(value) =>
                  setValue(
                    "programmingExperience",
                    value as "none" | "beginner" | "intermediate" | "advanced",
                  )
                }
                disabled={isPending}
              >
                <SelectTrigger id="programmingExperience">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Preferences</h2>

            <div className="space-y-2">
              <Label htmlFor="dailyGoal">Daily Goal (minutes)</Label>
              <Input
                id="dailyGoal"
                type="number"
                min="5"
                max="240"
                disabled={isPending}
                {...register("dailyGoal", { valueAsNumber: true })}
                aria-invalid={!!errors.dailyGoal}
              />
              {errors.dailyGoal && (
                <p className="text-destructive text-sm" role="alert">
                  {errors.dailyGoal.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredTheme">Theme</Label>
              <Select
                value={watch("preferredTheme")}
                onValueChange={(value) =>
                  setValue("preferredTheme", value as "light" | "dark" | "system")
                }
                disabled={isPending}
              >
                <SelectTrigger id="preferredTheme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyboardLayout">Keyboard Layout</Label>
              <Select
                value={watch("keyboardLayout")}
                onValueChange={(value) => setValue("keyboardLayout", value)}
                disabled={isPending}
              >
                <SelectTrigger id="keyboardLayout">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qwerty">QWERTY</SelectItem>
                  <SelectItem value="dvorak">Dvorak</SelectItem>
                  <SelectItem value="colemak">Colemak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push(routes.dashboard)}
              disabled={isPending}
            >
              Skip for now
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? "Getting started..." : "Get started"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
