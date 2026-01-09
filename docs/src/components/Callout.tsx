import type { ReactNode } from "react";
import { cn } from "../lib/utils";

interface CalloutProps {
  title?: string;
  children: ReactNode;
  type?: "default" | "warn" | "error" | "info";
  className?: string;
}

export function Callout({
  title,
  children,
  type = "default",
  className,
}: CalloutProps) {
  const styles = {
    default: "bg-muted/50 border-muted-foreground/20 text-muted-foreground",
    warn: "bg-yellow-500/10 border-yellow-500/50 text-yellow-600 dark:text-yellow-400",
    error: "bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400",
    info: "bg-blue-500/10 border-blue-500/50 text-blue-600 dark:text-blue-400",
  };

  return (
    <div
      className={cn(
        "my-4 overflow-hidden rounded-lg border p-4 shadow-sm",
        styles[type],
        className
      )}
    >
      {title && (
        <div className="mb-2 flex items-center gap-2 font-semibold">
          {title}
        </div>
      )}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
