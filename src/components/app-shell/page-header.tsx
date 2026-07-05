import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4 pt-6 pb-8", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl leading-tight font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-[15px] leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-2.5">{children}</div>}
      </div>
    </div>
  );
}
