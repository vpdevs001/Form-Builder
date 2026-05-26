'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log critical error
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <html>
      <body className="bg-[#060913] text-foreground">
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="flex justify-center">
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Critical Error
              </h1>
              <p className="text-foreground/60 text-base">
                A critical error has occurred. The application encountered an unexpected issue.
              </p>
            </div>

            {error.message && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-left">
                <p className="text-sm text-red-500/90 font-mono wrap-break-words">
                  {error.message}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center pt-4 flex-wrap">
              <button 
                onClick={() => reset()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-foreground/10 text-foreground rounded-lg hover:bg-foreground/20 transition font-medium"
              >
                Home
              </button>
            </div>

            {error.digest && (
              <p className="text-xs text-foreground/40 font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
