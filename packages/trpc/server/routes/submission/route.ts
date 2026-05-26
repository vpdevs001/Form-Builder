import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { submissionService } from "../../services";
import { generatePath } from "../../utils/path-generator";
import {
  CreateSubmissionSchema,
  DeleteSubmissionOutputSchema,
  FormIdSchema,
  SubmissionIdSchema,
  submissionPublicSchema,
  UserIdSchema,
} from "./model";
import { handleTRPCError } from "../../utils/handleError";

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
        handleTRPCError(error, "Failed to create submission");
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
        handleTRPCError(error, "Failed to get submission by id");
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
        handleTRPCError(error, "Failed to get submissions by user");
      }
    }),

  getByFormId: protectedProcedure
    .meta({
      openapi: { method: "GET", path: getPath("/by-form-id"), tags: TAGS },
    })
    .input(FormIdSchema)
    .output(submissionPublicSchema.array())
    .query(async ({ ctx, input }) => {
      try {
        return await submissionService.getSubmissionsByFormId({
          formId: input.id,
          userId: ctx.user.id,
        });
      } catch (error) {
        handleTRPCError(error, "Unauthorized to get submissions by form id");
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
        handleTRPCError(error, "Failed to delete submission");
      }
    }),
});
