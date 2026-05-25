import { z } from "../../schema";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { userService } from "../../services";
import { generatePath } from "../../utils/path-generator";
import {
  authPayloadSchema,
  changePasswordInputSchema,
  changeUserDetailsInputSchema,
  loginInputSchema,
  refreshTokenInputSchema,
  registerInputSchema,
  userPublicSchema,
} from "./model";
import { handleTRPCError } from "../../utils/handleError";

const TAGS = ["Authentication"];
const getPath = generatePath("/auth");

export const authRouter = router({
  register: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/register"), tags: TAGS } })
    .input(registerInputSchema)
    .output(userPublicSchema)
    .mutation(async ({ input }) => {
      try {
        return await userService.register(input);
      } catch (error) {
        handleTRPCError(error, "Failed to register user");
      }
    }),

  login: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/login"), tags: TAGS } })
    .input(loginInputSchema)
    .output(authPayloadSchema)
    .mutation(async ({ input }) => {
      try {
        return await userService.login(input);
      } catch (error) {
        handleTRPCError(error, "Failed to login user");
      }
    }),

  logout: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/logout"), tags: TAGS } })
    .input(refreshTokenInputSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      try {
        return { success: await userService.logout(input) };
      } catch (error) {
        handleTRPCError(error, "Failed to logout user");
      }
    }),

  refresh: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/refresh"), tags: TAGS } })
    .input(refreshTokenInputSchema)
    .output(authPayloadSchema)
    .mutation(async ({ input }) => {
      try {
        return await userService.refresh(input);
      } catch (error) {
        handleTRPCError(error, "Failed to refresh token");
      }
    }),

  changePassword: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/change-password"), tags: TAGS } })
    .input(changePasswordInputSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      try {
        return { success: await userService.changePassword(input) };
      } catch (error) {
        handleTRPCError(error, "Failed to change password");
      }
    }),

  changeUserDetails: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/change-user-details"), tags: TAGS } })
    .input(changeUserDetailsInputSchema)
    .output(userPublicSchema)
    .mutation(async ({ input }) => {
      try {
        return await userService.changeUserDetails(input);
      } catch (error) {
        handleTRPCError(error, "Failed to change user details");
      }
    }),
});
