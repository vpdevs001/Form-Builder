import { pgTable, uuid, varchar, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./users.model";
import { formStatusEnum, visibilityEnum } from "./enums";

export const forms = pgTable("forms", {
  id: uuid("id").defaultRandom().primaryKey(),

  creatorId: uuid("creator_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),

  // Used in public URL: /f/:shareId  (nanoid generated)
  shareId: varchar("share_id", { length: 255 }).unique().notNull(),

  // Optional human-readable URL: /f/:slug  (bonus)
  slug: varchar("slug", { length: 255 }).unique(),

  // DRAFT = only creator can see, PUBLISHED = live, ARCHIVED = hidden
  status: formStatusEnum("status").default("DRAFT").notNull(),

  // Only relevant when status = PUBLISHED
  // PUBLIC = shown in explore page, UNLISTED = link-only
  visibility: visibilityEnum("visibility").default("PUBLIC").notNull(),

  // Pause submissions without unpublishing
  acceptsResponses: boolean("accepts_responses").default(true).notNull(),

  // Bonus: auto-close after N responses (null = unlimited)
  responseLimit: integer("response_limit"),

  // Bonus: auto-close after date (null = no expiry)
  expiresAt: timestamp("expires_at"),

  // Bonus: password gate
  isPasswordProtected: boolean("is_password_protected").default(false).notNull(),
  formPassword: text("form_password"), // bcrypt hash

  // Shown after successful submission
  thankYouMessage: text("thank_you_message").default("Thank you for your response!"),

  // Theme selection (Naruto, Death Note, Attack On Titan)
  // Stored as a simple string identifier
  theme: varchar("theme", { length: 30 }).notNull().default("Naruto"),

  // Email notification toggles
  notifyCreator: boolean("notify_creator").default(true).notNull(),
  notifyRespondent: boolean("notify_respondent").default(false).notNull(),

  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;
