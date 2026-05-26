import { protectedProcedure, router } from "../../trpc";
import { analyticsService } from "../../services";
import { handleTRPCError } from "../../utils/handleError";
import { generatePath } from "../../utils/path-generator";
import {
  AnalyticsFieldBreakdownSchema,
  AnalyticsFormIdSchema,
  AnalyticsRecentSchema,
  AnalyticsSummarySchema,
  AnalyticsTrendPointSchema,
  AnalyticsTrendSchema,
  AnalyticsFieldBreakdownResponseSchema,
  AnalyticsRecentSubmissionSchema,
} from "./model";

const TAGS = ["Analytics"];
const getPath = generatePath("/analytics");

export const analyticsRouter = router({
  getFormSummary: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/form-summary"), tags: TAGS } })
    .input(AnalyticsFormIdSchema)
    .output(AnalyticsSummarySchema)
    .query(async ({ ctx, input }) => {
      try {
        return await analyticsService.getFormSummary({ formId: input.formId, userId: ctx.user.id });
      } catch (error) {
        handleTRPCError(error, "Failed to get form summary");
      }
    }),

  getSubmissionTrend: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/submission-trend"), tags: TAGS } })
    .input(AnalyticsTrendSchema)
    .output(AnalyticsTrendPointSchema.array())
    .query(async ({ ctx, input }) => {
      try {
        return await analyticsService.getSubmissionTrend({
          formId: input.formId,
          userId: ctx.user.id,
          from: input.from,
          to: input.to,
          interval: input.interval,
        });
      } catch (error) {
        handleTRPCError(error, "Failed to get submission trend");
      }
    }),

  getRecentSubmissions: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/recent-submissions"), tags: TAGS } })
    .input(AnalyticsRecentSchema)
    .output(AnalyticsRecentSubmissionSchema.array())
    .query(async ({ ctx, input }) => {
      try {
        return await analyticsService.getRecentSubmissions({
          formId: input.formId,
          userId: ctx.user.id,
          limit: input.limit,
        });
      } catch (error) {
        handleTRPCError(error, "Failed to get recent submissions");
      }
    }),

  getFieldBreakdown: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/field-breakdown"), tags: TAGS } })
    .input(AnalyticsFieldBreakdownSchema)
    .output(AnalyticsFieldBreakdownResponseSchema.array())
    .query(async ({ ctx, input }) => {
      try {
        return await analyticsService.getFieldBreakdown({
          formId: input.formId,
          userId: ctx.user.id,
          fieldId: input.fieldId,
        });
      } catch (error) {
        handleTRPCError(error, "Failed to get field breakdown");
      }
    }),
});
