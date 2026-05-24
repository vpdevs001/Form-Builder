import type { User } from "@repo/database/schema";
import type { UserPublic } from "./types";

export function toPublicUser(user: User): UserPublic {
  const { passwordHash, createdAt, updatedAt, ...publicUser } = user;
  return {
    ...publicUser,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}
