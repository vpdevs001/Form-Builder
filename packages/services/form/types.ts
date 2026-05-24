import type { Form } from "@repo/database/schema";

// ─── Public shape ────────────────────────────────────────────────────────────
// Dates serialised to ISO strings so the type is safe to send over the wire.
// theme and visibility are narrowed from their drizzle-inferred string types
// to the actual literal unions the DB enforces.
export type FormPublic = Omit<Form, "createdAt" | "updatedAt" | "publishedAt" | "expiresAt" | "theme" | "visibility"> & {
  theme: "Naruto" | "Death Note" | "Attack On Titan";
  visibility: "PUBLIC" | "UNLISTED" | "PRIVATE";
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  expiresAt: string | null;
};


// ─── Input types ─────────────────────────────────────────────────────────────
export type CreateFormInput = {
  creatorId: string;
  title: string;
  description?: string;
  slug?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  visibility?: "PUBLIC" | "UNLISTED" | "PRIVATE";
  acceptsResponses?: boolean;
  responseLimit?: number;
  expiresAt?: Date;
  isPasswordProtected?: boolean;
  formPassword?: string;
  thankYouMessage?: string;
  theme?: "Naruto" | "Death Note" | "Attack On Titan";
  notifyCreator?: boolean;
  notifyRespondent?: boolean;
};

export type UpdateFormInput = Partial<CreateFormInput> & {
  id: string;
};

export type GetFormByIdInput = {
  id: string;
};

export type GetFormByShareIdInput = {
  shareId: string;
};

export type GetFormsByCreatorInput = {
  creatorId: string;
};

export type DeleteFormInput = {
  id: string;
};

export type PublishFormInput = {
  id: string;
};

export type ArchiveFormInput = {
  id: string;
};

export type UpdateFormSettingsInput = {
  id: string;
  theme?: "Naruto" | "Death Note" | "Attack On Titan";
  thankYouMessage?: string;
  notifyCreator?: boolean;
  notifyRespondent?: boolean;
};
