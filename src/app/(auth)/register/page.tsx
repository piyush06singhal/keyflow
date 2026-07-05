"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFormWrapper } from "@/features/auth/components/auth-form-wrapper";
import { OAuthButtons } from "@/features/auth/components/oauth-buttons";
import { AuthDivider } from "@/features/auth/components/auth-divider";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { signUpWithEmail } from "@/lib/supabase/auth";
import { routes } from "@/lib/constants/routes";
import { toast } from "sonner";
import { useRedirectIfAuthenticated } from "@/hooks/use-auth";

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    startTransition(async () => {
      const result = await signUpWithEmail(data);

      if (result.success) {
        toast.success(
          "Account created successfully! Please check your email to verify your account.",
        );
        router.push(routes.login);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <AuthFormWrapper
      title="Create an account"
      description="Start your journey to mastering typing and coding"
      footer={{
        text: "Already have an account?",
        linkText: "Sign in",
        linkHref: routes.login,
      }}
    >
      <OAuthButtons />

      <AuthDivider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isPending}
            {...register("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-destructive text-sm" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
            {...register("password")}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p id="password-error" className="text-destructive text-sm" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
            {...register("confirmPassword")}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
          />
          {errors.confirmPassword && (
            <p
              id="confirm-password-error"
              className="text-destructive text-sm"
              role="alert"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-muted-foreground text-center text-xs">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>
    </AuthFormWrapper>
  );
}
