import { z } from "../../schema";

export const userPublicSchema = z.object({
  id: z.uuid().describe("unique identifier for the user (UUID)"),
  firstName: z.string().min(1).max(100).describe("first name of the user"),
  lastName: z.string().min(1).max(100).nullable().describe("last name of the user, can be null"),
  email: z.email().min(5).max(254).describe("email address of the user"),
  isVerified: z.boolean().describe("whether the user's email has been verified"),
  role: z.string().min(1).max(50).describe("role assigned to the user"),
  createdAt: z.string().min(1).max(32).describe("ISO 8601 creation timestamp"),
  updatedAt: z.string().min(1).max(32).describe("ISO 8601 update timestamp"),
});

export const authPayloadSchema = z.object({
  user: userPublicSchema.describe("public user payload"),
  accessToken: z.string().min(16).max(4096).describe("JWT access token"),
  refreshToken: z.string().min(16).max(4096).describe("JWT refresh token"),
  accessTokenExpiresAt: z
    .string()
    .min(1)
    .max(32)
    .describe("ISO 8601 access token expiry timestamp"),
  refreshTokenExpiresAt: z
    .string()
    .min(1)
    .max(32)
    .describe("ISO 8601 refresh token expiry timestamp"),
});

export const registerInputSchema = z.object({
  email: z.email().min(5).max(254).describe("email address to register with"),
  firstName: z.string().min(1).max(100).describe("first name of the new user"),
  lastName: z.string().min(1).max(100).optional().describe("last name of the new user (optional)"),
  password: z.string().min(8).max(128).describe("user password (min 8 chars)"),
});

export const loginInputSchema = z.object({
  email: z.email().min(5).max(254).describe("email address to login with"),
  password: z.string().min(8).max(128).describe("user password"),
});

export const refreshTokenInputSchema = z.object({
  refreshToken: z.string().min(16).max(4096).describe("JWT refresh token to exchange"),
});

export const changePasswordInputSchema = z.object({
  refreshToken: z.string().min(16).max(4096).describe("JWT refresh token proving identity"),
  currentPassword: z.string().min(8).max(128).describe("current password"),
  newPassword: z.string().min(8).max(128).describe("new password"),
});

export const changeUserDetailsInputSchema = z
  .object({
    refreshToken: z.string().min(16).max(4096).describe("JWT refresh token proving identity"),
    firstName: z.string().min(1).max(100).optional().describe("new first name (optional)"),
    lastName: z.string().min(1).max(100).optional().describe("new last name (optional)"),
    email: z.email().min(5).max(254).optional().describe("new email address (optional)"),
  })
  .refine((data) => data.firstName || data.lastName || data.email, {
    message: "At least one detail must be changed",
  })
  .describe("payload to change user details (at least one field required)");
