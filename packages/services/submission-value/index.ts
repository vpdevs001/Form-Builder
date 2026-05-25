import { db } from "@repo/database";
import { eq } from "drizzle-orm";
import { submissionValues } from "@repo/database/schema";
import { toPublicSubmissionValue } from "./utils";
import type {
  CreateSubmissionValueInput,
  GetValuesBySubmissionIdInput,
  GetValuesByFieldIdInput,
  SubmissionValuePublic,
} from "./types";

class SubmissionValueService {
  public async createSubmissionValue(input: CreateSubmissionValueInput): Promise<SubmissionValuePublic> {
    const [created] = await db
      .insert(submissionValues)
      .values(input)
      .returning();

    if (!created) {
      throw new Error("Failed to create submission value");
    }

    return toPublicSubmissionValue(created);
  }

  public async getValuesBySubmissionId({ submissionId }: GetValuesBySubmissionIdInput): Promise<SubmissionValuePublic[]> {
    const rows = await db.select().from(submissionValues).where(eq(submissionValues.submissionId, submissionId));
    return rows.map(toPublicSubmissionValue);
  }

  public async getValuesByFieldId({ fieldId }: GetValuesByFieldIdInput): Promise<SubmissionValuePublic[]> {
    const rows = await db.select().from(submissionValues).where(eq(submissionValues.fieldId, fieldId));
    return rows.map(toPublicSubmissionValue);
  }
}

export default SubmissionValueService;
