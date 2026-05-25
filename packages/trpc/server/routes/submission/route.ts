import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../../trpc";
import { submissionService } from "../../services";
import { generatePath } from "../../utils/path-generator";
import {
  CreateSubmissionSchema,
  DeleteSubmissionOutputSchema,
  SubmissionIdSchema,
  submissionPublicSchema,
  UserIdSchema,
} from "./model";

const TAGS = ["Submissions"];
const getPath = generatePath("/submissions");

export const submissionRouter = router({
  // ── POST /submissions/create ──────────────────────────────────────────────
  create: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/create"), tags: TAGS } })
    .input(CreateSubmissionSchema)
    .output(submissionPublicSchema)
    .mutation(async ({ input }) => {
      try {
        return await submissionService.createSubmission(input);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (error as Error).message,
        });
      }
    }),

  // ── GET /submissions/by-id ────────────────────────────────────────────────
  getById: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/by-id"), tags: TAGS } })
    .input(SubmissionIdSchema)
    .output(submissionPublicSchema)
    .query(async ({ input }) => {
      try {
        return await submissionService.getSubmissionById(input);
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: (error as Error).message,
        });
      }
    }),

  // ── GET /submissions/by-user ──────────────────────────────────────────────
  getByUser: publicProcedure
    .meta({
      openapi: { method: "GET", path: getPath("/by-user"), tags: TAGS },
    })
    .input(UserIdSchema)
    .output(submissionPublicSchema.array())
    .query(async ({ input }) => {
      try {
        return await submissionService.getSubmissionsByUser(input);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),

  // ── DELETE /submissions/delete ────────────────────────────────────────────
  delete: publicProcedure
    .meta({ openapi: { method: "DELETE", path: getPath("/delete"), tags: TAGS } })
    .input(SubmissionIdSchema)
    .output(DeleteSubmissionOutputSchema)
    .mutation(async ({ input }) => {
      try {
        return await submissionService.deleteSubmission(input);
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: (error as Error).message,
        });
      }
    }),
});
