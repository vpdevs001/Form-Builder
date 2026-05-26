import { Loader2 } from "lucide-react";
import { ErrorState, type ErrorStateProps } from "./error-state";

export interface DataLoaderProps extends Omit<ErrorStateProps, "onRetry" | "showRetryButton"> {
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | string | null;
  children?: React.ReactNode;
  onRetry?: () => void;
}

/**
 * DataLoader Component
 * Handles loading, error, and success states for data fetching
 * Shows spinner during loading, error state on failure, children on success
 */
export function DataLoader({
  isLoading,
  isError,
  error,
  children,
  onRetry,
  title,
  message,
  icon,
  action,
}: DataLoaderProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      typeof error === "string" ? error : error?.message || "Failed to load data";

    return (
      <ErrorState
        title={title || "Failed to load"}
        message={message || errorMessage}
        onRetry={onRetry}
        icon={icon}
        action={action}
      />
    );
  }

  return <>{children}</>;
}

/**
 * LoadingSpinner Component
 * Simple loading indicator
 */
export function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

/**
 * EmptyState Component
 * Shows when no data is available
 */
export function EmptyState({
  title = "No data",
  message = "Nothing to display here",
  action,
}: {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
        {action && <div className="pt-3">{action}</div>}
      </div>
    </div>
  );
}
