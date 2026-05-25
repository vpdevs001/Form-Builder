import type { FormField, FieldOption } from "@repo/database/schema";

export type FieldOptionPublic = Omit<FieldOption, "createdAt"> & {
  createdAt: string;
};

export type FormFieldPublic = Omit<FormField, "fieldType" | "createdAt" | "updatedAt"> & {
  fieldType:
    | "SHORT_TEXT"
    | "LONG_TEXT"
    | "EMAIL"
    | "NUMBER"
    | "SINGLE_SELECT"
    | "MULTI_SELECT"
    | "CHECKBOX"
    | "DROPDOWN"
    | "RATING"
    | "DATE";
  options: FieldOptionPublic[];
  createdAt: string;
  updatedAt: string;
};

export type CreateFormFieldInput = {
  formId: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  fieldType: FormFieldPublic["fieldType"];
  isRequired?: boolean;
  fieldOrder: number;
  defaultValue?: string;
  validations?: string;
  options?: {
    label: string;
    value: string;
    optionOrder: number;
  }[];
};

export type UpdateFormFieldInput = Partial<Omit<CreateFormFieldInput, "formId">> & {
  id: string;
};

export type DeleteFormFieldInput = {
  id: string;
};
