"use server";
import { db } from "../lib/drizzle";
import { profilesTable } from "../db/schema";
import { eq } from "drizzle-orm";

import { me, User, profiles, Profiles as Profile } from "../data/data";

export async function getMe(): Promise<User> {
  return me;
}

export async function getMeProfiles(): Promise<Profile[]> {
  return profiles.filter((p) => p.user_id === "99");
}

export async function getProfileById(id: string): Promise<Profile> {
  const profile = profiles.filter((p) => p.id === id);
  return profile[0];
}

export async function addProfile(formData: FormData) {
  await db.insert(profilesTable).values({
    name: formData.get("name") as string,
    age: Number(formData.get("age")),
    img_url: formData.get("img") as string,
    introduction: formData.get("introduction_text") as string,
    owner_id: "1",
  });
}

export async function editProfile(formData: FormData) {
  await db
    .update(profilesTable)
    .set({
      name: formData.get("name") as string,
      age: Number(formData.get("age")),
      img_url: formData.get("img") as string,
      introduction: formData.get("introduction_text") as string,
      owner_id: "1",
    })
    .where(eq(profilesTable.id, Number(formData.get("id"))));
}

export async function deleteProfile(formData: FormData) {
  await db
    .delete(profilesTable)
    .where(eq(profilesTable.id, Number(formData.get("id"))));
}
