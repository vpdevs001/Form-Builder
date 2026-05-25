import { z } from "zod";

export const AnalyticsIntervalEnum = z.enum(["DAY", "WEEK", "MONTH"]);

export const AnalyticsFormIdSchema = z.object({
  formId: z.string().uuid().describe("ID of the form to analyze"),
});

export const AnalyticsTrendSchema = AnalyticsFormIdSchema.extend({
  from: z.string().datetime().optional().describe("Start of the analytics date range"),
  to: z.string().datetime().optional().describe("End of the analytics date range"),
  interval: AnalyticsIntervalEnum.default("DAY").describe("Time interval for grouping submissions"),
});

export const AnalyticsRecentSchema = AnalyticsFormIdSchema.extend({
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10)
    .describe("Maximum number of recent submissions to return"),
});

export const AnalyticsFieldBreakdownSchema = AnalyticsFormIdSchema.extend({
  fieldId: z
    .string()
    .uuid()
    .optional()
    .describe("Optional field ID to narrow the breakdown to a single question"),
});

export const AnalyticsSummarySchema = z.object({
  formId: z.string().uuid().describe("ID of the analyzed form"),
  totalSubmissions: z.number().int().describe("Total number of form submissions"),
  uniqueRespondentEmails: z.number().int().describe("Count of distinct respondent emails"),
  firstSubmissionAt: z.string().nullable().describe("First submission timestamp in ISO 8601"),
  lastSubmissionAt: z.string().nullable().describe("Last submission timestamp in ISO 8601"),
  responseLimit: z.number().nullable().describe("The form response limit, if configured"),
  responsesRemaining: z
    .number()
    .nullable()
    .describe("Number of remaining responses until the form closes"),
  acceptsResponses: z.boolean().describe("Whether the form is currently accepting responses"),
  isExpired: z.boolean().describe("Whether the form has expired"),
  publishedAt: z.string().nullable().describe("Publication timestamp in ISO 8601"),
});

export const AnalyticsTrendPointSchema = z.object({
  period: z.string().describe("Period label for the time bucket"),
  count: z.number().int().describe("Submission count in the bucket"),
});

export const AnalyticsRecentSubmissionSchema = z.object({
  id: z.string().uuid().describe("Submission ID"),
  formId: z.string().uuid().describe("Form ID"),
  submittedBy: z.string().uuid().nullable().describe("ID of the user who submitted, if any"),
  ipAddress: z.string().describe("Submitter IP address"),
  userAgent: z.string().nullable().describe("Submitter user agent"),
  respondentEmail: z.string().email().nullable().describe("Email captured from the submission"),
  createdAt: z.string().describe("Submission creation timestamp in ISO 8601"),
});

export const AnalyticsFieldValueCountSchema = z.object({
  value: z.string().describe("The submitted field value"),
  count: z.number().int().describe("Number of times this value appeared"),
});

export const AnalyticsFieldBreakdownResponseSchema = z.object({
  fieldId: z.string().uuid().describe("Field ID"),
  label: z.string().describe("Field label"),
  fieldType: z.string().describe("Field type"),
  totalResponses: z.number().int().describe("Total response count for this field"),
  uniqueSubmissionCount: z.number().int().describe("Distinct submission count for this field"),
  topValues: z.array(AnalyticsFieldValueCountSchema).describe("Most common values for this field"),
});
