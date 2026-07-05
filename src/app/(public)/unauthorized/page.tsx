import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="surface-card w-full max-w-md space-y-6 rounded-2xl p-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">401</h1>
          <h2 className="text-2xl font-semibold">Unauthorized</h2>
          <p className="text-muted-foreground text-sm">
            You don't have permission to access this resource.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href={routes.login}>
            <Button className="w-full">Sign in</Button>
          </Link>
          <Link href={routes.home}>
            <Button variant="outline" className="w-full">
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
