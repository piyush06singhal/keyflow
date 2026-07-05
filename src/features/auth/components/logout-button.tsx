"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { signOut } from "@/lib/supabase/auth";
import { routes } from "@/lib/constants/routes";
import { toast } from "sonner";

interface LogoutButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

export function LogoutButton({ children, ...props }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      const result = await signOut();

      if (result.success) {
        toast.success("Logged out successfully");
        router.push(routes.login);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Button onClick={handleLogout} disabled={isPending} {...props}>
      {isPending ? "Logging out..." : children || "Logout"}
    </Button>
  );
}
