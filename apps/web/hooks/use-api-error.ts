import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseApiErrorOptions {
  showToast?: boolean;
  onError?: (error: Error) => void;
}

/**
 * useApiError Hook
 * Handles API errors with optional toast notifications and retry logic
 */
export function useApiError({ showToast = true, onError }: UseApiErrorOptions = {}) {
  const [error, setError] = useState<Error | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = useCallback(
    (err: unknown, customMessage?: string) => {
      const error = err instanceof Error ? err : new Error(String(err) || "Unknown error");

      setError(error);

      if (showToast) {
        const message = customMessage || error.message || "An error occurred";
        toast.error(message);
      }

      onError?.(error);
    },
    [showToast, onError],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retry = useCallback(
    async (retryFn: () => Promise<void>) => {
      try {
        setIsRetrying(true);
        setError(null);
        await retryFn();
      } catch (err) {
        handleError(err, "Retry failed. Please try again.");
      } finally {
        setIsRetrying(false);
      }
    },
    [handleError],
  );

  return {
    error,
    isRetrying,
    handleError,
    clearError,
    retry,
    hasError: error !== null,
  };
}

/**
 * extractErrorMessage Hook
 * Extracts error message from various error types
 */
export function useExtractErrorMessage(error: unknown): string {
  if (!error) return "";

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "An unexpected error occurred";
}
