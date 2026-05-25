import { db } from "@repo/database";
import { eq } from "drizzle-orm";
import { formFields, fieldOptions, type FormField, type FieldOption } from "@repo/database/schema";
import { toPublicFormField } from "./utils";
import type {
  CreateFormFieldInput,
  UpdateFormFieldInput,
  DeleteFormFieldInput,
  FormFieldPublic,
} from "./types";

class FormFieldService {
  // ─── Helpers ───────────────────────────────────────────────────────────────

  private async getFieldOrThrow(id: string): Promise<FormField> {
    const [field] = await db.select().from(formFields).where(eq(formFields.id, id));
    if (!field) {
      throw new Error("Form field not found");
    }
    return field;
  }

  // ─── Create ────────────────────────────────────────────────────────────────

  public async createField(input: CreateFormFieldInput): Promise<FormFieldPublic> {
    const { options, ...fieldData } = input;

    const result = await db.transaction(async (tx) => {
      const [createdField] = await tx
        .insert(formFields)
        .values({
          formId: fieldData.formId,
          label: fieldData.label,
          placeholder: fieldData.placeholder ?? null,
          helpText: fieldData.helpText ?? null,
          fieldType: fieldData.fieldType,
          isRequired: fieldData.isRequired ?? false,
          fieldOrder: fieldData.fieldOrder,
          defaultValue: fieldData.defaultValue ?? null,
          validations: fieldData.validations ?? null,
        })
        .returning();

      if (!createdField) {
        throw new Error("Failed to create form field");
      }

      let createdOptions: FieldOption[] = [];
      if (options && options.length > 0) {
        createdOptions = await tx
          .insert(fieldOptions)
          .values(
            options.map((opt) => ({
              fieldId: createdField.id,
              label: opt.label,
              value: opt.value,
              optionOrder: opt.optionOrder,
            }))
          )
          .returning();
      }

      return { field: createdField, options: createdOptions };
    });

    return toPublicFormField(result.field, result.options);
  }

  // ─── Update ────────────────────────────────────────────────────────────────

  public async updateField(input: UpdateFormFieldInput): Promise<FormFieldPublic> {
    const { id, options, ...fieldData } = input;
    await this.getFieldOrThrow(id);

    const result = await db.transaction(async (tx) => {
      const updateValues: Partial<FormField> = {};
      
      if (fieldData.label !== undefined) updateValues.label = fieldData.label;
      if (fieldData.placeholder !== undefined) updateValues.placeholder = fieldData.placeholder;
      if (fieldData.helpText !== undefined) updateValues.helpText = fieldData.helpText;
      if (fieldData.fieldType !== undefined) updateValues.fieldType = fieldData.fieldType;
      if (fieldData.isRequired !== undefined) updateValues.isRequired = fieldData.isRequired;
      if (fieldData.fieldOrder !== undefined) updateValues.fieldOrder = fieldData.fieldOrder;
      if (fieldData.defaultValue !== undefined) updateValues.defaultValue = fieldData.defaultValue;
      if (fieldData.validations !== undefined) updateValues.validations = fieldData.validations;
      updateValues.updatedAt = new Date();

      const [updatedField] = await tx
        .update(formFields)
        .set(updateValues)
        .where(eq(formFields.id, id))
        .returning();

      if (!updatedField) {
        throw new Error("Failed to update form field");
      }

      if (options !== undefined) {
        // Delete all old options and insert new ones
        await tx.delete(fieldOptions).where(eq(fieldOptions.fieldId, id));

        let updatedOptions: FieldOption[] = [];
        if (options.length > 0) {
          updatedOptions = await tx
            .insert(fieldOptions)
            .values(
              options.map((opt) => ({
                fieldId: id,
                label: opt.label,
                value: opt.value,
                optionOrder: opt.optionOrder,
              }))
            )
            .returning();
        }
        return { field: updatedField, options: updatedOptions };
      } else {
        // Fetch existing options
        const currentOptions = await tx
          .select()
          .from(fieldOptions)
          .where(eq(fieldOptions.fieldId, id));
        return { field: updatedField, options: currentOptions };
      }
    });

    return toPublicFormField(result.field, result.options);
  }

  // ─── Delete ────────────────────────────────────────────────────────────────

  public async deleteField({ id }: DeleteFormFieldInput): Promise<boolean> {
    await this.getFieldOrThrow(id);
    await db.delete(formFields).where(eq(formFields.id, id));
    return true;
  }
}

export default FormFieldService;
