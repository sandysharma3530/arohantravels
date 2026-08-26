import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title = "Nothing here yet",
  description = "Check back soon — new content may be on the way.",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-text-muted/30 bg-bg-light px-6 py-12 text-center",
        className,
      )}
      role="status"
    >
      <Inbox className="mb-4 h-10 w-10 text-text-muted" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-text-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
