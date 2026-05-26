import { z } from "../../schema";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { userService } from "../../services";
import { generatePath } from "../../utils/path-generator";
import { parseCookies } from "../../context";
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
    .mutation(async ({ input, ctx }) => {
      try {
        const payload = await userService.login(input);

        // Set secure HTTP-Only cookies
        ctx.res.cookie("accessToken", payload.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          expires: new Date(payload.accessTokenExpiresAt),
        });
        ctx.res.cookie("refreshToken", payload.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          expires: new Date(payload.refreshTokenExpiresAt),
        });

        return payload;
      } catch (error) {
        handleTRPCError(error, "Failed to login user");
      }
    }),

  logout: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/logout"), tags: TAGS } })
    .input(refreshTokenInputSchema.partial())
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      try {
        let token = input?.refreshToken;
        if (!token && ctx.req?.headers?.cookie) {
          const cookies = parseCookies(ctx.req.headers.cookie);
          token = cookies["refreshToken"];
        }
        if (!token) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Refresh token is required" });
        }
        const success = await userService.logout({ refreshToken: token });

        // Clear cookies
        ctx.res.clearCookie("accessToken", { path: "/" });
        ctx.res.clearCookie("refreshToken", { path: "/" });

        return { success };
      } catch (error) {
        handleTRPCError(error, "Failed to logout user");
      }
    }),

  refresh: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/refresh"), tags: TAGS } })
    .input(refreshTokenInputSchema.partial())
    .output(authPayloadSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        let token = input?.refreshToken;
        if (!token && ctx.req?.headers?.cookie) {
          const cookies = parseCookies(ctx.req.headers.cookie);
          token = cookies["refreshToken"];
        }
        if (!token) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Refresh token is required" });
        }
        const payload = await userService.refresh({ refreshToken: token });

        // Set cookies
        ctx.res.cookie("accessToken", payload.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          expires: new Date(payload.accessTokenExpiresAt),
        });
        ctx.res.cookie("refreshToken", payload.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          expires: new Date(payload.refreshTokenExpiresAt),
        });

        return payload;
      } catch (error) {
        handleTRPCError(error, "Failed to refresh token");
      }
    }),

  me: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/me"), tags: TAGS } })
    .output(userPublicSchema.nullable())
    .query(async ({ ctx }) => {
      if (!ctx.user) return null;
      try {
        return await userService.getUserById(ctx.user.id);
      } catch (error) {
        return null;
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
