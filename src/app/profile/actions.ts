"use server";

import { db } from "../lib/drizzle";
import { profilesTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";

export async function addProfile(formData: FormData) {
  await db.insert(profilesTable).values({
    name: formData.get("name") as string,
    age: Number(formData.get("age")),
    img_url: formData.get("img") as string,
    introduction: formData.get("introduction_text") as string,
    owner_id: "1",
  });

  updateTag("profile");
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

  updateTag("profile");
}

export async function deleteProfile(formData: FormData) {
  await db
    .delete(profilesTable)
    .where(eq(profilesTable.id, Number(formData.get("id"))));

  updateTag("profile");
}
