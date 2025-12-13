import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq, sql } from "drizzle-orm";
import { Pool } from "pg";

import {
  gendersTable,
  jobPostsTable,
  rolesTable,
  userEducationDegreesTable,
  userLanguagesTable,
  userSkillsTable,
  userSocialLinksTable,
  usersTable,
  userWorkExperiencesTable,
} from "./schema.js";
import { customLog, isNone } from "../helpers/utils.js";
import {
  DbError,
  DbResponse,
  DbResult,
  EducationDegree,
  JobPost,
  None,
  PreRegisterInfo,
  Transaction,
  User,
  WorkExperience,
} from "../helpers/types.js";
import {
  educationDegreesQuery,
  languageNamesQuery,
  skillsQuery,
  socialLinksQuery,
  workExperiencesQuery,
} from "./queries.js";

export const defaultFields = [
  "name",
  "email",
  "createdAt",
  "updatedAt",
  "lastLoginAt",
];

export let db: NodePgDatabase<Record<string, never>> & {
  $client: Pool;
};

export function connectDb() {
  db = drizzle(process.env.DATABASE_URL!);

  customLog("database", "Connected via drizzle");
}

export async function disconnectDb() {
  await db.$client.end();

  customLog("database", "Connection closed");
}

function makeDbResponse<T>(result: T, error: DbError): DbResponse<T> {
  return { result, error };
}

export async function emailExists(
  email: string
): Promise<DbResponse<DbResult>> {
  try {
    const result = await db
      .select({
        email: usersTable.id,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    return makeDbResponse(result[0], null);
  } catch (error) {
    return makeDbResponse(null, error as Error);
  }
}

export async function insertUser(
  preRegisterInfo: PreRegisterInfo
): Promise<DbResponse<DbResult>> {
  try {
    const result = await db
      .insert(usersTable)
      .values({
        name: preRegisterInfo.name,
        email: preRegisterInfo.email,
        password: preRegisterInfo.hashedPassword,
        roleId: 1,
      })
      .returning({
        id: usersTable.id,
      });

    return makeDbResponse(result[0]?.id, null);
  } catch (error) {
    return makeDbResponse(null, error as Error);
  }
}

export async function updateLastLogin(
  id: number
): Promise<DbResponse<true | null>> {
  try {
    await db
      .update(usersTable)
      .set({
        lastLoginAt: sql`NOW()`,
      })
      .where(eq(usersTable.id, id));

    return makeDbResponse(true, null);
  } catch (error) {
    return makeDbResponse(null, error as Error);
  }
}

export async function getUser(
  idOrEmail: number,
  fields: string[],
  getPassword: boolean = false
): Promise<DbResponse<Partial<User> | None>> {
  const columns: any = {
    id: usersTable.id,
    roleName: rolesTable.roleName,
  };

  let equality;
  if (typeof idOrEmail === "number") equality = eq(usersTable.id, idOrEmail);
  if (typeof idOrEmail === "string") equality = eq(usersTable.email, idOrEmail);

  if (fields.includes("name")) columns.name = usersTable.name;
  if (fields.includes("email")) columns.email = usersTable.email;
  if (getPassword) columns.hashedPassword = usersTable.password;

  if (fields.includes("skills")) columns.skills = skillsQuery;
  if (fields.includes("languageNames"))
    columns.languageNames = languageNamesQuery;
  if (fields.includes("socialLinks")) columns.socialLinks = socialLinksQuery;

  if (fields.includes("educationDegrees"))
    columns.educationDegrees = educationDegreesQuery;
  if (fields.includes("workExperiences"))
    columns.workExperiences = workExperiencesQuery;

  if (fields.includes("postalCode")) columns.postalCode = usersTable.postalCode;
  if (fields.includes("homeAddress"))
    columns.homeAddress = usersTable.homeAddress;
  if (fields.includes("genderName"))
    columns.genderName = gendersTable.genderName;
  if (fields.includes("jobTitle")) columns.jobTitle = usersTable.jobTitle;
  if (fields.includes("bio")) columns.bio = usersTable.bio;
  if (fields.includes("birthDate")) columns.birthDate = usersTable.birthDate;
  if (fields.includes("createdAt")) columns.createdAt = usersTable.createdAt;
  if (fields.includes("updatedAt")) columns.updatedAt = usersTable.updatedAt;

  try {
    const result = await db
      .select(columns)
      .from(usersTable)
      .innerJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
      .innerJoin(gendersTable, eq(usersTable.genderId, gendersTable.id))
      .where(equality);

    return makeDbResponse<User | None>(result[0] as unknown as User, null);
  } catch (error) {
    return makeDbResponse(null, error as Error);
  }
}

export async function updateUser(
  id: number,
  values: Partial<User>
): Promise<DbResponse<Partial<User> | None>> {
  try {
    const { skills, languageNames, socialLinks } = values;
    let { educationDegrees, workExperiences } = values;

    delete values.skills;
    delete values.languageNames;
    delete values.socialLinks;
    delete values.educationDegrees;
    delete values.workExperiences;

    educationDegrees = educationDegrees?.map(
      (value) => ((value.userId = id), value)
    );
    workExperiences = workExperiences?.map(
      (value) => ((value.userId = id), value)
    );

    const result = await db.transaction(async (tx: Transaction) => {
      await tx
        .update(usersTable)
        .set({ ...values, updatedAt: sql`NOW()` })
        .where(eq(usersTable.id, id));

      await insertSkills(tx, id, skills);
      await insertLanguages(tx, id, languageNames);
      await insertSocialLinks(tx, id, socialLinks);
      await insertEducationDegrees(
        tx,
        id,
        educationDegrees as Required<EducationDegree>[]
      );
      await insertWorkExperiences(
        tx,
        id,
        workExperiences as Required<WorkExperience>[]
      );

      const user = await tx
        .select({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          roleName: rolesTable.roleName,

          skills: skillsQuery,
          languageNames: languageNamesQuery,
          socialLinks: socialLinksQuery,

          educationDegrees: educationDegreesQuery,
          workExperiences: workExperiencesQuery,

          postalCode: usersTable.postalCode,
          homeAddress: usersTable.homeAddress,
          genderName: gendersTable.genderName,
          jobTitle: usersTable.jobTitle,
          bio: usersTable.bio,
          birthDate: usersTable.birthDate,
          createdAt: usersTable.createdAt,
          updatedAt: usersTable.updatedAt,
        })
        .from(usersTable)
        .innerJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
        .innerJoin(gendersTable, eq(usersTable.genderId, gendersTable.id))
        .where(eq(usersTable.id, id));

      return user[0];
    });

    return makeDbResponse(result, null);
  } catch (error) {
    return makeDbResponse(null, error as Error);
  }
}

async function insertSkills(
  tx: Transaction,
  id: number,
  skills: string[] | None
): Promise<void> {
  if (isNone(skills)) {
    return;
  }

  const skillsObjects = [];
  for (const skill of skills) {
    skillsObjects.push({ userId: id, skill: skill });
  }

  await tx.delete(userSkillsTable).where(eq(userSkillsTable.userId, id));

  if (skills.length === 0) {
    return;
  }

  await tx.insert(userSkillsTable).values(skillsObjects);
}

async function insertLanguages(
  tx: Transaction,
  id: number,
  languageNames: string[] | None
): Promise<void> {
  if (isNone(languageNames)) {
    return;
  }

  const userLanguages = [];
  for (const languageName of languageNames) {
    userLanguages.push({ userId: id, languageName: languageName });
  }

  await tx.delete(userLanguagesTable).where(eq(userLanguagesTable.userId, id));

  if (languageNames.length === 0) {
    return;
  }

  await tx.insert(userLanguagesTable).values(userLanguages);
}

async function insertSocialLinks(
  tx: Transaction,
  id: number,
  socialLinks: string[] | None
): Promise<void> {
  if (isNone(socialLinks)) {
    return;
  }

  const socialLinksObjects = [];
  for (const socialLink of socialLinks) {
    socialLinksObjects.push({ userId: id, link: socialLink });
  }

  await tx
    .delete(userSocialLinksTable)
    .where(eq(userSocialLinksTable.userId, id));

  if (socialLinks.length === 0) {
    return;
  }

  await tx.insert(userSocialLinksTable).values(socialLinksObjects);
}

async function insertEducationDegrees(
  tx: Transaction,
  id: number,
  educationDegrees: Required<EducationDegree>[] | None
): Promise<void> {
  if (isNone(educationDegrees)) {
    return;
  }

  await tx
    .delete(userEducationDegreesTable)
    .where(eq(userEducationDegreesTable.userId, id));

  if (educationDegrees.length === 0) {
    return;
  }

  await tx.insert(userEducationDegreesTable).values(educationDegrees);
}

async function insertWorkExperiences(
  tx: Transaction,
  id: number,
  workExperiences: Required<WorkExperience>[] | None
): Promise<void> {
  if (isNone(workExperiences)) {
    return;
  }

  await tx
    .delete(userWorkExperiencesTable)
    .where(eq(userWorkExperiencesTable.userId, id));

  if (workExperiences.length === 0) {
    return;
  }

  await tx.insert(userWorkExperiencesTable).values(workExperiences);
}

export async function insertJobPost(
  jobPost: JobPost
): Promise<DbResponse<DbResult>> {
  try {
    const result = await db.insert(jobPostsTable).values(jobPost).returning({
      id: jobPostsTable.id,
      createdAt: jobPostsTable.createdAt,
      updatedAt: jobPostsTable.updatedAt,
    });

    return makeDbResponse(result[0], null);
  } catch (error) {
    return makeDbResponse(null, error as Error);
  }
}
