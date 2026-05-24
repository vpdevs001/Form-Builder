import { z } from "../../schema";

export const userPublicSchema = z.object({
  id: z.string().uuid().describe("unique identifier for the user"),
  firstName: z.string(),
  lastName: z.string().nullable(),
  email: z.email(),
  isVerified: z.boolean(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const authPayloadSchema = z.object({
  user: userPublicSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  accessTokenExpiresAt: z.string(),
  refreshTokenExpiresAt: z.string(),
});

export const registerInputSchema = z.object({
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  password: z.string().min(8),
});

export const loginInputSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const refreshTokenInputSchema = z.object({
  refreshToken: z.string().min(1),
});

export const changePasswordInputSchema = z.object({
  refreshToken: z.string().min(1),
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export const changeUserDetailsInputSchema = z
  .object({
    refreshToken: z.string().min(1),
    firstName: z.string().min(1).optional(),
    lastName: z.string().optional(),
    email: z.email().optional(),
  })
  .refine((data) => data.firstName || data.lastName || data.email, {
    message: "At least one detail must be changed",
  });
