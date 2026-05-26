import { ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  icon?: ReactNode;
  action?: ReactNode;
  showRetryButton?: boolean;
}

/**
 * ErrorState Component
 * Displays a formatted error message with optional retry functionality
 * Used in forms, data loading, and API call failures
 */
export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  icon,
  action,
  showRetryButton = !!onRetry,
}: ErrorStateProps) {
  return (
    <div className="w-full p-6 rounded-lg border border-destructive/20 bg-destructive/5">
      <div className="flex gap-4">
        <div className="shrink-0">
          {icon ? (
            <div className="w-6 h-6 text-destructive flex items-center justify-center">{icon}</div>
          ) : (
            <AlertCircle className="w-6 h-6 text-destructive" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-destructive mb-1">{title}</h3>
          <p className="text-sm text-foreground/70 mb-4">{message}</p>

          <div className="flex gap-2 flex-wrap">
            {showRetryButton && onRetry && (
              <Button onClick={onRetry} size="sm" variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            )}
            {action}
          </div>
        </div>
      </div>
    </div>
  );
}
