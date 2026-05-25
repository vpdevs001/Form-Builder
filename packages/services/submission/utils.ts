import type { Submission } from "@repo/database/schema";
import type { SubmissionPublic } from "./types";

export function toPublicSubmission(submission: Submission): SubmissionPublic {
  const { createdAt, ...rest } = submission;
  return {
    ...rest,
    createdAt: createdAt.toISOString(),
  };
}
