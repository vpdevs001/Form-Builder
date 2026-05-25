import { sign, verify, type JwtPayload } from "jsonwebtoken";
import { env } from "../env";
import type { UserPublic } from "./types";
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "./constants";

export function createAccessToken(user: UserPublic): string {
  return sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  );
}

export function createRefreshToken(userId: string): string {
  return sign({ sub: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

export function verifyRefreshToken(token: string): JwtPayload & { sub: string } {
  return verify(token, env.JWT_REFRESH_SECRET) as JwtPayload & { sub: string };
}

export function verifyAccessToken(token: string): JwtPayload & { sub: string, email: string, role: string, firstName: string, lastName: string } {
  return verify(token, env.JWT_ACCESS_SECRET) as JwtPayload & { sub: string, email: string, role: string, firstName: string, lastName: string };
}
