"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFormWrapper } from "@/features/auth/components/auth-form-wrapper";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";
import { sendPasswordResetEmail } from "@/lib/supabase/auth";
import { routes } from "@/lib/constants/routes";
import { toast } from "sonner";
import { useRedirectIfAuthenticated } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [emailSent, setEmailSent] = React.useState(false);

  useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    startTransition(async () => {
      const result = await sendPasswordResetEmail(data);

      if (result.success) {
        setEmailSent(true);
        toast.success("Password reset link sent! Please check your email.");
      } else {
        toast.error(result.error);
      }
    });
  };

  if (emailSent) {
    return (
      <AuthFormWrapper
        title="Check your email"
        description="We've sent you a password reset link. Please check your inbox and follow the instructions."
      >
        <div className="space-y-4">
          <div className="border-border bg-muted/50 rounded-lg border p-4 text-center">
            <p className="text-muted-foreground text-sm">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setEmailSent(false)}
          >
            Try different email
          </Button>

          <Link href={routes.login} className="block">
            <Button type="button" variant="ghost" className="w-full">
              Back to login
            </Button>
          </Link>
        </div>
      </AuthFormWrapper>
    );
  }

  return (
    <AuthFormWrapper
      title="Forgot password?"
      description="Enter your email address and we'll send you a link to reset your password."
      footer={{
        text: "Remember your password?",
        linkText: "Sign in",
        linkHref: routes.login,
      }}
    >
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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
