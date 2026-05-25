import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../../trpc";
import { formService } from "../../services";
import { generatePath } from "../../utils/path-generator";
import {
  CreateFormSchema,
  DeleteFormOutputSchema,
  FormCreatorIdSchema,
  FormIdSchema,
  formPublicSchema,
  FormSettingsWithIdSchema,
  FormShareIdSchema,
  UpdateFormSchema,
} from "./model";
import { handleTRPCError } from "../../utils/handleError";
const TAGS = ["Forms"];
const getPath = generatePath("/forms");

export const formRouter = router({
  // ── POST /forms/create ────────────────────────────────────────────────────
  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/create"), tags: TAGS } })
    .input(CreateFormSchema)
    .output(formPublicSchema)
    .mutation(async ({ input }) => {
      try {
        return await formService.createForm(input);
      } catch (error) {
        handleTRPCError(error, "Failed to create form");
      }
    }),

  // ── GET /forms/by-id ──────────────────────────────────────────────────────
  getById: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/by-id"), tags: TAGS } })
    .input(FormIdSchema)
    .output(formPublicSchema)
    .query(async ({ input }) => {
      try {
        return await formService.getFormById(input);
      } catch (error) {
        handleTRPCError(error, "Form not found by id");
      }
    }),

  // ── GET /forms/by-share-id ────────────────────────────────────────────────
  getByShareId: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/by-share-id"), tags: TAGS } })
    .input(FormShareIdSchema)
    .output(formPublicSchema)
    .query(async ({ input }) => {
      try {
        return await formService.getFormByShareId(input);
      } catch (error) {
        handleTRPCError(error, "Form not found by share id");
      }
    }),

  // ── GET /forms/public ─────────────────────────────────────────────────────
  getPublic: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/public"), tags: TAGS } })
    .output(formPublicSchema.array())
    .query(async () => {
      try {
        return await formService.getPublicForms();
      } catch (error) {
        handleTRPCError(error, "Failed to get public forms");
      }
    }),

  // ── GET /forms/by-creator ─────────────────────────────────────────────────
  getByCreator: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/by-creator"), tags: TAGS } })
    .input(FormCreatorIdSchema)
    .output(formPublicSchema.array())
    .query(async ({ input }) => {
      try {
        return await formService.getFormsByCreator(input);
      } catch (error) {
        handleTRPCError(error, "Failed to get forms by creator");
      }
    }),

  // ── PATCH /forms/update ───────────────────────────────────────────────────
  update: protectedProcedure
    .meta({ openapi: { method: "PATCH", path: getPath("/update"), tags: TAGS } })
    .input(UpdateFormSchema)
    .output(formPublicSchema)
    .mutation(async ({ input }) => {
      try {
        return await formService.updateForm(input);
      } catch (error) {
        handleTRPCError(error, "Failed to update form");
      }
    }),

  // ── PATCH /forms/settings ─────────────────────────────────────────────────
  updateSettings: protectedProcedure
    .meta({ openapi: { method: "PATCH", path: getPath("/settings"), tags: TAGS } })
    .input(FormSettingsWithIdSchema)
    .output(formPublicSchema)
    .mutation(async ({ input }) => {
      try {
        return await formService.updateFormSettings(input);
      } catch (error) {
        handleTRPCError(error, "Failed to update form settings");
      }
    }),

  // ── POST /forms/publish ───────────────────────────────────────────────────
  publish: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/publish"), tags: TAGS } })
    .input(FormIdSchema)
    .output(formPublicSchema)
    .mutation(async ({ input }) => {
      try {
        return await formService.publishForm(input);
      } catch (error) {
        handleTRPCError(error, "Failed to publish form");
      }
    }),

  // ── POST /forms/archive ───────────────────────────────────────────────────
  archive: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/archive"), tags: TAGS } })
    .input(FormIdSchema)
    .output(formPublicSchema)
    .mutation(async ({ input }) => {
      try {
        return await formService.archiveForm(input);
      } catch (error) {
        handleTRPCError(error, "Failed to archive form");
      }
    }),

  // ── DELETE /forms/delete ──────────────────────────────────────────────────
  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: getPath("/delete"), tags: TAGS } })
    .input(FormIdSchema)
    .output(DeleteFormOutputSchema)
    .mutation(async ({ input }) => {
      try {
        return { success: await formService.deleteForm(input) };
      } catch (error) {
        handleTRPCError(error, "Failed to delete form");
      }
    }),
});
