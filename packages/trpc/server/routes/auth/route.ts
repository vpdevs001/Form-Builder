import { z } from "../../schema";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../../trpc";
import { userService } from "../../services";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Authentication"];
const getPath = generatePath("/auth");

const userPublicSchema = z.object({
  id: z.string().uuid().describe("unique identifier for the user"),
  firstName: z.string(),
  lastName: z.string().nullable(),
  email: z.string().email(),
  isVerified: z.boolean(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const authPayloadSchema = z.object({
  user: userPublicSchema,
  refreshToken: z.string(),
  refreshTokenExpiresAt: z.string(),
});

export const authRouter = router({
  register: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/register"), tags: TAGS } })
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string().min(1),
        lastName: z.string().optional(),
        password: z.string().min(8),
      }),
    )
    .output(userPublicSchema)
    .mutation(async ({ input }) => {
      try {
        return await userService.register(input);
      } catch (error) {
        throw new TRPCError({ code: "CONFLICT", message: (error as Error).message });
      }
    }),

  login: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/login"), tags: TAGS } })
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      }),
    )
    .output(authPayloadSchema)
    .mutation(async ({ input }) => {
      try {
        return await userService.login(input);
      } catch (error) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: (error as Error).message });
      }
    }),

  logout: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/logout"), tags: TAGS } })
    .input(z.object({ refreshToken: z.string().min(1) }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      try {
        return { success: await userService.logout(input) };
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST", message: (error as Error).message });
      }
    }),

  refresh: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/refresh"), tags: TAGS } })
    .input(z.object({ refreshToken: z.string().min(1) }))
    .output(authPayloadSchema)
    .mutation(async ({ input }) => {
      try {
        return await userService.refresh(input);
      } catch (error) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: (error as Error).message });
      }
    }),

  changePassword: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/change-password"), tags: TAGS } })
    .input(
      z.object({
        refreshToken: z.string().min(1),
        currentPassword: z.string().min(8),
        newPassword: z.string().min(8),
      }),
    )
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      try {
        return { success: await userService.changePassword(input) };
      } catch (error) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: (error as Error).message });
      }
    }),

  changeUserDetails: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/change-user-details"), tags: TAGS } })
    .input(
      z
        .object({
          refreshToken: z.string().min(1),
          firstName: z.string().min(1).optional(),
          lastName: z.string().optional(),
          email: z.string().email().optional(),
        })
        .refine((data) => data.firstName || data.lastName || data.email, {
          message: "At least one detail must be changed",
        }),
    )
    .output(userPublicSchema)
    .mutation(async ({ input }) => {
      try {
        return await userService.changeUserDetails(input);
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST", message: (error as Error).message });
      }
    }),
});
