import { AlertCircle } from "lucide-react";

export interface FormErrorProps {
  message?: string;
  errors?: Record<string, string | string[]>;
}

/**
 * FormError Component
 * Displays form-level error messages
 * Can show both general errors and field-specific errors
 */
export function FormError({ message, errors }: FormErrorProps) {
  if (!message && !errors) {
    return null;
  }

  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-4">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <div className="flex-1">
          {message && <p className="text-sm font-medium text-destructive mb-2">{message}</p>}

          {errors && Object.keys(errors).length > 0 && (
            <ul className="space-y-1">
              {Object.entries(errors).map(([field, errorMessages]) => {
                const messages = Array.isArray(errorMessages) ? errorMessages : [errorMessages];
                return (
                  <li key={field}>
                    <p className="text-sm text-destructive/90">
                      <span className="font-medium">{field}:</span> {messages.join(", ")}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * FieldError Component
 * Displays error for a single form field
 */
export function FieldError({ error }: { error?: string }) {
  if (!error) {
    return null;
  }

  return (
    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {error}
    </p>
  );
}
