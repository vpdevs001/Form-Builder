import { logger } from "../logger";

export class ServiceError extends Error {
  public cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "ServiceError";
    this.cause = cause;
  }
}

export function handleServiceError(error: unknown, contextMessage?: string): never {
  if (error instanceof ServiceError) throw error;

  const msg = contextMessage ?? (error as Error)?.message ?? "Service error";
  try {
    logger.error(msg, {
      error:
        error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
    });
  } catch {
    // ignore logging failures
  }

  throw new ServiceError(msg, error);
}

export default ServiceError;
