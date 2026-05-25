import type { Form } from "@repo/database/schema";

export type AnalyticsDateInterval = "DAY" | "WEEK" | "MONTH";

export type FormSummary = {
  formId: string;
  totalSubmissions: number;
  uniqueRespondentEmails: number;
  firstSubmissionAt: string | null;
  lastSubmissionAt: string | null;
  responseLimit: number | null;
  responsesRemaining: number | null;
  acceptsResponses: boolean;
  isExpired: boolean;
  publishedAt: string | null;
};

export type SubmissionTrendPoint = {
  period: string;
  count: number;
};

export type RecentSubmission = {
  id: string;
  formId: string;
  submittedBy: string | null;
  ipAddress: string;
  userAgent: string | null;
  respondentEmail: string | null;
  createdAt: string;
};

export type FieldValueCount = {
  value: string;
  count: number;
};

export type FieldBreakdown = {
  fieldId: string;
  label: string;
  fieldType: string;
  totalResponses: number;
  uniqueSubmissionCount: number;
  topValues: FieldValueCount[];
};

export type GetFormSummaryInput = {
  formId: string;
  userId: string;
};

export type GetSubmissionTrendInput = {
  formId: string;
  userId: string;
  from?: string;
  to?: string;
  interval?: AnalyticsDateInterval;
};

export type GetRecentSubmissionsInput = {
  formId: string;
  userId: string;
  limit?: number;
};

export type GetFieldBreakdownInput = {
  formId: string;
  userId: string;
  fieldId?: string;
};

export type AnalyticsContext = {
  form: Form;
};
