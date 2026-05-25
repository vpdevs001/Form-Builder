import { compare } from "bcryptjs";
import { db } from "@repo/database";
import { eq } from "drizzle-orm";
import { submissions, submissionValues, forms, users, type Submission } from "@repo/database/schema";
import { sendEmail } from "../mailer";
import { toPublicSubmission } from "./utils";
import type {
  CreateSubmissionInput,
  DeleteSubmissionInput,
  GetSubmissionByIdInput,
  GetSubmissionsByFormIdInput,
  GetSubmissionsByUserInput,
  SubmissionPublic,
} from "./types";

class SubmissionService {
  // ─── Helpers ───────────────────────────────────────────────────────────────

  private async getSubmissionOrThrow(id: string): Promise<Submission> {
    const [submission] = await db.select().from(submissions).where(eq(submissions.id, id));

    if (!submission) {
      throw new Error("Submission not found");
    }

    return submission;
  }

  // ─── Create ────────────────────────────────────────────────────────────────

  public async createSubmission(input: CreateSubmissionInput): Promise<SubmissionPublic> {
    const { formId, values, submittedBy, ipAddress, userAgent, respondentEmail, formPassword } = input;

    const [form] = await db.select().from(forms).where(eq(forms.id, formId));
    if (!form) {
      throw new Error("Form not found");
    }

    if (form.visibility === "PRIVATE" || form.status !== "PUBLISHED") {
      throw new Error("This form is not currently accepting submissions");
    }

    if (!form.acceptsResponses) {
      throw new Error("This form is not currently accepting submissions");
    }

    if (form.expiresAt && new Date() >= form.expiresAt) {
      throw new Error("This form has expired and no longer accepts responses");
    }

    if (form.responseLimit !== null && form.responseLimit !== undefined) {
      const existingSubmissions = await db.select().from(submissions).where(eq(submissions.formId, formId));
      if (existingSubmissions.length >= form.responseLimit) {
        throw new Error("This form has reached the maximum number of responses");
      }
    }

    if (form.isPasswordProtected) {
      if (!formPassword) {
        throw new Error("Password is required to submit this form");
      }

      const passwordMatches = await compare(formPassword, form.formPassword ?? "");
      if (!passwordMatches) {
        throw new Error("Incorrect form password");
      }
    }

    const [created] = await db
      .insert(submissions)
      .values({
        formId,
        submittedBy,
        ipAddress,
        userAgent,
        respondentEmail,
      })
      .returning();

    if (!created) {
      throw new Error("Failed to create submission");
    }

    if (values.length > 0) {
      await db.insert(submissionValues).values(
        values.map((v) => ({
          submissionId: created.id,
          fieldId: v.fieldId,
          value: v.value,
        })),
      );
    }

    const [creator] = await db
      .select()
      .from(users)
      .where(eq(users.id, form.creatorId));

    const emailTasks: Promise<void>[] = [];

    if (form.notifyCreator && creator?.email) {
      emailTasks.push(
        sendEmail({
          to: creator.email,
          subject: `New response for your form \"${form.title}\"`,
          text: `Your form "${form.title}" just received a new response.

Respondent email: ${respondentEmail ?? "Not provided"}

You can view submissions in your dashboard.`,
        }),
      );
    }

    if (form.notifyRespondent && respondentEmail) {
      emailTasks.push(
        sendEmail({
          to: respondentEmail,
          subject: `Thanks for submitting \"${form.title}\"`,
          text: `Thank you for submitting your response to "${form.title}".

${form.thankYouMessage}

If you need help, contact the form creator at ${creator?.email ?? "their email"}.`,
        }),
      );
    }

    if (emailTasks.length > 0) {
      const results = await Promise.allSettled(emailTasks);
      results.forEach((result) => {
        if (result.status === "rejected") {
          console.error("Failed to send notification email", result.reason);
        }
      });
    }

    return toPublicSubmission(created);
  }

  // ─── Read ──────────────────────────────────────────────────────────────────

  public async getSubmissionById({ id }: GetSubmissionByIdInput): Promise<SubmissionPublic> {
    const submission = await this.getSubmissionOrThrow(id);
    return toPublicSubmission(submission);
  }

  public async getSubmissionsByFormId({
    formId,
    userId,
  }: GetSubmissionsByFormIdInput): Promise<SubmissionPublic[]> {
    const [form] = await db.select().from(forms).where(eq(forms.id, formId));
    if (!form) {
      throw new Error("Form not found");
    }

    if (form.creatorId !== userId) {
      throw new Error("Unauthorized access to form submissions");
    }

    const rows = await db.select().from(submissions).where(eq(submissions.formId, formId));
    return rows.map(toPublicSubmission);
  }

  public async getSubmissionsByUser({
    userId,
  }: GetSubmissionsByUserInput): Promise<SubmissionPublic[]> {
    const rows = await db.select().from(submissions).where(eq(submissions.submittedBy, userId));

    return rows.map(toPublicSubmission);
  }

  // ─── Delete ────────────────────────────────────────────────────────────────

  public async deleteSubmission({ id }: DeleteSubmissionInput): Promise<{ success: boolean }> {
    const submission = await this.getSubmissionOrThrow(id);

    await db.delete(submissions).where(eq(submissions.id, submission.id));

    return { success: true };
  }
}

export default SubmissionService;
