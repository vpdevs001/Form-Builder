import { TRPCError } from "@trpc/server";
import { logger } from "../../../logger";

export function handleTRPCError(error: unknown, contextMessage?: string): never {
  if (error instanceof TRPCError) throw error;

  const msg = contextMessage ?? (error as Error)?.message ?? "Internal server error";
  try {
    logger.error(msg, {
      error:
        error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
    });
  } catch {
    // swallow logger errors
  }

  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: msg });
}

export default handleTRPCError;
