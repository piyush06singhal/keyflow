import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";

export default function SessionExpiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="surface-card w-full max-w-md space-y-6 rounded-2xl p-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Session Expired</h1>
          <p className="text-muted-foreground text-sm">
            Your session has expired for security reasons. Please sign in again to
            continue.
          </p>
        </div>

        <Link href={routes.login}>
          <Button className="w-full">Sign in again</Button>
        </Link>
      </div>
    </div>
  );
}
