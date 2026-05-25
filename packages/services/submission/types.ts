import type { Submission, SubmissionValue } from "@repo/database/schema";

// ─── Public shape ────────────────────────────────────────────────────────────
// Dates serialised to ISO strings so the type is safe to send over the wire.
export type SubmissionPublic = Omit<Submission, "createdAt"> & {
  createdAt: string;
  values?: SubmissionValuePublic[];
};

export type SubmissionValuePublic = Omit<SubmissionValue, "createdAt"> & {
  createdAt: string;
};

// ─── Input types ─────────────────────────────────────────────────────────────
export type CreateSubmissionInput = {
  formId: string;
  submittedBy?: string; // optional user ID
  ipAddress: string;
  userAgent?: string;
  respondentEmail?: string;
  values: Array<{
    fieldId: string;
    value: string;
  }>;
};

export type DeleteSubmissionInput = {
  id: string;
};

export type GetSubmissionByIdInput = {
  id: string;
};

export type GetSubmissionsByUserInput = {
  userId: string;
};
