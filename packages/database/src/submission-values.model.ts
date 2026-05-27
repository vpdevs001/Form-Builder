import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { submissions } from "./submissions.model";
import { formFields } from "./form-fields.model";

export const submissionValues = pgTable("submission_values", {
  id: uuid("id").defaultRandom().primaryKey(),

  submissionId: uuid("submission_id")
    .references(() => submissions.id, { onDelete: "cascade" })
    .notNull(),

  fieldId: uuid("field_id")
    .references(() => formFields.id, { onDelete: "cascade" })
    .notNull(),

  // For multi-select store as JSON string: '["option1","option2"]'
  value: text("value").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SubmissionValue = typeof submissionValues.$inferSelect;
export type NewSubmissionValue = typeof submissionValues.$inferInsert;
