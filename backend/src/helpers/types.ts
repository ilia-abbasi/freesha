import { ExtractTablesWithRelations } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";
import { QueryResult } from "pg";

import {
  jobPostsTable,
  userEducationDegreesTable,
  userWorkExperiencesTable,
} from "../database/schema.js";

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface User {
  id: number;
  name: string;
  email: string;
  hashedPassword?: string;
  roleId?: number;
  roleName?: string;

  postalCode?: string;
  homeAddress?: string;
  genderId?: number;
  jobTitle?: string;
  bio?: string;
  birthDate?: string | null;

  skills?: string[];
  languageNames?: string[];
  socialLinks?: string[];

  educationDegrees?: EducationDegree[];
  workExperiences?: WorkExperience[];

  createdAt?: Date;
  updatedAt?: Date;
}

export interface DbResponse<T> {
  result: T;
  error: DbError;
}

export interface ResObj {
  message: string;
  data: Object;
}

export type PreRegisterInfo = Required<
  Pick<User, "name" | "email" | "hashedPassword">
>;

export type SessionData = Required<
  Pick<User, "id" | "name" | "email" | "roleName">
>;

export type Tag = "server" | "database" | "redis";
export type RoleName = "user" | "admin";
export type JobPostStatus = "pending" | "accepted" | "cancelled" | "done";
export type GenderName = "N" | "M" | "F";
export type None = undefined | null;
export type DbResult = QueryResult | Object | Object[] | null | undefined;
export type DbError = Error | None;
export type RedisValue = string | number | null;
export type EducationDegree = Optional<
  typeof userEducationDegreesTable.$inferSelect,
  "userId"
>;
export type WorkExperience = Optional<
  typeof userWorkExperiencesTable.$inferSelect,
  "userId"
>;
export type JobPost = Optional<
  typeof jobPostsTable.$inferSelect,
  "id" | "createdAt" | "updatedAt"
>;
export type Transaction = PgTransaction<
  NodePgQueryResultHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>;

export type LanguageCode =
  | "en"
  | "fa"
  | "tr"
  | "ar"
  | "zh"
  | "he"
  | "es"
  | "ru"
  | "de"
  | "fr"
  | "it"
  | "pl"
  | "pt"
  | "ja"
  | "ko"
  | "ur"
  | "sv"
  | "no"
  | "fi"
  | "cy"
  | "hy"
  | "el"
  | "da"
  | "ku"
  | "hi"
  | "az"
  | "eo"
  | "nl"
  | "uk"
  | "ro"
  | "cs"
  | "hu"
  | "vi"
  | "th"
  | "id"
  | "ms"
  | "tl"
  | "bn"
  | "pa"
  | "mr"
  | "gu"
  | "ta"
  | "te"
  | "kn"
  | "ml"
  | "my"
  | "si"
  | "ne"
  | "sa"
  | "am"
  | "sw"
  | "yo"
  | "ig"
  | "ha"
  | "so"
  | "zu"
  | "xh"
  | "af"
  | "sq"
  | "eu"
  | "be"
  | "bs"
  | "bg"
  | "ca"
  | "hr"
  | "et"
  | "ka"
  | "is"
  | "ga"
  | "kk"
  | "ky"
  | "lv"
  | "lt"
  | "mk"
  | "mt"
  | "mn"
  | "ps"
  | "sr"
  | "sk"
  | "sl"
  | "tg"
  | "tk"
  | "ug"
  | "uz"
  | "lo"
  | "km"
  | "bo"
  | "zh"
  | "qu"
  | "gn"
  | "mi"
  | "sm"
  | "to"
  | "fj"
  | "haw"
  | "la"
  | "grc";
