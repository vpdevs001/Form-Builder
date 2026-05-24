import type { User } from "@repo/database/schema";

export type UserPublic = Omit<User, "passwordHash" | "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type RegisterInput = {
  email: string;
  firstName: string;
  lastName?: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RefreshTokenInput = {
  refreshToken: string;
};

export type ChangePasswordInput = {
  refreshToken: string;
  currentPassword: string;
  newPassword: string;
};

export type ChangeUserDetailsInput = {
  refreshToken: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type AuthPayload = {
  user: UserPublic;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
};
