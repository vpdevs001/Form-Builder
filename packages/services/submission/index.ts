import { db } from "@repo/database";
import { eq, and } from "drizzle-orm";
import { submissions, submissionValues, forms, type Submission } from "@repo/database/schema";
import { toPublicSubmission } from "./utils";
import type {
  CreateSubmissionInput,
  DeleteSubmissionInput,
  GetSubmissionByIdInput,
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
    const { formId, values, submittedBy, ipAddress, userAgent, respondentEmail } = input;

    // Check form visibility
    const [form] = await db.select().from(forms).where(eq(forms.id, formId));
    if (!form) {
      throw new Error("Form not found");
    }
    if (form.visibility === "PRIVATE" || form.status !== "PUBLISHED") {
      throw new Error("This form is not currently accepting submissions");
    }

    // Insert submission
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

    // Insert submission values
    if (values.length > 0) {
      await db.insert(submissionValues).values(
        values.map((v) => ({
          submissionId: created.id,
          fieldId: v.fieldId,
          value: v.value,
        })),
      );
    }

    return toPublicSubmission(created);
  }

  // ─── Read ──────────────────────────────────────────────────────────────────

  public async getSubmissionById({ id }: GetSubmissionByIdInput): Promise<SubmissionPublic> {
    const submission = await this.getSubmissionOrThrow(id);
    return toPublicSubmission(submission);
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
