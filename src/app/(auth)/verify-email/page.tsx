"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AuthFormWrapper } from "@/features/auth/components/auth-form-wrapper";
import { resendVerificationEmail } from "@/lib/supabase/auth";
import { routes } from "@/lib/constants/routes";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const handleResend = () => {
    if (!email) {
      toast.error("Email address not found");
      return;
    }

    startTransition(async () => {
      const result = await resendVerificationEmail(email);

      if (result.success) {
        toast.success("Verification email sent!");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <AuthFormWrapper
      title="Verify your email"
      description="We've sent a verification link to your email address. Please check your inbox and click the link to verify your account."
    >
      <div className="space-y-4">
        <div className="border-border bg-muted/50 rounded-lg border p-4 text-center">
          <p className="text-muted-foreground text-sm">
            {email ? `Email sent to ${email}` : "Check your email inbox"}
          </p>
        </div>

        {email && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={isPending}
          >
            {isPending ? "Resending..." : "Resend verification email"}
          </Button>
        )}

        <Link href={routes.login} className="block">
          <Button type="button" variant="ghost" className="w-full">
            Back to login
          </Button>
        </Link>
      </div>
    </AuthFormWrapper>
  );
}
