import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../../trpc";
import { formFieldService } from "../../services";
import { generatePath } from "../../utils/path-generator";
import {
  CreateFormFieldSchema,
  DeleteFormFieldSchema,
  formFieldPublicSchema,
  UpdateFormFieldSchema,
} from "./model";
import { handleTRPCError } from "../../utils/handleError";
import { z } from "zod";

const TAGS = ["Form Fields"];
const getPath = generatePath("/form-fields");

export const formFieldRouter = router({
  // ── POST /form-fields/create ──────────────────────────────────────────────
  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/create"), tags: TAGS } })
    .input(CreateFormFieldSchema)
    .output(formFieldPublicSchema)
    .mutation(async ({ input }) => {
      try {
        return await formFieldService.createField(input);
      } catch (error) {
        handleTRPCError(error, "Failed to create form field");
      }
    }),

  // ── PATCH /form-fields/update ──────────────────────────────────────────────
  update: protectedProcedure
    .meta({ openapi: { method: "PATCH", path: getPath("/update"), tags: TAGS } })
    .input(UpdateFormFieldSchema)
    .output(formFieldPublicSchema)
    .mutation(async ({ input }) => {
      try {
        return await formFieldService.updateField(input);
      } catch (error) {
        handleTRPCError(error, "Failed to update form field");
      }
    }),

  // ── DELETE /form-fields/delete ─────────────────────────────────────────────
  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: getPath("/delete"), tags: TAGS } })
    .input(DeleteFormFieldSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      try {
        return { success: await formFieldService.deleteField(input) };
      } catch (error) {
        handleTRPCError(error, "Form field not found");
      }
    }),
});
