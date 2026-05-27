import { pgTable, uuid, varchar, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { forms } from "./forms.model";
import { fieldTypeEnum } from "./enums";

export const formFields = pgTable("form_fields", {
  id: uuid("id").defaultRandom().primaryKey(),

  formId: uuid("form_id")
    .references(() => forms.id, { onDelete: "cascade" })
    .notNull(),

  label: varchar("label", { length: 255 }).notNull(),

  placeholder: text("placeholder"),
  helpText: text("help_text"),

  fieldType: fieldTypeEnum("field_type").notNull(),

  isRequired: boolean("is_required").default(false).notNull(),

  fieldOrder: integer("field_order").notNull(),

  defaultValue: text("default_value"),

  // JSON string for Zod validation rules, varies by field type:
  // SHORT_TEXT / LONG_TEXT: { minLength?, maxLength?, pattern? }
  // NUMBER:                 { min?, max?, isInteger? }
  // DATE:                   { minDate?, maxDate? }
  // RATING:                 { max? }   (default 1–5)
  // SELECT types:           { minSelections?, maxSelections? }
  validations: text("validations"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type FormField = typeof formFields.$inferSelect;
export type NewFormField = typeof formFields.$inferInsert;
