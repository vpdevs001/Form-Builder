import { randomBytes } from "crypto";
import { db } from "@repo/database";
import { eq } from "drizzle-orm";
import { forms, type Form } from "@repo/database/schema";
import { toPublicForm } from "./utils";
import type {
  ArchiveFormInput,
  CreateFormInput,
  DeleteFormInput,
  FormPublic,
  GetFormByIdInput,
  GetFormByShareIdInput,
  GetFormsByCreatorInput,
  PublishFormInput,
  UpdateFormInput,
  UpdateFormSettingsInput,
} from "./types";

/** Generates a URL-safe 10-character share ID using Node's built-in crypto. */
function generateShareId(): string {
  return randomBytes(7).toString("base64url").slice(0, 10);
}

class FormService {
  // ─── Helpers ───────────────────────────────────────────────────────────────

  private async getFormOrThrow(id: string): Promise<Form> {
    const [form] = await db.select().from(forms).where(eq(forms.id, id));
    if (!form) {
      throw new Error("Form not found");
    }
    return form;
  }

  // ─── Create ────────────────────────────────────────────────────────────────

  public async createForm(input: CreateFormInput): Promise<FormPublic> {
    const { creatorId, title, description, slug, ...rest } = input;

    if (slug) {
      const [existing] = await db.select().from(forms).where(eq(forms.slug, slug));
      if (existing) {
        throw new Error("Slug is already taken");
      }
    }

    const shareId = generateShareId();

    const [created] = await db
      .insert(forms)
      .values({
        creatorId,
        title,
        description,
        slug,
        shareId,
        status: rest.status ?? "DRAFT",
        visibility: rest.visibility ?? "PUBLIC",
        acceptsResponses: rest.acceptsResponses ?? true,
        responseLimit: rest.responseLimit,
        expiresAt: rest.expiresAt,
        isPasswordProtected: rest.isPasswordProtected ?? false,
        formPassword: rest.formPassword,
        thankYouMessage: rest.thankYouMessage ?? "Thank you for your response!",
        theme: rest.theme ?? "Naruto",
        notifyCreator: rest.notifyCreator ?? true,
        notifyRespondent: rest.notifyRespondent ?? false,
      })
      .returning();

    if (!created) {
      throw new Error("Failed to create form");
    }

    return toPublicForm(created);
  }

  // ─── Read ──────────────────────────────────────────────────────────────────

  public async getFormById({ id }: GetFormByIdInput): Promise<FormPublic> {
    const form = await this.getFormOrThrow(id);
    return toPublicForm(form);
  }

  public async getFormByShareId({ shareId }: GetFormByShareIdInput): Promise<FormPublic> {
    const [form] = await db.select().from(forms).where(eq(forms.shareId, shareId));
    if (!form) {
      throw new Error("Form not found");
    }
    return toPublicForm(form);
  }

  public async getFormsByCreator({ creatorId }: GetFormsByCreatorInput): Promise<FormPublic[]> {
    const rows = await db.select().from(forms).where(eq(forms.creatorId, creatorId));
    return rows.map(toPublicForm);
  }

  // ─── Update ────────────────────────────────────────────────────────────────

  public async updateForm({ id, slug, ...rest }: UpdateFormInput): Promise<FormPublic> {
    await this.getFormOrThrow(id);

    if (slug) {
      const [conflict] = await db.select().from(forms).where(eq(forms.slug, slug));
      if (conflict && conflict.id !== id) {
        throw new Error("Slug is already taken");
      }
    }

    const [updated] = await db
      .update(forms)
      .set({ ...rest, slug, updatedAt: new Date() })
      .where(eq(forms.id, id))
      .returning();

    if (!updated) {
      throw new Error("Failed to update form");
    }

    return toPublicForm(updated);
  }

  public async updateFormSettings({
    id,
    theme,
    thankYouMessage,
    notifyCreator,
    notifyRespondent,
  }: UpdateFormSettingsInput): Promise<FormPublic> {
    await this.getFormOrThrow(id);

    const setValues: Partial<Form> = { updatedAt: new Date() };
    if (theme !== undefined) setValues.theme = theme;
    if (thankYouMessage !== undefined) setValues.thankYouMessage = thankYouMessage;
    if (notifyCreator !== undefined) setValues.notifyCreator = notifyCreator;
    if (notifyRespondent !== undefined) setValues.notifyRespondent = notifyRespondent;

    const [updated] = await db.update(forms).set(setValues).where(eq(forms.id, id)).returning();

    if (!updated) {
      throw new Error("Failed to update form settings");
    }

    return toPublicForm(updated);
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  public async publishForm({ id }: PublishFormInput): Promise<FormPublic> {
    await this.getFormOrThrow(id);

    const [published] = await db
      .update(forms)
      .set({ status: "PUBLISHED", publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(forms.id, id))
      .returning();

    if (!published) {
      throw new Error("Failed to publish form");
    }

    return toPublicForm(published);
  }

  public async archiveForm({ id }: ArchiveFormInput): Promise<FormPublic> {
    await this.getFormOrThrow(id);

    const [archived] = await db
      .update(forms)
      .set({ status: "ARCHIVED", updatedAt: new Date() })
      .where(eq(forms.id, id))
      .returning();

    if (!archived) {
      throw new Error("Failed to archive form");
    }

    return toPublicForm(archived);
  }

  // ─── Delete ────────────────────────────────────────────────────────────────

  public async deleteForm({ id }: DeleteFormInput): Promise<boolean> {
    await this.getFormOrThrow(id);
    await db.delete(forms).where(eq(forms.id, id));
    return true;
  }
}

export default FormService;
