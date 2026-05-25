import { db } from "@repo/database";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { formFields, forms, submissionValues, submissions } from "@repo/database/schema";
import type {
  FieldBreakdown,
  FormSummary,
  GetFieldBreakdownInput,
  GetFormSummaryInput,
  GetRecentSubmissionsInput,
  GetSubmissionTrendInput,
  RecentSubmission,
  SubmissionTrendPoint,
} from "./types";
import { safeParseDate, formatPeriod, countValues } from "./utils";
import { handleServiceError } from "../errors";
class AnalyticsService {
  private async getFormOrThrow(formId: string) {
    const [form] = await db.select().from(forms).where(eq(forms.id, formId));
    if (!form) {
      throw new Error("Form not found");
    }
    return form;
  }

  private verifyCreator(form: { creatorId: string }, userId: string) {
    if (form.creatorId !== userId) {
      throw new Error("Unauthorized access to analytics");
    }
  }

  public async getFormSummary({ formId, userId }: GetFormSummaryInput): Promise<FormSummary> {
    try {
      const form = await this.getFormOrThrow(formId);
      this.verifyCreator(form, userId);

      const rows = await db.select().from(submissions).where(eq(submissions.formId, formId));
      const totalSubmissions = rows.length;
      const respondentSet = new Set(
        rows.filter((row) => row.respondentEmail).map((row) => row.respondentEmail),
      );
      const sorted = [...rows].sort(
        (a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0),
      );

      const responseLimit = form.responseLimit ?? null;
      const responsesRemaining =
        responseLimit === null ? null : Math.max(responseLimit - totalSubmissions, 0);
      const isExpired = form.expiresAt ? new Date() >= form.expiresAt : false;

      const first = sorted[0];
      const last = sorted[sorted.length - 1];

      const firstSubmissionAt = first?.createdAt ? first.createdAt.toISOString() : null;
      const lastSubmissionAt = last?.createdAt ? last.createdAt.toISOString() : null;

      return {
        formId,
        totalSubmissions,
        uniqueRespondentEmails: respondentSet.size,
        firstSubmissionAt,
        lastSubmissionAt,
        responseLimit,
        responsesRemaining,
        acceptsResponses: form.acceptsResponses,
        isExpired,
        publishedAt: form.publishedAt ? form.publishedAt.toISOString() : null,
      };
    } catch (error) {
      handleServiceError(error, "Failed to get form summary");
    }
  }

  public async getSubmissionTrend({
    formId,
    userId,
    from,
    to,
    interval = "DAY",
  }: GetSubmissionTrendInput): Promise<SubmissionTrendPoint[]> {
    try {
      const form = await this.getFormOrThrow(formId);
      this.verifyCreator(form, userId);

      const startDate = safeParseDate(from);
      const endDate = safeParseDate(to);
      const filters = [eq(submissions.formId, formId)];

      if (startDate) filters.push(gte(submissions.createdAt, startDate));
      if (endDate) filters.push(lte(submissions.createdAt, endDate));

      const rows = await db
        .select()
        .from(submissions)
        .where(and(...filters));
      const buckets = new Map<string, number>();

      for (const row of rows) {
        const period = formatPeriod(row.createdAt, interval);
        buckets.set(period, (buckets.get(period) ?? 0) + 1);
      }

      return Array.from(buckets.entries())
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([period, count]) => ({ period, count }));
    } catch (error) {
      handleServiceError(error, "Failed to get submission trend");
    }
  }

  public async getRecentSubmissions({
    formId,
    userId,
    limit = 10,
  }: GetRecentSubmissionsInput): Promise<RecentSubmission[]> {
    try {
      const form = await this.getFormOrThrow(formId);
      this.verifyCreator(form, userId);

      const rows = await db.select().from(submissions).where(eq(submissions.formId, formId));
      return [...rows]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit)
        .map((submission) => ({
          ...submission,
          createdAt: submission.createdAt.toISOString(),
        }));
    } catch (error) {
      handleServiceError(error, "Failed to get recent submissions");
    }
  }

  public async getFieldBreakdown({
    formId,
    userId,
    fieldId,
  }: GetFieldBreakdownInput): Promise<FieldBreakdown[]> {
    try {
      const form = await this.getFormOrThrow(formId);
      this.verifyCreator(form, userId);

      const fields = await db.select().from(formFields).where(eq(formFields.formId, formId));

      const selectedFields = fieldId ? fields.filter((field) => field.id === fieldId) : fields;
      const results: FieldBreakdown[] = [];

      for (const field of selectedFields) {
        const values = await db
          .select()
          .from(submissionValues)
          .where(eq(submissionValues.fieldId, field.id));
        const totalResponses = values.length;
        const uniqueSubmissionCount = new Set(values.map((value) => value.submissionId)).size;
        const topValues = countValues(
          values.map((value) => value.value),
          field.fieldType,
        );

        results.push({
          fieldId: field.id,
          label: field.label,
          fieldType: field.fieldType,
          totalResponses,
          uniqueSubmissionCount,
          topValues,
        });
      }

      return results;
    } catch (error) {
      handleServiceError(error, "Failed to get field breakdown");
    }
  }
}

export default AnalyticsService;
