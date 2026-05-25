import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../../trpc";
import { submissionValueService } from "../../services";
import { generatePath } from "../../utils/path-generator";
import {
  CreateSubmissionValueSchema,
  SubmissionIdSchema,
  FieldIdSchema,
  submissionValuePublicSchema,
} from "./model";

const TAGS = ["Submission Values"];
const getPath = generatePath("/submission-values");

export const submissionValueRouter = router({
  create: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/create"), tags: TAGS } })
    .input(CreateSubmissionValueSchema)
    .output(submissionValuePublicSchema)
    .mutation(async ({ input }) => {
      try {
        return await submissionValueService.createSubmissionValue(input);
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST", message: (error as Error).message });
      }
    }),

  getBySubmissionId: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/by-submission-id"), tags: TAGS } })
    .input(SubmissionIdSchema)
    .output(submissionValuePublicSchema.array())
    .query(async ({ input }) => {
      try {
        return await submissionValueService.getValuesBySubmissionId(input);
      } catch (error) {
        throw new TRPCError({ code: "NOT_FOUND", message: (error as Error).message });
      }
    }),

  getByFieldId: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/by-field-id"), tags: TAGS } })
    .input(FieldIdSchema)
    .output(submissionValuePublicSchema.array())
    .query(async ({ input }) => {
      try {
        return await submissionValueService.getValuesByFieldId(input);
      } catch (error) {
        throw new TRPCError({ code: "NOT_FOUND", message: (error as Error).message });
      }
    }),
});
