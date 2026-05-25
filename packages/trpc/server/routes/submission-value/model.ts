import { z } from "zod";

export const CreateSubmissionValueSchema = z.object({
  submissionId: z.string().uuid(),
  fieldId: z.string().uuid(),
  value: z.string(),
});

export const SubmissionIdSchema = z.object({
  submissionId: z.string().uuid(),
});

export const FieldIdSchema = z.object({
  fieldId: z.string().uuid(),
});

export const submissionValuePublicSchema = z.object({
  id: z.string().uuid(),
  submissionId: z.string().uuid(),
  fieldId: z.string().uuid(),
  value: z.string(),
  createdAt: z.date(),
});
