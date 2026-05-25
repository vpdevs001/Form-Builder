import type { SubmissionValue } from "@repo/database/schema";
import type { SubmissionValuePublic } from "./types";

export const toPublicSubmissionValue = (value: SubmissionValue): SubmissionValuePublic => {
  return value;
};
