import type { FormField, FieldOption } from "@repo/database/schema";
import type { FormFieldPublic, FieldOptionPublic } from "./types";

export function toPublicFieldOption(option: FieldOption): FieldOptionPublic {
  const { createdAt, ...rest } = option;
  return {
    ...rest,
    createdAt: createdAt.toISOString(),
  };
}

export function toPublicFormField(field: FormField, options: FieldOption[] = []): FormFieldPublic {
  const { createdAt, updatedAt, fieldType, ...rest } = field;
  return {
    ...rest,
    fieldType: fieldType as FormFieldPublic["fieldType"],
    options: options.map(toPublicFieldOption),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}
