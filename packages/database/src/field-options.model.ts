import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { formFields } from "./form-fields.model";

// Only used for SINGLE_SELECT, MULTI_SELECT, DROPDOWN fields
export const fieldOptions = pgTable("field_options", {
  id: uuid("id").defaultRandom().primaryKey(),

  fieldId: uuid("field_id")
    .references(() => formFields.id, { onDelete: "cascade" })
    .notNull(),

  label: varchar("label", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),

  optionOrder: integer("option_order").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type FieldOption = typeof fieldOptions.$inferSelect;
export type NewFieldOption = typeof fieldOptions.$inferInsert;
