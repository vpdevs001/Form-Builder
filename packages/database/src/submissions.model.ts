import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { forms } from "./forms.model.js";
import { users } from "./users.model.js";

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),

  formId: uuid("form_id")
    .references(() => forms.id, { onDelete: "cascade" })
    .notNull(),

  // null = anonymous public submission (the primary case)
  submittedBy: uuid("submitted_by").references(() => users.id, {
    onDelete: "set null",
  }),

  // Required for rate limiting (hard requirement in brief)
  ipAddress: varchar("ip_address", { length: 45 }).notNull(),
  userAgent: text("user_agent"),

  // Captured if respondent fills an email field — used for confirmation email
  respondentEmail: varchar("respondent_email", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
