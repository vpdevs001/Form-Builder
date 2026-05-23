import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER"]);

export const formStatusEnum = pgEnum("form_status", ["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const visibilityEnum = pgEnum("visibility", ["PUBLIC", "UNLISTED", "PRIVATE"]);

export const fieldTypeEnum = pgEnum("field_type", [
  "SHORT_TEXT",
  "LONG_TEXT",
  "EMAIL",
  "NUMBER",
  "SINGLE_SELECT",
  "MULTI_SELECT",
  "CHECKBOX",
  "DROPDOWN",
  "RATING",
  "DATE",
]);
