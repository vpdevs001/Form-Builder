import { z } from "zod";

export const SubmissionValueSchema = z.object({
  fieldId: z.uuid().describe("ID of the form field"),
  value: z.string().describe("The submitted value for this field"),
});

export const SubmissionSchema = z.object({
  id: z.uuid().describe("Unique identifier for the submission (UUID)"),
  formId: z.uuid().describe("ID of the form being submitted"),
  submittedBy: z
    .uuid()
    .optional()
    .nullable()
    .describe("ID of the user who submitted (null for anonymous)"),
  ipAddress: z.string().describe("IP address of the submitter"),
  userAgent: z.string().optional().describe("User agent of the submitter"),
  respondentEmail: z
    .string()
    .email()
    .optional()
    .nullable()
    .describe("Email captured from form submission"),
  createdAt: z.coerce.date().optional().describe("Creation timestamp"),
});

export const CreateSubmissionSchema = z.object({
  formId: z.uuid().describe("ID of the form being submitted"),
  submittedBy: z.uuid().optional().describe("ID of the user who submitted (optional)"),
  ipAddress: z.string().describe("IP address of the submitter"),
  userAgent: z.string().optional().describe("User agent of the submitter"),
  respondentEmail: z.string().email().optional().describe("Email captured from form submission"),
  values: z.array(SubmissionValueSchema).describe("Array of field values being submitted"),
});

export const SubmissionIdSchema = z.object({
  id: z.uuid().describe("Submission ID"),
});

export const UserIdSchema = z.object({
  userId: z.uuid().describe("User ID"),
});

export const DeleteSubmissionOutputSchema = z.object({
  success: z.boolean(),
});

// ─── Output schema ────────────────────────────────────────────────────────────
// Wire-safe shape returned by every submission procedure.
// Dates are serialised to ISO 8601 strings by the service layer.
export const submissionPublicSchema = z.object({
  id: z.uuid().describe("Unique identifier for the submission (UUID)"),
  formId: z.uuid().describe("ID of the form being submitted"),
  submittedBy: z.uuid().nullable().describe("ID of the user who submitted (null for anonymous)"),
  ipAddress: z.string().describe("IP address of the submitter"),
  userAgent: z.string().nullable().describe("User agent of the submitter"),
  respondentEmail: z.string().nullable().describe("Email captured from form submission"),
  createdAt: z.string().describe("Creation timestamp as ISO 8601 string"),
});
