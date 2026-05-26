'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '~/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for monitoring/debugging
    console.error('Error caught by error boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#060913] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="w-16 h-16 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Oops! Something went wrong
          </h1>
          <p className="text-foreground/60 text-base">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
        </div>

        {error.message && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-left">
            <p className="text-sm text-destructive/90 font-mono wrap-break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-center pt-4">
          <Button 
            onClick={reset} 
            variant="default"
            className="bg-primary hover:bg-primary/90"
          >
            Try Again
          </Button>
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="outline"
          >
            Go Home
          </Button>
        </div>

        {error.digest && (
          <p className="text-xs text-foreground/40 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
