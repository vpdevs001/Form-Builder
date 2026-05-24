import { z } from "zod";

export const FormStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
export const VisibilityEnum = z.enum(["PUBLIC", "UNLISTED", "PRIVATE"]);

export const FormSchema = z.object({
  creatorId: z.uuid().describe("ID of the user who creates the form"),

  title: z.string().min(1).max(255).describe("Form title"),
  description: z.string().max(5000).optional().describe("Detailed description"),

  shareId: z.string().min(1).max(255).describe("Backend‑generated share ID"),

  slug: z.string().max(255).optional().describe("User‑provided slug for cleaner URLs"),

  status: FormStatusEnum.describe("Form lifecycle status"),
  visibility: VisibilityEnum.describe("Visibility of the form"),

  acceptsResponses: z.boolean().default(true).describe("Whether the form accepts responses"),

  responseLimit: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Maximum number of responses allowed"),

  expiresAt: z.coerce.date().optional().describe("Expiration date of the form"),

  isPasswordProtected: z
    .boolean()
    .default(false)
    .describe("If true, a password is required to submit"),
  formPassword: z.string().optional().describe("Hashed password for protected forms"),

  thankYouMessage: z
    .string()
    .max(1000)
    .optional()
    .default("Thank you for your response!")
    .describe("Message displayed after submission"),

  theme: z
    .enum(["Naruto", "Death Note", "Attack On Titan"])
    .default("Naruto")
    .describe("Selected UI theme"),

  notifyCreator: z.boolean().default(true).describe("Notify the creator on new responses"),
  notifyRespondent: z.boolean().default(false).describe("Notify respondent on status changes"),

  publishedAt: z.coerce.date().optional().describe("Date when form was published"),

  createdAt: z.coerce.date().optional().describe("Creation timestamp"),
  updatedAt: z.coerce.date().optional().describe("Last update timestamp"),
});

export const CreateFormSchema = FormSchema.omit({ shareId: true });

export const UpdateFormSchema = FormSchema.partial().extend({
  id: z.uuid(),
});

export const FormSettingsSchema = z.object({
  theme: z
    .enum(["Naruto", "Death Note", "Attack On Titan"])
    .default("Naruto")
    .describe("Selected UI theme"),
  thankYouMessage: z.string().max(1000).optional().describe("Message displayed after submission"),
  notifyCreator: z.boolean().optional().describe("Notify the creator on new responses"),
  notifyRespondent: z.boolean().optional().describe("Notify respondent on status changes"),
});

export const FormIdSchema = z.object({
  id: z.uuid().describe("Form ID"),
});

export const FormShareIdSchema = z.object({
  shareId: z.string().min(1).max(255).describe("Public share ID"),
});

export const FormCreatorIdSchema = z.object({
  creatorId: z.uuid().describe("Creator user ID"),
});

export const FormSettingsWithIdSchema = FormSettingsSchema.extend({
  id: z.uuid().describe("Form ID to update"),
});

export const DeleteFormOutputSchema = z.object({ success: z.boolean() });

// ─── Output schema ────────────────────────────────────────────────────────────
// Wire-safe shape returned by every form procedure.
// Dates are serialised to ISO 8601 strings by the service layer.
export const formPublicSchema = z.object({
  id: z.uuid().describe("Unique identifier for the form (UUID)"),
  creatorId: z.uuid().describe("ID of the user who created the form"),
  title: z.string().min(1).max(255).describe("Form title"),
  description: z.string().max(5000).nullable().describe("Detailed description"),
  shareId: z.string().min(1).max(255).describe("Nanoid-generated public share identifier"),
  slug: z.string().max(255).nullable().describe("User-provided slug for cleaner URLs"),
  status: FormStatusEnum.describe("Form lifecycle status"),
  visibility: VisibilityEnum.describe("Visibility of the form"),
  acceptsResponses: z.boolean().describe("Whether the form accepts responses"),
  responseLimit: z
    .number()
    .int()
    .positive()
    .nullable()
    .describe("Maximum number of responses allowed"),
  expiresAt: z.string().min(1).max(32).nullable().describe("ISO 8601 expiry timestamp"),
  isPasswordProtected: z.boolean().describe("If true, a password is required to submit"),
  formPassword: z.string().nullable().describe("Hashed password for protected forms"),
  thankYouMessage: z.string().max(1000).nullable().describe("Message displayed after submission"),
  theme: z.enum(["Naruto", "Death Note", "Attack On Titan"]).describe("Selected UI theme"),
  notifyCreator: z.boolean().describe("Notify the creator on new responses"),
  notifyRespondent: z.boolean().describe("Notify respondent on status changes"),
  publishedAt: z.string().min(1).max(32).nullable().describe("ISO 8601 published-at timestamp"),
  createdAt: z.string().min(1).max(32).describe("ISO 8601 creation timestamp"),
  updatedAt: z.string().min(1).max(32).describe("ISO 8601 last-update timestamp"),
});

export type FormPublic = z.infer<typeof formPublicSchema>;

// ─── Inferred input types ────────────────────────────────────────────────────
export type CreateFormInput = z.infer<typeof CreateFormSchema>;
export type UpdateFormInput = z.infer<typeof UpdateFormSchema>;
export type FormSettingsInput = z.infer<typeof FormSettingsSchema>;
export type FormSettingsWithIdInput = z.infer<typeof FormSettingsWithIdSchema>;
