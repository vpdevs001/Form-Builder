import * as trpcExpress from "@trpc/server/adapters/express";
import { verifyAccessToken } from "@repo/services/auth";
import { logger } from "../../logger";

export function parseCookies(cookieHeader?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const name = parts[0]?.trim();
    const value = parts.slice(1).join("=");
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  return cookies;
}

export async function createContext({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions): Promise<{
  req: any;
  res: any;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
}> {
  let user = null;
  const authHeader = req?.headers?.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token && req?.headers?.cookie) {
    const cookies = parseCookies(req.headers.cookie);
    token = cookies["accessToken"];
  }

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
      };
    } catch (error) {
      logger.warn("Invalid or expired token", {
        error: error instanceof Error ? { message: error.message } : String(error),
      });
      user = null;
    }
  }

  return { req, res, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
