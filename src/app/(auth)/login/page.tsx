"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFormWrapper } from "@/features/auth/components/auth-form-wrapper";
import { OAuthButtons } from "@/features/auth/components/oauth-buttons";
import { AuthDivider } from "@/features/auth/components/auth-divider";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { signInWithEmail } from "@/lib/supabase/auth";
import { routes } from "@/lib/constants/routes";
import { toast } from "sonner";
import { useRedirectIfAuthenticated } from "@/hooks/use-auth";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? routes.dashboard;

  useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    startTransition(async () => {
      const result = await signInWithEmail(data);

      if (result.success) {
        toast.success("Welcome back!");
        router.push(redirectTo);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <AuthFormWrapper
      title="Welcome back"
      description="Sign in to your account to continue"
      footer={{
        text: "Don't have an account?",
        linkText: "Sign up",
        linkHref: routes.register,
      }}
    >
      <OAuthButtons redirectTo={redirectTo} />

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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-primary text-sm hover:underline focus-visible:underline"
              tabIndex={isPending ? -1 : 0}
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
