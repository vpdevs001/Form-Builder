import { relations } from "drizzle-orm";
import { users } from "./users.model";
import { refreshTokens } from "./refresh-tokens.model";
import { forms } from "./forms.model";
import { formFields } from "./form-fields.model";
import { fieldOptions } from "./field-options.model";
import { submissions } from "./submissions.model";
import { submissionValues } from "./submission-values.model";

export const usersRelations = relations(users, ({ many }) => ({
  forms: many(forms),
  refreshTokens: many(refreshTokens),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, { fields: [refreshTokens.userId], references: [users.id] }),
}));

export const formsRelations = relations(forms, ({ one, many }) => ({
  creator: one(users, { fields: [forms.creatorId], references: [users.id] }),
  fields: many(formFields),
  submissions: many(submissions),
}));

export const formFieldsRelations = relations(formFields, ({ one, many }) => ({
  form: one(forms, { fields: [formFields.formId], references: [forms.id] }),
  options: many(fieldOptions),
  submissionValues: many(submissionValues),
}));

export const fieldOptionsRelations = relations(fieldOptions, ({ one }) => ({
  field: one(formFields, { fields: [fieldOptions.fieldId], references: [formFields.id] }),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  form: one(forms, { fields: [submissions.formId], references: [forms.id] }),
  submittedByUser: one(users, { fields: [submissions.submittedBy], references: [users.id] }),
  values: many(submissionValues),
}));

export const submissionValuesRelations = relations(submissionValues, ({ one }) => ({
  submission: one(submissions, {
    fields: [submissionValues.submissionId],
    references: [submissions.id],
  }),
  field: one(formFields, { fields: [submissionValues.fieldId], references: [formFields.id] }),
}));
