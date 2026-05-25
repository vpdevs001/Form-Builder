import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../../trpc";
import { formFieldService } from "../../services";
import { generatePath } from "../../utils/path-generator";
import {
  CreateFormFieldSchema,
  DeleteFormFieldSchema,
  formFieldPublicSchema,
  UpdateFormFieldSchema,
} from "./model";
import { z } from "zod";

const TAGS = ["Form Fields"];
const getPath = generatePath("/form-fields");

export const formFieldRouter = router({
  // ── POST /form-fields/create ──────────────────────────────────────────────
  create: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/create"), tags: TAGS } })
    .input(CreateFormFieldSchema)
    .output(formFieldPublicSchema)
    .mutation(async ({ input }) => {
      try {
        return await formFieldService.createField(input);
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST", message: (error as Error).message });
      }
    }),

  // ── PATCH /form-fields/update ──────────────────────────────────────────────
  update: publicProcedure
    .meta({ openapi: { method: "PATCH", path: getPath("/update"), tags: TAGS } })
    .input(UpdateFormFieldSchema)
    .output(formFieldPublicSchema)
    .mutation(async ({ input }) => {
      try {
        return await formFieldService.updateField(input);
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST", message: (error as Error).message });
      }
    }),

  // ── DELETE /form-fields/delete ─────────────────────────────────────────────
  delete: publicProcedure
    .meta({ openapi: { method: "DELETE", path: getPath("/delete"), tags: TAGS } })
    .input(DeleteFormFieldSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      try {
        return { success: await formFieldService.deleteField(input) };
      } catch (error) {
        throw new TRPCError({ code: "NOT_FOUND", message: (error as Error).message });
      }
    }),
});
