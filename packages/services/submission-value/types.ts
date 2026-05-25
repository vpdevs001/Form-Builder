import type { SubmissionValue } from "@repo/database/schema";

export interface CreateSubmissionValueInput {
  submissionId: string;
  fieldId: string;
  value: string;
}

export interface GetValuesBySubmissionIdInput {
  submissionId: string;
}

export interface GetValuesByFieldIdInput {
  fieldId: string;
}

export type SubmissionValuePublic = SubmissionValue;
