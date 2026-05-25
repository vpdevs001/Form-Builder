import type { Form } from "@repo/database/schema";
import type { FormPublic } from "./types";

export function toPublicForm(form: Form): FormPublic {
  const { createdAt, updatedAt, publishedAt, expiresAt, theme, visibility, ...rest } = form;
  return {
    ...rest,
    formPassword: null,
    theme: theme as FormPublic["theme"],
    visibility: visibility as FormPublic["visibility"],
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    publishedAt: publishedAt ? publishedAt.toISOString() : null,
    expiresAt: expiresAt ? expiresAt.toISOString() : null,
  };
}
