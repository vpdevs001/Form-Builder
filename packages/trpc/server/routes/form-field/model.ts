import { z } from "zod";

export const FieldTypeEnum = z.enum([
  "SHORT_TEXT",
  "LONG_TEXT",
  "EMAIL",
  "NUMBER",
  "SINGLE_SELECT",
  "MULTI_SELECT",
  "CHECKBOX",
  "DROPDOWN",
  "RATING",
  "DATE",
]);

export const FieldOptionSchema = z.object({
  id: z.uuid().optional().describe("Option ID (UUID)"),
  fieldId: z.uuid().optional().describe("Field ID (UUID)"),
  label: z.string().min(1).max(255).describe("Option display label"),
  value: z.string().min(1).max(255).describe("Option value code"),
  optionOrder: z.number().int().nonnegative().max(10000).describe("Sort order of the option"),
  createdAt: z.string().optional().describe("Option creation timestamp"),
});

export const FormFieldSchema = z.object({
  formId: z.uuid().describe("ID of the parent form (UUID)"),
  label: z.string().min(1).max(255).describe("Field label (question)"),
  placeholder: z.string().max(1000).optional().describe("Input placeholder text"),
  helpText: z.string().max(1000).optional().describe("Helpful tip below the field"),
  fieldType: FieldTypeEnum.describe("Type of form field"),
  isRequired: z.boolean().default(false).describe("Whether the field is mandatory"),
  fieldOrder: z.number().int().nonnegative().max(10000).describe("Sort order of the field"),
  defaultValue: z.string().max(5000).optional().describe("Default value as text"),
  validations: z.string().max(5000).optional().describe("JSON string for validation rules"),
  options: z
    .array(FieldOptionSchema)
    .optional()
    .describe("List of choices/options for selective fields"),
});

export const CreateFormFieldSchema = FormFieldSchema;

export const UpdateFormFieldSchema = FormFieldSchema.partial().extend({
  id: z.uuid().describe("ID of the field to update (UUID)"),
});

export const DeleteFormFieldSchema = z.object({
  id: z.uuid().describe("ID of the field to delete (UUID)"),
});

export const FormFieldFormIdSchema = z.object({
  formId: z.uuid().describe("ID of the parent form (UUID)"),
});

export const fieldOptionPublicSchema = z.object({
  id: z.uuid().describe("Option ID"),
  fieldId: z.uuid().describe("Field ID"),
  label: z.string().min(1).max(255).describe("Option label"),
  value: z.string().min(1).max(255).describe("Option value"),
  optionOrder: z.number().int().nonnegative().describe("Option order"),
  createdAt: z.string().describe("ISO 8601 creation timestamp"),
});

export const formFieldPublicSchema = z.object({
  id: z.uuid().describe("Unique identifier for the form field (UUID)"),
  formId: z.uuid().describe("ID of the parent form"),
  label: z.string().min(1).max(255).describe("Field label"),
  placeholder: z.string().max(1000).nullable().describe("Placeholder text"),
  helpText: z.string().max(1000).nullable().describe("Help text"),
  fieldType: FieldTypeEnum.describe("Field type"),
  isRequired: z.boolean().describe("Is the field required"),
  fieldOrder: z.number().int().nonnegative().describe("Sort order of the field"),
  defaultValue: z.string().max(5000).nullable().describe("Default value"),
  validations: z.string().max(5000).nullable().describe("JSON string for validation rules"),
  options: z.array(fieldOptionPublicSchema).describe("Select options associated with the field"),
  createdAt: z.string().describe("ISO 8601 creation timestamp"),
  updatedAt: z.string().describe("ISO 8601 update timestamp"),
});

export type CreateFormFieldInput = z.infer<typeof CreateFormFieldSchema>;
export type UpdateFormFieldInput = z.infer<typeof UpdateFormFieldSchema>;
export type DeleteFormFieldInput = z.infer<typeof DeleteFormFieldSchema>;
export type FormFieldFormIdInput = z.infer<typeof FormFieldFormIdSchema>;
export type FormFieldPublic = z.infer<typeof formFieldPublicSchema>;
